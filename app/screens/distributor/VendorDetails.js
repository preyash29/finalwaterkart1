import moment from 'moment'
import React from 'react'
import { Image, ScrollView, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { get_vendor_orders_by_vendor, send_vendor_order_verify_otp_to_vendor, verify_otp_vendor_order } from '../../actions'
import { accountsIcon, backIcon, callIcon, usernameIcon } from '../../assets'
import { IconButton } from '../../components/Button'
import SaleClosure from '../../components/Dialog/SaleClosure'
import Header from '../../components/Header'
import colors from '../../constants/colors'
import env from '../../constants/env'


class VendorDetails extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: props.route.params?.data,
      orders: null,
      saleClosur: false,
      tempData: null
    }
  }

  async componentDidMount() {
    this.initData()
  }

  initData = async () => {
    let res = await get_vendor_orders_by_vendor(this.state.data.vendor_id)
    if (res.status) {
      let data = []

      Object.keys(res.data).map((key) => {
        data.push({
          title: key,
          data: res.data[key]
        })
      })
      this.setState({ orders: data })
    }
  }

  _sendOTP = (data) => {
    send_vendor_order_verify_otp_to_vendor({ order_id: data.id })
    this.setState({ saleClosur: true, tempData: data })
  }

  _deliveryOrder = async (otp) => {
    let res = await verify_otp_vendor_order({ otp, order_id: this.state.tempData.id })
    if (res.status) this.initData()
    return res
  }

  render() {
    const { data, orders } = this.state
    let name = data?.vendor?.first_name + ' ' + data?.vendor?.last_name
    return (
      <View style={styles.root}>
        <Header
          title={name}
          left={
            <IconButton
              icon={backIcon}
              containerStyle={{ marginHorizontal: 5 }}
              onPress={() => this.props.navigation.goBack()}
            />
          }
        />
        <View style={styles.container}>
          <ScrollView>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 / 2 }}>
                <Text style={styles.title}>Name</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                  <Image source={usernameIcon} style={styles.iconStyle} />
                  <Text style={styles.value}>{name}</Text>
                </View>
              </View>
              <View style={{ flex: 1 / 2 }}>
                <Text style={styles.title}>Vendor Code</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                  <Image source={accountsIcon} style={styles.iconStyle} />
                  <Text style={styles.value}>{data?.vendor?.referral_id}</Text>
                </View>
              </View>
            </View>
            <View margin={5} />
            <Text style={styles.title}>Number</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
              <Image source={callIcon} style={styles.iconStyle} />
              <Text style={styles.value}>+91 {data?.vendor?.mobile}</Text>
            </View>

            {data?.request_type !== 0 || data?.status !== 0 && (
              <>
                <View margin={20} />
                <Text style={[styles.title, { color: '#000', marginBottom: 10 }]}>Padding Orders</Text>

                <SectionList
                  sections={orders}
                  keyExtractor={(it, index) => String(index)}
                  renderItem={this.renderItem}
                  renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeader}>{title}</Text>
                  )}
                  contentContainerStyle={{ flexGrow: 1 }}
                />
              </>
            )}

          </ScrollView>
        </View>
        <SaleClosure
          isVisible={this.state.saleClosur}
          title="Enter OTP sent to Vendor's Registered Number"
          onClose={() => this.setState({ saleClosur: false, tempData: null })}
          callBack={this._deliveryOrder}
        />

      </View>
    )
  }

  renderItem = ({ item }) => {


    let status = ''
    if (item.order_status === 0) status = 'pending'
    else if (item.order_status === 1) status = 'accepted'
    else if (item.order_status === 3) status = 'Assigned'
    else if (item.order_status === 4) status = 'completed'
    else if (item.order_status === 5) status = 'canceled'

    return (
      <TouchableOpacity
        style={{ borderBottomWidth: 0.5, paddingVertical: 20, borderBottomColor: 'rgba(130, 130, 130, 0.3)' }}
        activeOpacity={1}
        onPress={() => this.props.navigation.navigate('orderDetails', { data: item, orderRef: this.initData })}
      >
        <Text numberOfLines={1} style={styles.itemTitle}>Order ID: {item?.unique_id}   |   Rs {item?.total_amount} ({item.payment_method === 1 ? 'COD' : 'Prepaid'})</Text>
        <View style={{ justifyContent: 'space-between', flex: 1, marginTop: 5 }}>
          <Text style={{ fontFamily: env.fontMedium, color: '#474747', fontSize: 13 }}>Delivery on : {moment(new Date(item.delivery_date)).format('Do MMMM, YYYY')}</Text>
          <Text numberOfLines={1} style={[styles.itemTitle, { fontSize: 13 }]}>Booking : {item.order_type === 1 ? 'Instant' : 'Schedule'} order</Text>
        </View>
      </TouchableOpacity>
    )

    // const product = item.product
    // return (
    //   <View
    //     style={{ borderBottomWidth: 0.5, padding: 15, borderBottomColor: 'rgba(130, 130, 130, 0.3)', flexDirection: 'row', alignItems: 'center' }}
    //     key={String(index)}
    //   >

    //     <Shadow
    //       style={{
    //         shadowOffset: { width: 0, height: 0 },
    //         shadowOpacity: 0.2,
    //         shadowColor: colors.gray,
    //         shadowRadius: 10,
    //         backgroundColor: colors.white,
    //         width: 80,
    //         height: 80,
    //         borderRadius: 20,
    //         marginRight: 20
    //       }}
    //     >
    //       <View
    //         style={{ flex: 1, overflow: 'hidden', borderRadius: 20 }}
    //       >
    //         <Image
    //           source={{ uri: product?.image }}
    //           style={{ height: '100%', width: '100%' }}
    //         />
    //       </View>
    //     </Shadow>
    //     <View style={{ justifyContent: 'space-between', flex: 1 }}>
    //       <Text style={styles.prodText}>{product?.name + '  |  Weigth:' + product?.measurement_unit}</Text>
    //       <Text style={styles.prodText}>Price Rs: {product?.distributor_price}</Text>
    // <TouchableOpacity
    //   style={{ backgroundColor: colors.blueLight, borderRadius: 20, padding: 5, alignSelf: 'baseline', paddingHorizontal: 20 }}
    //   onPress={() => this._sendOTP(item)}
    // >
    //   <Text style={[styles.prodText, { color: colors.white, fontSize: 13 }]}>Close order</Text>
    // </TouchableOpacity>

    //     </View>
    //   </View>
    // )
  }
}

export default connect()(VendorDetails)

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
    overflow: 'hidden',
    padding: 20,
    paddingTop: 30
  },

  iconStyle: {
    resizeMode: 'contain',
    height: 14,
    width: 14
  },

  title: {
    fontFamily: env.fontMedium,
    fontSize: 15,
    color: colors.lightBlack
  },
  value: {
    fontFamily: env.fontMedium,
    fontSize: 14,
    color: colors.lightBlack,
    marginLeft: 15
  },
  prodText: {
    fontFamily: env.fontPoppinsMedium,
    fontSize: 14,
    color: colors.lightBlack,
  },
  sectionHeader: {
    fontFamily: env.fontSemiBold,
    fontSize: 16,
    color: colors.black,
    marginTop: 20
  },

})
