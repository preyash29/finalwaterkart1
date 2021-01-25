import React, { Component } from 'react'
import { View, StyleSheet, Text, Image, FlatList, Dimensions, Linking, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { notificationIcon } from '../../assets'
import { IconButton } from '../../components/Button'
import colors from '../../constants/colors'
import env from '../../constants/env'
import Header from '../../components/Header'
import { getDonations, rootLoader } from '../../actions'

const { width } = Dimensions.get('screen')

class Donate extends Component {

  constructor() {
    super()
    this.state = {
      data: null,
      errorMessage: ''
    }
  }

  componentDidMount() {
    this.initData()
  }

  initData = async () => {
    this.props.rootLoader(true)
    let res = await getDonations()
    this.props.rootLoader(false)
    if (res.status) {
      this.setState({ data: res.data, isLoading: false })
    } else {
      this.setState({ errorMessage: res.message })
    }
  }

  _openList = (uri) => {
    Linking.openURL(uri)
    .catch(error => {
      alert(error)
    })
  }

  render() {
    return (
      <View style={styles.root}>
        <Header
          title='Donate'
        />
        <View style={styles.container}>

          <FlatList
            data={this.state.data}
            keyExtractor={(it, i) => String(i)}
            renderItem={this.renderItem}
            contentContainerStyle={{ flexGrow: 1, paddingTop: 10 }}
            ListEmptyComponent={this.renderEmpty}
          />

        </View>

      </View>
    )
  }

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ borderBottomWidth: 1, padding: 20, borderBottomColor: 'rgba(130, 130, 130, 0.3)' }}
        // onPress={() => this._openList(item.website_url)}
        onPress={() => this.props.navigation.navigate('donationDetails', { data: item })}
      >
        <View style={styles.row}>
          <View
            style={{
              overflow: 'hidden',
              borderRadius: 30,
              width: width * 0.25,
              height: width * 0.25,
              marginRight: 20
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{ height: '100%', width: '100%', borderRadius: 30 }}
            />
          </View>
          <View style={{ justifyContent: 'space-between', flex: 1 }}>
            <Text numberOfLines={2} style={styles.itemTitle}>{item.title}</Text>
            {/* <Text numberOfLines={3} style={styles.itemdesc}>{item.description}</Text> */}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderEmpty = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontFamily: env.fontRegular, color: colors.gray }}>{this.state.errorMessage || 'No donation available'}</Text>
      </View>
    )
  }
}

export default connect(null, {
  rootLoader
})(Donate)

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden'
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: env.fontSemiBold,
    color: '#3F3F3F',
    marginBottom: 5
  },
  itemdesc: {
    fontSize: 14,
    fontFamily: env.fontMedium,
    color: '#3F3F3F'
  }
})
