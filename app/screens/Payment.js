import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Dimensions, Image } from 'react-native'
import { connect } from 'react-redux'
import { backIcon } from '../assets'
import { IconButton, Button } from '../components/Button'
import Header from '../components/Header'
import colors from '../constants/colors'
import env from '../constants/env'
// import Checkbox from '../components/Checkbox'
import AlertDialog from '../components/Dialog/AlertDialog'
import { checkOffercode, rootLoader, submitVendorOrder, vendorOrderPayment, getWalletTransactions } from '../actions'
// import RazorpayCheckout from 'react-native-razorpay'
import Snackbar from 'react-native-snackbar'

const { width } = Dimensions.get('screen')
class Payment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      preData: props.route.params?.data,
      offerCode: '',
      useWallet: false,
      discountAmount: ''
    }
  }

  componentDidMount(){
    this.props.getWalletTransactions()
  }

  _checkOffer = async () => {
    const { offerCode, preData } = this.state
    if (!offerCode) return
    let res = await checkOffercode({ order_id: preData.id, offer_code: offerCode })
    if (!res.status) {
      this.showAlert(res.message)
    } else {
      this.setState({ discountAmount: res.data.discount_amount })
    }
  }

  showAlert = (message) => {
    this.setState({ alert: true, alertMessage: message })
  }

  _submitOrder = async () => {
    Snackbar.show({
      text: 'Order Successfull.',
      duration: Snackbar.LENGTH_LONG
    });

    this.props.navigation.navigate('myProducts')
    // const { preData, useWallet } = this.state
    // const { user } = this.props
    // this.props.rootLoader(true)
    // let resSubmit = await submitVendorOrder({
    //   product_id: preData.product.id,
    //   quantity: this.props.route.params?.qty,
    //   is_debit_wallet: useWallet ? 1 : 0
    // })
    // if (!resSubmit.status) {
    //   this.props.rootLoader(false)
    //   this.showAlert(resSubmit.message)
    // } else {
    //   let res = await vendorOrderPayment({
    //     order_id: resSubmit.data.id,
    //     offer_code: '',
    //     is_debit_wallet: useWallet ? 1 : 0
    //   })
    //   this.props.rootLoader(false)
    //   if (res.status) {
    //     const options = {
    //       description: 'VENDOR ORDER',
    //       image: user?.profile_pic || '',
    //       currency: 'INR',
    //       key: env.razorpayApikey,
    //       amount: String(resSubmit.data?.total_amount * 100),
    //       name: user?.first_name + ' ' + user?.last_name,
    //       order_id: res?.data?.razorpay_order_id,
    //       prefill: {
    //         email: user?.email || '',
    //         contact: user?.mobile,
    //         name: user?.first_name + ' ' + user?.last_name
    //       },
    //       theme: { color: colors.blueLight }
    //     }
    //     RazorpayCheckout.open(options).then(async (data) => {
    //       this.props.rootLoader(true)
    //       let paymentStatus = await razorpayOrderVerified({
    //         razorpay_payment_id: data.razorpay_payment_id,
    //         razorpay_order_id: data.razorpay_order_id
    //       })
    //       this.props.getWalletTransactions()
    //       this.props.rootLoader(false)
    //       if (paymentStatus.status) {
    //         this.props.navigation.navigate('myProducts')
    //         Snackbar.show({
    //           text: paymentStatus.message || 'Order Successfull.', duration: Snackbar.LENGTH_LONG,
    //         })
    //       } else {
    //         this.showAlert(paymentStatus.message)
    //       }
    //     }).catch((error) => {
    //       Alert.alert('ERROR CODE: ' + error.code, error.description)
    //     })
    //   } else {
    //     this.showAlert(res.message)
    //   }
    // }
  }

  render() {
    const { useWallet, preData, discountAmount } = this.state
    const { product } = preData
    const qty = Number(this.props.route.params?.qty)
    let currentWalletBalance = this.props.walletBalance
    let user = this.props.user

    let total = product?.sell_price * qty
    if (discountAmount) {
      total = total - discountAmount
    }
    let walletCut = 0
    if (useWallet) {
      if (total > currentWalletBalance) {
        walletCut = currentWalletBalance
        total = total - walletCut
        currentWalletBalance = 0
      }
      else if (total <= currentWalletBalance) {
        walletCut = total
        currentWalletBalance = currentWalletBalance - total
        total = total - walletCut
      }
    }



    return (
      <View style={styles.root}>
        <Header
          title='Payment'
          left={
            <IconButton
              icon={backIcon}
              containerStyle={{ marginHorizontal: 5 }}
              onPress={() => this.props.navigation.goBack()}
            />
          }
        />
        <View style={styles.container}>

          <View style={styles.row}>
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
              <Text numberOfLines={3} style={styles.normalText}>Weight: {product?.measurement_unit}</Text>
            </View>
          </View>
          {
            user?.user_type === 2 ? (
              <View style={{ marginVertical: 15 }}>

                <Text style={styles.inputTitle}>Have an offer code?</Text>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                  <TextInput
                    style={styles.textInput}
                    placeholder='type here'
                    placeholderTextColor='#999999'
                    value={this.state.offerCode}
                    onChangeText={(text) => this.setState({ offerCode: text })}
                  />
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={this._checkOffer}
                  >
                    <Text style={styles.btnText}>Apply</Text>
                  </TouchableOpacity>
                </View>

              </View>
            ) : (<View margin={30} />)
          }
         
          {/* <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox
                isChecked={useWallet}
                onPress={() => this.setState({ useWallet: !useWallet })}
              />
              <Text style={[styles.termText, { marginLeft: 15 }]}>Use wallet balance</Text>
            </View>
            <Text style={styles.termText}>{currentWalletBalance}</Text>
          </View> */}
          <View margin={15} />
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <Text style={styles.termText}>{product?.name}: </Text>
            <Text style={styles.termText}>{qty} X   ₹{product?.sell_price}</Text>
          </View>
          {
            discountAmount ? (
              <View style={[styles.row, { justifyContent: 'space-between' }]}>
                <Text style={styles.termText}>Discount: </Text>
                <Text style={styles.termText}>- ₹{discountAmount}</Text>
              </View>
            ) : null
          }

          {
            walletCut ? (
              <View style={[styles.row, { justifyContent: 'space-between' }]}>
                <Text style={styles.termText}>Wallet: </Text>
                <Text style={styles.termText}>- ₹{walletCut}</Text>
              </View>
            ) : null
          }

          <View style={styles.devider} />
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <Text style={[styles.termText, { fontSize: 16, color: colors.black }]}>Order Total: </Text>
            <Text style={[styles.termText, { fontSize: 16, color: colors.black }]}>₹{total}</Text>
          </View>

          <View style={{ marginVertical: 40, alignSelf: 'center' }}>
            <Button
              title='Submit'
              containerStyle={{ paddingHorizontal: 40 }}
              onPress={this._submitOrder}
            />
          </View>

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

function mapStateToProps({ user }) {
  return {
    walletBalance: user.walletBalance,
    user: user.currentUser
  }
}

export default connect(mapStateToProps, {
  rootLoader,
  getWalletTransactions
})(Payment)

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
    padding: 20
  },
  btn: {
    backgroundColor: colors.blueLight,
    paddingHorizontal: 25,
    height: 38,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnText: {
    fontFamily: env.fontMedium,
    color: colors.white,
    fontSize: 15
  },
  textInput: {
    fontFamily: env.fontRegular,
    flex: 1,
    height: 45,
    borderBottomWidth: 1,
    borderBottomColor: '#999999',
    marginRight: 30
  },
  inputTitle: {
    fontFamily: env.fontPoppinsMedium,
    color: colors.black,
    fontSize: 15
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
  termText: {
    color: colors.lightBlack,
    fontFamily: env.fontPoppinsMedium,
    fontSize: 14,
    marginTop: 3
  },
  devider: {
    backgroundColor: colors.gray,
    height: 1,
    marginVertical: 10
  }
})
