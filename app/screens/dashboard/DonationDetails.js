import React from 'react'
import { View, StyleSheet, Image, Text, ScrollView, TouchableOpacity, Linking, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import colors from '../../constants/colors'
import {
  deliveryIcon,
  warehoursIcon,
  appratmentstorageIcon,
  arrowrightIcon,
  callCenterIcon,
  mobileIcon,
  webIcon,
  backIcon
} from '../../assets'
import env from '../../constants/env'
import { BoxInputField } from '../../components/InputField'
import AddressSection from '../../components/AddressSection'
import { Button, IconButton } from '../../components/Button'
import AlertDialog from '../../components/Dialog/AlertDialog'
import { rootLoader, addCorporateBooking, corporateBookingSetting } from '../../actions'
import Header from '../../components/Header'
import HTML from 'react-native-render-html'
const {width} = Dimensions.get('screen')

class DonationDetails extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: props.route.params?.data,
      cname: '',
      contactPerson: '',
      mobile: '',
      message: '',
      addressId: null,
      settings: null
    }
  }







  _openList = (uri) => {
    Linking.openURL(uri)
      .catch(error => {
        // alert(error)
      })
  }

  render() {
    const { data, settings } = this.state

    return (
      <View style={styles.root}>
        <Header
          title={data.title}
          left={
            <IconButton
              icon={backIcon}
              containerStyle={{ marginHorizontal: 5 }}
              onPress={() => this.props.navigation.goBack()}
            />
          }
        />
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
          >

            <View
              style={{
                overflow: 'hidden',
                borderRadius: 30,
                width: width * 0.25,
                height: width * 0.25,
                alignSelf: 'center',
                margin: 30
              }}
            >
              <Image
                source={{ uri: data?.image }}
                style={{ height: '100%', width: '100%', borderRadius: 30 }}
              />
            </View>

            <View style={{ marginHorizontal: 20 }}>
              <Text style={styles.inputTitle}>Contact By</Text>

              <View style={[styles.row, { justifyContent: 'space-around', marginTop: 15 }]}>

                <TouchableOpacity
                  style={{ padding: 10, alignItems: 'center' }}
                  onPress={() => this._openList(`tel:${data?.call_center_number}`)}
                >
                  <Image source={callCenterIcon} style={styles.stockIcon} />
                  <Text style={{ fontFamily: env.fontMedium, fontSize: 14, color: colors.black }}>Call center</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ padding: 10, alignItems: 'center' }}
                  onPress={() => this._openList(data?.website_url)}
                >
                  <Image source={webIcon} style={styles.stockIcon} />
                  <Text style={{ fontFamily: env.fontMedium, fontSize: 14, color: colors.black }}>Website</Text>
                </TouchableOpacity>

                
              </View>
              <View style={{ height: 20 }} />
              <Text style={[styles.inputTitle, { color: colors.blueLight }]}>Contact Us</Text>
              <View style={{ height: 10 }} />
              <Text style={styles.inputTitle}>{data?.contact_person_name} : +91 {data?.contact_person_number}</Text>
              <View style={{ height: 40 }} />
              <Text style={styles.inputTitle}>Description : </Text>
              {
                data?.description ? (
                  <HTML
                    html={data?.description}
                    contentWidth={width}
                  />
                ) : null
              }



            </View>

            {/* <TouchableOpacity
            style={styles.footer}
          >
            <Text style={{ fontFamily: env.fontSemiBold, fontSize: 14, color: colors.black, textAlign: 'center' }}>Conatct waterkart sales team</Text>
          </TouchableOpacity> */}

          </ScrollView>
        </View>
        <AlertDialog
          isVisible={this.state.alert}
          message={this.state.alertMessage}
          onAction={() => this.setState({ alert: false })}
        />

      </View>
    )
  }
}

export default connect(null, {
  rootLoader,
  addCorporateBooking
})(DonationDetails)

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
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  stockIcon: {
    resizeMode: 'contain',
    width: 35,
    height: 35,
    marginBottom: 10
  },
  rowItem: {
    margin: 20,
    alignItems: 'center',
    flex: 1 / 3
  },
  rowItemTitle: {
    textAlign: 'center',
    fontSize: 11,
    fontFamily: env.fontMedium
  },
  inputTitle: {
    fontFamily: env.fontMedium,
    color: colors.black,
    fontSize: 15
  },
  footer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#BFE2FF'
  }
})
