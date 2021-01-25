import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity, FlatList, Platform, Linking, RefreshControl } from 'react-native'
import colors from '../../../constants/colors'
import { navigateIcon, arrowrightIcon, locationIcon, notificationIcon } from '../../../assets'
import env from '../../../constants/env'
import { deliveryOrder, closedeliveryOrder, rootLoader, send_customer_order_verify_otp_to_customer, getDeliverymanHome } from '../../../actions'
import SaleClosure from '../../../components/Dialog/SaleClosure'
import ReasonForReject from '../../../components/Dialog/ReasonForReject'
import { connect, useSelector } from 'react-redux'


class Upcomming extends React.Component {

  constructor() {
    super()

    this.state = {
      saleClosur: false,
      reason: false,
      tempData: null,
      refreshing: false
    }
  }

  onRefresh = async () => {
    this.setState({ refreshing: true })
    await this.props.getDeliverymanHome()
    this.setState({ refreshing: false })
  }


  openLocation = (latitude, longitude) => {
    const location = `${latitude},${longitude}`
    const url = Platform.select({
      ios: `maps:${location}`,
      android: `geo:${location}?center=${location}&q=${location}&z=16`
    })
    Linking.openURL(url)
  }

  _deliveryOrder = async (otp) => {
    let res = await this.props.deliveryOrder({ otp, order_id: this.state.tempData.id })
    return res
  }

  _closeRequest = (data) => {
    this.setState({ reason: true, tempData: data })
  }

  _closeOrder = async (data) => {
    console.log(data)
    this.props.rootLoader(true)
    let res = await this.props.closedeliveryOrder({ 
      order_id: this.state.tempData.id,
      reason: data.reason.value,
      reason_message: data.reason_message
     })
    this.props.rootLoader(false)
  }

  _sendOTP = (data) => {
    send_customer_order_verify_otp_to_customer({ order_id: data.id })
    this.setState({ saleClosur: true, tempData: data })
  }

  _
  render() {
    const homeData = this.props.homeData
    return (
      <View style={styles.root}>
        <FlatList
          data={homeData?.upcoming_orders}
          keyExtractor={(it, i) => String(i)}
          renderItem={this.renderItem}
          contentContainerStyle={{ flexGrow: 1, paddingVertical: 10 }}
          ListEmptyComponent={this.renderEmpty}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} colors={['#018CFF']} />
          }
        />

        <SaleClosure
          isVisible={this.state.saleClosur}
          title="Enter OTP sent to Customer's Registered Number"
          onClose={() => this.setState({ saleClosur: false, tempData: null })}
          callBack={this._deliveryOrder}
        />
        <ReasonForReject
          isVisible={this.state.reason}
          onClose={() => this.setState({ reason: false })}
          onSubmit={this._closeOrder}
        />
      </View>
    )
  }

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.item}
        activeOpacity={1}
      onPress={() => this.props.navigation.navigate('orderDetails', { data: item })}
      >

        <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>

          <Text style={styles.titleText}>{item?.customer.first_name} {item?.customer.last_name}</Text>
          <TouchableOpacity
            style={styles.row}
            onPress={() => this.openLocation(item?.delivery_address?.latitude, item?.delivery_address?.longitude)}
          >
            <Image source={navigateIcon} style={styles.navigateIcon} />
            <Text style={[styles.otherText, { marginHorizontal: 5, color: '#2F2F2F', fontFamily: env.fontSemiBold }]}>Navigation</Text>
            <Image source={arrowrightIcon} style={styles.navigateIcon} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 10 }} />
        <View style={styles.row}>
          <Image source={locationIcon} style={styles.itemIcon} />
          <Text style={[styles.otherText, { flex: 1 }]}>{item?.delivery_address?.floor_info} {item?.delivery_address?.address}</Text>
        </View>
        <View style={{ height: 10 }} />
        <View style={[styles.row, { alignItems: 'center' }]}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => this._sendOTP(item)}
          >
            <Text style={[styles.otherText, { color: colors.white }]}>Delivery</Text>
          </TouchableOpacity>
          <View style={{ width: 10 }} />
          <TouchableOpacity
            onPress={() => this._closeRequest(item)}
          >
            <Text style={[styles.otherText, { color: '#ff0000' }]}>Close</Text>
          </TouchableOpacity>
          {/* <View style={{ width: 2, backgroundColor: colors.gray, height: '50%', marginHorizontal: 20 }} />
          <Text style={styles.otherText}>Close</Text> */}

          {/* <View style={styles.row}>
            <Image source={navigateIcon} style={styles.navigateIcon} />
            <Text style={[styles.otherText, { marginHorizontal: 5, color: '#2F2F2F', fontFamily: env.fontSemiBold }]}>Navigation</Text>
            <Image source={arrowrightIcon} style={styles.navigateIcon} />
          </View> */}
        </View>
      </TouchableOpacity>
    )
  }

  renderEmpty = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontFamily: env.fontRegular, color: colors.gray }}>No result found.</Text>
      </View>
    )
  }

}

function mapStateToProps({ comman }) {
  return {
    homeData: comman.homeData
  }
}

export default connect(mapStateToProps, {
  deliveryOrder,
  closedeliveryOrder,
  getDeliverymanHome,
  rootLoader
})(Upcomming)


const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white
  },
  row: {
    flexDirection: 'row'
  },
  item: {
    padding: 20,
    marginHorizontal: 15,
    marginTop: 10,
    borderBottomWidth: 4,
    borderBottomColor: '#ECECEC'
  },
  titleText: {
    fontFamily: env.fontSemiBold,
    fontSize: 16,
    color: colors.black
  },
  otherText: {
    fontFamily: env.fontMedium,
    fontSize: 14,
    color: '#616161',
    marginTop: -3
  },
  itemIcon: {
    resizeMode: 'contain',
    width: 14,
    height: 14,
    marginRight: 10,
    tintColor: '#616161'
  },
  navigateIcon: {
    resizeMode: 'contain',
    width: 14,
    height: 14,
    tintColor: '#2F2F2F'
  },
  btn: {
    backgroundColor: colors.blueLight,
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
    paddingHorizontal: 20
  }
})
