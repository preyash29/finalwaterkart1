import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Alert } from 'react-native'
import { connect } from 'react-redux'
import Header from '../../components/Header'
import colors from '../../constants/colors'
import env from '../../constants/env'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import AllTransactions from './WalletTabs/AllTransactions'
import Received from './WalletTabs/Received'
import Paid from './WalletTabs/Paid'
import { addWalletBalance, razorpayOrderVerified, rootLoader, getWalletTransactions } from '../../actions'
import RazorpayCheckout from 'react-native-razorpay'
import Snackbar from 'react-native-snackbar'
const Tab = createMaterialTopTabNavigator()

class Wallet extends React.Component {


  constructor() {
    super()

    this.state = {
      addAmount: ''
    }
  }

  _addBalance = async () => {
    const { user } = this.props
    const { addAmount } = this.state
    if (!addAmount) return
    this.props.rootLoader(true)
    let res = await addWalletBalance({ amount: addAmount })
    this.props.rootLoader(false)
    if (res.status) {
      // console.log(res?.data?.razorpay_order_id)
      // return
      const options = {
        description: 'ADD BALANCE',
        image: user?.profile_pic || '',
        currency: 'INR',
        key: env.razorpayApikey,
        amount: String(addAmount * 100),
        name: user?.first_name + ' ' + user?.last_name,
        order_id: res?.data?.razorpay_order_id,
        prefill: {
          email: user?.email || '',
          contact: user?.mobile,
          name: user?.first_name + ' ' + user?.last_name
        },
        theme: { color: colors.blueLight }
      }
      RazorpayCheckout.open(options).then(async (data) => {
        this.props.rootLoader(true)
        let paymentStatus = await razorpayOrderVerified({
          razorpay_payment_id: data.razorpay_payment_id,
          razorpay_order_id: data.razorpay_order_id
        })
        this.setState({ addAmount: '' })
        this.props.getWalletTransactions()
        this.props.rootLoader(false)
        if (paymentStatus.status) {
          // balance update
          Snackbar.show({
            text: paymentStatus.message || 'Successfull.', duration: Snackbar.LENGTH_SHORT,
          })
        } else {
          Snackbar.show({
            text: paymentStatus.message, duration: Snackbar.LENGTH_SHORT,
          })
        }
      }).catch((error) => {
        console.log(error)
        Alert.alert('ERROR CODE: ' + error.code, error.description)
      })
    }
    console.log(res.status)
  }

  render() {
    return (
      <View style={styles.root}>
        <Header
          title='Wallet'
        />
        <View style={styles.container}>
          <View margin={20}>
            <View style={{ height: 20 }} />



            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
              {
                this.props.user?.deposit_amount ? (
                  <View>
                    <Text style={styles.amountBalance}>Rs. {this.props.user?.deposit_amount || 0}</Text>
                    <Text style={[styles.amountBalance, { color: colors.black, fontFamily: env.fontRegular, marginTop: 5 }]}>Deposit</Text>
                  </View>
                ) : null
              }

              <View>
                <Text style={styles.amountBalance}>Rs. {this.props.walletBalance}</Text>
                <Text style={[styles.amountBalance, { color: colors.black, fontFamily: env.fontRegular, marginTop: 5 }]}>Balance</Text>
              </View>
            </View>



            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 35 }}>
              <TextInput
                placeholder='Enter Amount'
                placeholderTextColor={colors.black}
                keyboardType='number-pad'
                style={styles.inputAmount}
                value={this.state.addAmount}
                onChangeText={(text) => this.setState({ addAmount: text })}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={this._addBalance}
              >
                <Text style={{ color: colors.white, fontFamily: env.fontRegular }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Tab.Navigator
            tabBarOptions={{
              showIcon: false,
              activeTintColor: colors.blueLight,
              inactiveTintColor: '#707070',
              labelStyle: {
                fontFamily: env.fontOSBold,
                textTransform: 'capitalize'
              },
              indicatorStyle: {
                borderBottomColor: colors.blueLight,
                borderBottomWidth: 1
              },
              style: {
                borderBottomWidth: 0,
                elevation: 0
              }
            }}
          >
            <Tab.Screen name='All' component={AllTransactions} />
            <Tab.Screen name='Received' component={Received} />
            <Tab.Screen name='Paid' component={Paid} />
          </Tab.Navigator>


        </View>

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
})(Wallet)

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
  inputAmount: {
    fontFamily: env.fontRegular,
    fontSize: 15,
    color: colors.black,
    backgroundColor: 'rgba(238, 236, 236, 0.6)',
    flex: 1 / 2,
    height: 45,
    paddingHorizontal: 10
  },
  addButton: {
    backgroundColor: '#373737',
    padding: 10,
    borderRadius: 30,
    paddingHorizontal: 30
  },
  amountBalance: {
    fontFamily: env.fontMedium,
    fontSize: 18,
    color: colors.blueLight,
    textAlign: 'center'
  }
})
