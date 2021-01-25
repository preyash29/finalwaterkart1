import React from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { notificationIcon, editIcon, deleteIcon } from '../../assets'
import { IconButton } from '../../components/Button'
import WarnDialog from '../../components/Dialog/WarnDialog'
import Header from '../../components/Header'
import colors from '../../constants/colors'
import env from '../../constants/env'
import { getAddressList, deleteAddress } from '../../actions'

class MyAddresses extends React.Component {

  state = {
    deleteId: null
  }

  componentDidMount() {
    this.props.getAddressList()
  }

  _deleteWarn = (data) => {
    this.setState({ warn: true, deleteId: data.id })
  }

  _delete = () => {
    this.props.deleteAddress(this.state.deleteId)
    this.setState({ warn: false, deleteId: null })
  }


  render() {

    return (
      <View style={styles.root}>
        <Header
          title='My Location'
        />

        <View style={styles.container} >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingVertical: 20 }}
          >
            <View style={{ paddingHorizontal: 20 }}>
              <Text style={styles.widgetTitle}>My Saved Location</Text>
              {
                this.props.addressList?.map(this.renderItem)
              }
            </View>
            <View style={styles.devider} />
            <TouchableOpacity
              style={{ paddingHorizontal: 20, marginTop: 20 }}
              onPress={() => this.props.navigation.navigate('addAddress')}
            >
              <Text style={{ fontFamily: env.fontPoppinsMedium, color: colors.blueLight, fontSize: 16, marginBottom: 3 }}> + Add new location</Text>
            </TouchableOpacity>

          </ScrollView>

        </View>

        {/* Hidden components */}

        <WarnDialog
          isVisible={this.state.warn}
          rightText='DELETE IT'
          leftText='CANCEL'
          message={`Delete Address${'\n'}Once you've deleted your address, it cannot be undone.`}
          leftAction={() => this.setState({ warn: false })}
          rightAction={this._delete}
        />
      </View>
    )
  }

  renderItem = (item, index) => {
    let addressName = 'Other'

    if (item.address_type === '1') addressName = 'Home'
    else if (item.address_type === '2') addressName = 'Office'

    return (
      <View
        key={String(index)}
        style={{ borderBottomWidth: 1, borderBottomColor: '#D7D7D7', paddingVertical: 10 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontFamily: env.fontPoppinsMedium, color: colors.blueLight, fontSize: 16, marginBottom: 3 }}>{addressName}</Text>
          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={() => this.props.navigation.navigate('addAddress', { editData: item })}
          >
            <Image source={editIcon} style={styles.actionIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this._deleteWarn(item)}
          >
            <Image source={deleteIcon} style={styles.actionIcon} />
          </TouchableOpacity>

        </View>
        <Text style={{ fontFamily: env.fontPoppinsRegular, color: '#747474', fontSize: 14, flex: 1 }}>Name:  {item.name}</Text>
        <Text style={{ fontFamily: env.fontPoppinsRegular, color: '#747474', fontSize: 14, flex: 1 }}>Mobile number:  {item.mobile}</Text>

        <Text style={{ fontFamily: env.fontPoppinsRegular, color: '#747474', fontSize: 14, flex: 1 }}>{item.floor_info}, {item.address}</Text>
        {/* {
          item.landmark && (<Text style={{ fontFamily: env.fontPoppinsRegular, color: '#747474', fontSize: 14, flex: 1 }}>Landmark:  {item.landmark}</Text>)
        } */}
        <Text style={{ fontFamily: env.fontPoppinsMedium, color: '#747474', fontSize: 14, marginTop: 10 }}>{item.lift_available === 1 && 'Lift available'}</Text>
      </View>
    )
  }

}

function mapStateToProps({ user }) {
  return ({
    addressList: user.addressList
  })
}

export default connect(mapStateToProps, {
  getAddressList,
  deleteAddress
})(MyAddresses)

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden'
  },
  item: {
    borderBottomWidth: 3,
    borderBottomColor: '#F6F6F6',
    padding: 20
  },
  buttonText: {
    fontFamily: env.fontSemiBold,
    fontSize: 14,
    color: colors.white
  },
  titleText: {
    fontFamily: env.fontSemiBold,
    fontSize: 15,
    color: colors.black
  },
  validText: {
    fontFamily: env.fontMedium,
    fontSize: 14,
    color: colors.black
  },
  widgetTitle: {
    fontFamily: env.fontPoppinsBold,
    fontSize: 16,
    color: '#474747'
  },
  actionIcon: {
    resizeMode: 'contain',
    width: 14,
    height: 14,
    marginTop: 0,
    margin: 8
  },
  devider: {
    backgroundColor: '#F6F6F6',
    height: 8,
    marginTop: -1.5
  },
  textFieldTitle: {
    fontFamily: env.fontLight,
    fontSize: 15,
    color: '#313131',
    marginBottom: -5
  },
  textFied: {
    borderBottomWidth: 1,
    borderBottomColor: '#B4B4B4',
    height: 45,
    fontFamily: env.fontMedium
  }
})
