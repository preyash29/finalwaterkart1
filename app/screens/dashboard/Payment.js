import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import {backIcon} from '../../assets';
import {IconButton, Button, RadioButton} from '../../components/Button';
import Header from '../../components/Header';
import colors from '../../constants/colors';
import env from '../../constants/env';
import Checkbox from '../../components/Checkbox';
import AlertDialog from '../../components/Dialog/AlertDialog';
import {
  checkOffercode,
  orderPayment,
  razorpayOrderVerified,
  rootLoader,
  getWalletTransactions,
  checkSubOffercode,
  subscription_payment,
} from '../../actions';
import RazorpayCheckout from 'react-native-razorpay';
import Snackbar from 'react-native-snackbar';
import AddressSection from '../../components/AddressSection';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const {width} = Dimensions.get('screen');
class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preData: props.route.params?.data,
      type: props.route.params?.type || 'order',
      offerCode: '',
      useWallet: false,
      wallet: props.walletBalance || 0,
      paymentMethod: '',
    };
  }

  componentDidMount() {
    this.props.getWalletTransactions();
  }

  _checkOffer = async () => {
    const {offerCode, preData} = this.state;
    if (!offerCode) return;
    let res;
    if (this.state.type === 'sub') {
      res = await checkSubOffercode({
        subscription_id: preData.id,
        offer_code: offerCode,
      });
    } else {
      res = await checkOffercode({
        order_id: preData.id,
        offer_code: offerCode,
      });
    }

    if (!res.status) {
      this.showAlert(res.message);
    } else {
      this.setState({preData: res.data});
    }
  };

  showAlert = (message) => {
    this.setState({alert: true, alertMessage: message});
  };

  _submitOrder = async () => {
    const {user} = this.props;
    const {offerCode, preData, useWallet, paymentMethod, type} = this.state;
    if (useWallet && paymentMethod === 'COD')
      return this.showAlert('Please select payment method');
    else if (!paymentMethod)
      return this.showAlert('Please select payment method');

    this.props.rootLoader(true);
    let res;
    if (type === 'sub') {
      res = await subscription_payment({
        subscription_id: preData.id,
        // offer_code: offerCode,
        is_debit_wallet: useWallet ? 1 : 0,
        payment_method:
          paymentMethod === 'COD'
            ? '1'
            : paymentMethod === 'banking'
            ? '2'
            : '3',
      });
    } else {
      res = await orderPayment({
        order_id: preData.id,
        offer_code: offerCode,
        is_debit_wallet: useWallet ? 1 : 0,
        payment_method:
          paymentMethod === 'COD'
            ? '1'
            : paymentMethod === 'banking'
            ? '2'
            : '3',
      });
    }

    this.props.rootLoader(false);
    if (res.status) {
      if (paymentMethod === 'COD') {
        this.props.navigation.navigate('orderHistory');
        Snackbar.show({
          text: 'Order Successfull.',
          duration: Snackbar.LENGTH_SHORT,
        });
        return;
      }
      const options = {
        description: 'CUSTOMER ORDER',
        image: user?.profile_pic || '',
        currency: 'INR',
        key: env.razorpayApikey,
        amount: String(preData?.total_amount * 100),
        name: user?.first_name + ' ' + user?.last_name,
        order_id: res?.data?.razorpay_order_id,
        prefill: {
          email: user?.email || '',
          contact: user?.mobile,
          name: user?.first_name + ' ' + user?.last_name,
        },
        theme: {color: colors.blueLight},
      };
      RazorpayCheckout.open(options)
        .then(async (data) => {
          this.props.rootLoader(true);
          let paymentStatus = await razorpayOrderVerified({
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_order_id: data.razorpay_order_id,
          });
          this.props.getWalletTransactions();
          this.props.rootLoader(false);
          if (paymentStatus.status) {
            if (type === 'sub') {
              this.props.navigation.navigate('mySubcription');
            } else {
              this.props.navigation.navigate('orderHistory');
            }
            Snackbar.show({
              text: paymentStatus.message || 'Order Successfull.',
              duration: Snackbar.LENGTH_SHORT,
            });
          } else {
            this.showAlert(paymentStatus.message);
          }
        })
        .catch((error) => {
          console.log(error);
          this.showAlert(error?.error?.description || '');
          // Alert.alert('ERROR CODE: ' + error.code, error.description);
        });
    } else {
      this.showAlert(res.message);
    }
  };

  _selectedAddress = (data) => {
    this.setState({address: data});
  };

  _scheduleService = () => {
    const {address} = this.state;
    if (!address) return this.showAlert('Please select address');
    this.setState({datePicker: true});
  };

  render() {
    const {useWallet, preData, paymentMethod, type} = this.state;
    let finalToal =
      type === 'sub' ? preData?.total_amount : preData?.order_amount;
    let currentWalletBalance = this.props.walletBalance;

    if (preData?.discount_amount) {
      finalToal -= preData?.discount_amount;
    }

    let walletCut = 0;
    if (useWallet) {
      if (finalToal > currentWalletBalance) {
        walletCut = currentWalletBalance;
        finalToal = finalToal - walletCut;
        currentWalletBalance = 0;
      } else if (finalToal <= currentWalletBalance) {
        walletCut = finalToal;
        currentWalletBalance = currentWalletBalance - finalToal;
        finalToal = finalToal - walletCut;
      }
    }

    return (
      <View style={styles.root}>
        <Header
          title="Payment"
          left={
            <IconButton
              icon={backIcon}
              containerStyle={{marginHorizontal: 5}}
              onPress={() => this.props.navigation.goBack()}
            />
          }
        />
        <View style={styles.container}>
          <ScrollView contentContainerStyle={{flexGrow: 1, padding: 20}}>
            <View style={{marginVertical: 15}}>
              {type === 'sub' && (
                <View>
                  <Text
                    style={{
                      fontFamily: env.fontMedium,
                      color: '#000',
                      fontSize: 14,
                    }}>
                    subcription's Date:{' '}
                    {moment(preData?.start_date).format('Do MMM, YYYY')} -{' '}
                    {moment(preData?.end_date).format('Do MMM, YYYY')}
                  </Text>
                  <Text
                    style={{
                      fontFamily: env.fontMedium,
                      color: '#000',
                      fontSize: 14,
                      marginTop: 8,
                    }}>
                    Total orders: {preData?.total_orders || 0}
                  </Text>
                  <View style={{height: 30}} />
                </View>
              )}

              <Text style={styles.inputTitle}>Have an offer code?</Text>
              <View style={{flexDirection: 'row', width: '100%'}}>
                <TextInput
                  style={styles.textInput}
                  placeholder="type here"
                  placeholderTextColor="#999999"
                  value={this.state.offerCode}
                  onChangeText={(text) => this.setState({offerCode: text})}
                />
                <TouchableOpacity style={styles.btn} onPress={this._checkOffer}>
                  <Text style={styles.btnText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Checkbox
                  isChecked={useWallet}
                  onPress={() => this.setState({useWallet: !useWallet})}
                />
                <Text style={[styles.termText, {marginLeft: 15}]}>
                  Use wallet balance
                </Text>
              </View>
              <Text style={styles.termText}>{currentWalletBalance}</Text>
            </View>

            {/* {subscription && (
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={[styles.termText]}>
                  {moment(subscription?.start_date).format('DD MMM YYYY')} To{' '}
                  {moment(subscription?.end_date).format('DD MMM YYYY')}
                </Text>
                <Text style={styles.termText}>{subscription?.quantity}</Text>
              </View>
            )} */}

            <View margin={15} />

            {type === 'sub' && (
              <View style={[styles.row, {justifyContent: 'space-between'}]}>
                <View style={{flex: 1}}>
                  <Text style={styles.termText} numberOfLines={1}>
                    {preData?.product?.name}{' '}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.termText}>X {preData.quantity} </Text>
                  <Text
                    style={[styles.termText, {width: 100, textAlign: 'right'}]}>
                    ₹{preData?.subtotal_amount}
                  </Text>
                </View>
              </View>
            )}

            {preData?.order_products?.map((item, index) => {
              return (
                <View
                  style={[styles.row, {justifyContent: 'space-between'}]}
                  key={String(index)}>
                  <View style={{flex: 1}}>
                    <Text style={styles.termText} numberOfLines={1}>
                      {item?.product?.name}{' '}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.termText}>X {item.qty} </Text>
                    <Text
                      style={[
                        styles.termText,
                        {width: 100, textAlign: 'right'},
                      ]}>
                      ₹{item.total_amount}
                    </Text>
                  </View>
                </View>
              );
            })}
            {preData?.discount_amount ? (
              <View style={[styles.row, {justifyContent: 'space-between'}]}>
                <Text style={styles.termText}>Discount: </Text>
                <Text style={styles.termText}>
                  - ₹{preData?.discount_amount}
                </Text>
              </View>
            ) : null}

            {preData?.empty_can_charges ? (
              <View style={[styles.row, {justifyContent: 'space-between'}]}>
                <Text style={styles.termText}>Empty can charge: </Text>
                <Text style={styles.termText}>
                  + ₹{preData?.empty_can_charges}
                </Text>
              </View>
            ) : null}
            {preData?.lift_charge ? (
              <View style={[styles.row, {justifyContent: 'space-between'}]}>
                <Text style={styles.termText}>Lift charge: </Text>
                <Text style={styles.termText}>+ ₹{preData?.lift_charge}</Text>
              </View>
            ) : null}

            {walletCut ? (
              <View style={[styles.row, {justifyContent: 'space-between'}]}>
                <Text style={styles.termText}>Wallet: </Text>
                <Text style={styles.termText}>- ₹{walletCut}</Text>
              </View>
            ) : null}

            <View style={styles.devider} />
            <View style={[styles.row, {justifyContent: 'space-between'}]}>
              <Text
                style={[styles.termText, {fontSize: 16, color: colors.black}]}>
                Order Total:{' '}
              </Text>
              <Text
                style={[styles.termText, {fontSize: 16, color: colors.black}]}>
                ₹{finalToal}
              </Text>
            </View>

            <View style={{height: 30}} />
            {!useWallet && type !== 'sub' ? (
              <RadioButton
                isFill={paymentMethod === 'COD'}
                onPress={() => this.setState({paymentMethod: 'COD'})}
                title="Cash on Delivery"
              />
            ) : null}
            <View style={{height: 10}} />
            <RadioButton
              isFill={paymentMethod === 'upi'}
              // onPress={() => this.setState({ paymentMethod: 'upi' })}
              title="UPI Payment"
            />
            <View style={{height: 10}} />
            <RadioButton
              isFill={paymentMethod === 'banking'}
              onPress={() => this.setState({paymentMethod: 'banking'})}
              title="Netbanking, debit or credit card"
            />

            <View style={{height: 20}} />
          </ScrollView>
          <Button
            title="Submit"
            containerStyle={{paddingHorizontal: 40, borderRadius: 0}}
            onPress={this._submitOrder}
          />
        </View>

        <AlertDialog
          isVisible={this.state.alert}
          message={this.state.alertMessage}
          onAction={() => this.setState({alert: false})}
        />
      </View>
    );
  }
}

function mapStateToProps({user, cart}) {
  return {
    walletBalance: user.walletBalance,
    user: user.currentUser,
    cardItems: cart.cardItems,
  };
}

export default connect(mapStateToProps, {
  rootLoader,
  getWalletTransactions,
})(Payment);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden',
  },
  btn: {
    backgroundColor: colors.blueLight,
    paddingHorizontal: 25,
    height: 38,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontFamily: env.fontMedium,
    color: colors.white,
    fontSize: 15,
  },
  textInput: {
    fontFamily: env.fontRegular,
    flex: 1,
    height: 45,
    borderBottomWidth: 1,
    borderBottomColor: '#999999',
    marginRight: 30,
  },
  inputTitle: {
    fontFamily: env.fontPoppinsMedium,
    color: colors.black,
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  normalText: {
    fontSize: 17,
    fontFamily: env.fontPoppinsRegular,
    color: '#353535',
  },
  termText: {
    color: colors.lightBlack,
    fontFamily: env.fontPoppinsMedium,
    fontSize: 14,
    marginTop: 3,
  },
  devider: {
    backgroundColor: colors.gray,
    height: 1,
    marginVertical: 10,
  },
  warnText: {
    fontSize: 14,
    fontFamily: env.fontPoppinsMedium,
    color: '#ff0000',
  },
});
