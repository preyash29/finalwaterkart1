import momen from 'moment'
import React from 'react'
import { Dimensions, Image, Linking, Platform, StyleSheet, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { Shadow } from 'react-native-neomorph-shadows'
import { connect } from 'react-redux'
import { send_vendor_order_verify_otp_to_vendor, verify_otp_vendor_order } from '../../actions'
import { backIcon, clockIcon, localIcon, phoneIcon, usernameIcon, writingIcon, directionIcon } from '../../assets'
import { Button, IconButton, SimpleButton } from '../../components/Button'
import SaleClosure from '../../components/Dialog/SaleClosure'
import WarnDialog from '../../components/Dialog/WarnDialog'
import Header from '../../components/Header'
import colors from '../../constants/colors'
import env from '../../constants/env'

const { width } = Dimensions.get('screen')

class OrderDetails extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: props.route.params?.data
    }
  }

  openLocation = (latitude, longitude) => {
    const location = `${latitude},${longitude}`
    const url = Platform.select({
      ios: `maps:${location}`,
      android: `geo:${location}?center=${location}&q=${location}&z=16`
    })
    Linking.openURL(url)
  }

  openLocation = (latitude, longitude) => {
    const location = `${latitude},${longitude}`
    const url = Platform.select({
      ios: `maps:${location}`,
      android: `geo:${location}?center=${location}&q=${location}&z=16`
    })
    Linking.openURL(url)
  }


  _openLink = (uri) => {
    Linking.openURL(uri)
      .catch(error => {
        // alert(error)
      })
  }

  _sendOTP = () => {
    if (this.state.data?.payment_status === '2' || this.state.data?.payment_status === 2) {
      this.setState({ alert: true })
      return
    }
    send_vendor_order_verify_otp_to_vendor({ order_id: this.state.data.id })
    this.setState({ saleClosur: true })
  }

  _deliveryOrder = async (otp) => {
    let res = await verify_otp_vendor_order({ otp, order_id: this.state.data.id })
    if (res.status) {
      this.props.navigation.goBack()
      if (this.props.route.params?.orderRef)
        this.props.route.params?.orderRef()
    }
    return res
  }

  _deliveredOrderCOD = async () => {
    send_vendor_order_verify_otp_to_vendor({ order_id: this.state.data.id })
    this.setState({ alert: false })
    this.props.navigation.goBack()
    if (this.props.route.params?.orderRef)
      this.props.route.params?.orderRef()
  }



  render() {
    const { data } = this.state
    const { product, customer, delivery_address, vendor } = data
    const { user } = this.props
    return (
      <View style={styles.root}>
        <Header
          title='Order Details'
          left={
            <IconButton
              icon={backIcon}
              containerStyle={{ marginHorizontal: 5 }}
              onPress={() => this.props.navigation.goBack()}
            />
          }
        />
        <View style={styles.container}>
          <KeyboardAwareScrollView>
            <View style={{ padding: 20 }}>
              {/* <View style={styles.row}>
                <View
                  style={{
                    overflow: 'hidden',
                    borderRadius: 12,
                    width: width * 0.20,
                    height: width * 0.20,
                    marginRight: 20
                  }}
                >
                  <Image
                    source={{ uri: product?.image }}
                    style={{ height: '100%', width: '100%', borderRadius: 12 }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={2} style={styles.normalText}>{product?.name}</Text>
                  <Text numberOfLines={3} style={styles.normalText}>Weight: {product?.measurement_unit}L</Text>
                </View>
              </View>
              <View margin={12} /> */}
              <View style={styles.row}>
                <View style={styles.hightlight}>
                  <Text style={[styles.hightlightText, { fontSize: 18, fontFamily: env.fontPoppinsMedium }]}>{data.unique_id}</Text>
                  <Text style={[styles.hightlightText, { marginTop: -5 }]}>Order</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.normalText}>Booking : {data.order_type === 1 ? 'Instant' : 'Schedule'} order</Text>
                  <Text style={styles.normalText}>Total Price : Rs. {data?.total_amount} <Text style={{ color: data?.payment_method !== 1 ? colors.primary : colors.red }}>({data?.payment_method === 1 ? 'COD' : 'Paid'})</Text> </Text>
                </View>
              </View>
              <View margin={12} />
              <View style={{ flexDirection: 'row' }}>
                <Image source={clockIcon} style={styles.itemIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.otherText}>Delivery Date  expected by</Text>
                  <Text style={styles.otherText}>{momen(new Date(data.delivery_date)).format('Do MMM,YYYY')}</Text>
                </View>
              </View>
              <View margin={10} />
              {
                user?.user_type !== 4 && (
                  <View style={{ flexDirection: 'row' }}>
                    <Image source={localIcon} style={styles.itemIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.otherText, { fontSize: 16, color: '#353535' }]}>Delivery to Address:</Text>
                      <Text style={{ fontFamily: env.fontPoppinsRegular, color: '#747474', fontSize: 14, flex: 1 }}>{delivery_address.floor_info}, {delivery_address.address}</Text>
                    </View>
                  </View>
                )
              }

            </View>
            {
              user?.user_type === 5 ? (
                <>
                  <View style={styles.divider} />
                  <View margin={20}>
                    <Text style={[styles.otherText, { fontSize: 18, color: colors.black }]}>Contact Detail</Text>
                    <View margin={10} />
                    <View style={{ flexDirection: 'row' }}>
                      <Image source={usernameIcon} style={styles.itemIcon} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.otherText, { fontSize: 16, color: '#353535' }]}>Customer name</Text>
                        <Text style={[styles.otherText, { fontSize: 14, color: '#616161' }]}>{delivery_address.name}</Text>
                      </View>
                    </View>
                    <View margin={10} />
                    <View style={{ flexDirection: 'row' }}>
                      <Image source={phoneIcon} style={styles.itemIcon} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.otherText, { fontSize: 16, color: '#353535' }]}>Mobile Number:</Text>
                        <Text style={[styles.otherText, { fontSize: 14, color: '#616161' }]}>{delivery_address?.mobile}</Text>
                      </View>
                    </View>
                    <View margin={10} />
                    <View style={{ flexDirection: 'row' }}>
                      <Image source={writingIcon} style={styles.itemIcon} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.otherText, { fontSize: 16, color: '#353535' }]}>Delivery note:</Text>
                        <Text style={{ fontFamily: env.fontPoppinsRegular, color: '#747474', fontSize: 14, flex: 1 }}>{data.delivery_note}</Text>
                      </View>
                    </View>




                  </View>
                </>
              ) : null
            }

            {
              user?.user_type === 3 ? (
                <>
                  <View style={styles.divider} />
                  <View margin={20}>
                    <Text style={[styles.otherText, { fontSize: 18, color: colors.black }]}>Customer Detail</Text>
                    <View margin={10} />
                    <View style={{ flexDirection: 'row' }}>
                      <Image source={usernameIcon} style={styles.itemIcon} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.otherText, { fontSize: 16, color: '#353535' }]}>Customer name</Text>
                        <Text style={[styles.otherText, { fontSize: 14, color: '#616161' }]}>{customer?.first_name} {customer?.last_name}</Text>
                      </View>
                    </View>
                    <View margin={10} />
                    <View style={{ flexDirection: 'row' }}>
                      <Image source={phoneIcon} style={styles.itemIcon} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.otherText, { fontSize: 16, color: '#353535' }]}>Mobile Number:</Text>
                        <Text style={[styles.otherText, { fontSize: 14, color: '#616161' }]}>{customer?.mobile}</Text>
                      </View>
                    </View>
                  </View>
                </>
              ) : null
            }

            {
              user?.user_type === 4 ? (
                <>
                  <View style={styles.divider} />
                  <View margin={20}>
                    <Text style={[styles.otherText, { fontSize: 18, color: colors.black }]}>Vendor Detail</Text>
                    <View margin={10} />
                    <View style={{ flexDirection: 'row' }}>
                      <Image source={usernameIcon} style={styles.itemIcon} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.otherText, { fontSize: 16, color: '#353535' }]}>Vendor name</Text>
                        <Text style={[styles.otherText, { fontSize: 14, color: '#616161' }]}>{vendor?.first_name} {vendor?.last_name}</Text>
                      </View>
                    </View>
                    <View margin={10} />
                    <View style={{ flexDirection: 'row' }}>
                      <Image source={phoneIcon} style={styles.itemIcon} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.otherText, { fontSize: 16, color: '#353535' }]}>Mobile Number:</Text>
                        <Text style={[styles.otherText, { fontSize: 14, color: '#616161' }]}>{vendor?.mobile}</Text>
                      </View>
                    </View>
                  </View>
                </>
              ) : null
            }

            <View style={styles.divider} />
            <View>
              {data?.order_products?.map(this.renderItem)}
            </View>
            <View style={{height: 30}}/>
          </KeyboardAwareScrollView>

          {
            user?.user_type === 5 && (
              <View style={{  flexDirection: 'row', justifyContent: 'space-between' }}>
                <SimpleButton
                  title='Customer'
                  customWidth={width / 2}
                  customHeight={45}
                  titleStyle={{ color: colors.white }}
                  containStyle={{ backgroundColor: colors.blueLight, borderRadius: 0 }}
                  icon={<Image source={phoneIcon} style={styles.buttonIcon} />}
                  onPress={() => this._openLink(`tel:${delivery_address?.mobile}`)}
                />
                <View style={{ height: 15 }} />
                <SimpleButton
                  title='Direction'
                  customWidth={width / 2}
                  customHeight={45}
                  containStyle={{ borderRadius: 0 }}
                  icon={<Image source={directionIcon} style={styles.buttonIcon} />}
                  onPress={() => this.openLocation(delivery_address?.latitude, delivery_address?.longitude)}
                />
              </View>
            )
          }

          {
            user?.user_type === 4 && (
              <Button
                title='Close Order'
                containerStyle={{ borderRadius: 0 }}
                onPress={this._sendOTP}
              />
            )
          }

          <SaleClosure
            isVisible={this.state.saleClosur}
            title="Enter OTP sent to Vendor's Registered Number"
            onClose={() => this.setState({ saleClosur: false })}
            callBack={this._deliveryOrder}
          />
          <WarnDialog
            isVisible={this.state.alert}
            rightText='Yes'
            leftText='No'
            message='Did you collect the cash?'
            leftAction={() => this.setState({ alert: false })}
            rightAction={() => this._deliveredOrderCOD()}
          />


        </View>

      </View>
    )
  }

  renderItem = (item, index) => {
    const product = item.product
    return (
      <View
        style={{ borderBottomWidth: 0.5, padding: 15, borderBottomColor: 'rgba(130, 130, 130, 0.3)', flexDirection: 'row', alignItems: 'center' }}
        key={String(index)}
      >

        <Shadow
          style={{
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.2,
            shadowColor: colors.gray,
            shadowRadius: 10,
            backgroundColor: colors.white,
            width: 80,
            height: 80,
            borderRadius: 20,
            marginRight: 20
          }}
        >
          <View
            style={{ flex: 1, overflow: 'hidden', borderRadius: 20 }}
          >
            <Image
              source={{ uri: product?.image }}
              style={{ height: '100%', width: '100%' }}
            />
          </View>
        </Shadow>
        <View style={{ justifyContent: 'space-between', flex: 1 }}>
          <Text style={styles.prodText}>{product?.name}</Text>
          <Text style={styles.prodText}>Weigth: {product?.measurement_unit}{item?.number_of_can ? `  |  Empty Can : ${item?.number_of_can}` : ''}</Text>
          <Text style={styles.prodText}>QTY: {item.qty}  |  Price Rs: {product?.distributor_price}</Text>
        </View>
      </View>
    )
  }

}

function mapStateToProps({ user }) {
  return {
    user: user.currentUser,
  }
}

export default connect(mapStateToProps)(OrderDetails)

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
  normalText: {
    fontSize: 17,
    fontFamily: env.fontPoppinsRegular,
    color: '#353535'
  },
  hightlight: {
    backgroundColor: colors.blueLight,
    padding: 10,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
    minHeight: 70,
    marginRight: 15
  },
  hightlightText: {
    fontSize: 15,
    fontFamily: env.fontPoppinsRegular,
    color: colors.white
  },
  otherText: {
    fontFamily: env.fontPoppinsRegular,
    fontSize: 15,
    color: '#353535',
    flex: 1
  },
  itemIcon: {
    resizeMode: 'contain',
    width: 18,
    height: 18,
    marginRight: 15,
    tintColor: colors.blueLight,
    marginTop: 2.5
  },
  divider: {
    height: 10,
    backgroundColor: '#F6F6F6'
  },
  buttonIcon: {
    resizeMode: 'contain',
    width: 18,
    height: 18,
    marginRight: 15
  }

})
