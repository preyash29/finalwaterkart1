import moment from 'moment';
import React from 'react';
import {
  Dimensions,
  ScrollView, StyleSheet,
  Text,
  TextInput, TouchableOpacity, View
} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { connect } from 'react-redux';
import {
  getWalletTransactions, rootLoader,
  submitOrder
} from '../../actions';
import { backIcon } from '../../assets';
import AddressSection from '../../components/AddressSection';
import { Button, IconButton, SimpleButton } from '../../components/Button';
import AlertDialog from '../../components/Dialog/AlertDialog';
import Header from '../../components/Header';
import colors from '../../constants/colors';
import env from '../../constants/env';

const { width } = Dimensions.get('screen');
class CheckOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preData: props.route.params?.data,
      address: null,
      deliveryNote: '',
      datePicker: false,
      deliveryDate: new Date(),
      confirmSchedule: false,
      vendorCode: props.user?.from_referral_id || '',
      distibutorForVendorOrder: null
    };
  }

  componentDidMount() {
    this.props.getWalletTransactions();
  }


  showAlert = (message) => {
    this.setState({ alert: true, alertMessage: message });
  };

  _confirm = async () => {
    const { address, deliveryNote, deliveryDate, confirmSchedule, vendorCode, preData, distibutorForVendorOrder } = this.state
    if (!address && this.props?.user?.user_type === 2) return this.showAlert('Please select address')
    if (!distibutorForVendorOrder && this.props?.user?.user_type === 3) return this.showAlert('Please select distibutor')
    const requestParams = {
      delivery_note: deliveryNote,
      delivery_date: confirmSchedule ? moment(deliveryDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
      delivery_address_id: address?.id || '',
      order_type: confirmSchedule ? '2' : '1',
      referral_code: vendorCode?.trim(),
      repeat_order_id: preData?.id || '',
      distributor_id: distibutorForVendorOrder?.id
    }
    this.props.rootLoader(true)
    let res = await submitOrder(requestParams)
    this.props.rootLoader(false)
    if (res.status) {
      if(this.props?.user?.user_type === 3) return this.props.navigation.navigate('home')
      return this.props.navigation.navigate('customerPayment', { data: res.data })
    } else {
      this.showAlert(res.message)
    }
  }

  _selectedAddress = (data) => {
    this.setState({ address: data });
  };

  _scheduleService = () => {
    const { address, distibutorForVendorOrder } = this.state
    if (!address && this.props?.user?.user_type === 2) return this.showAlert('Please select address')
    if (!distibutorForVendorOrder && this.props?.user?.user_type === 3) return this.showAlert('Please select distibutor')
    this.setState({ datePicker: true })
  }

  selectedDis = (data) => {
    this.setState({distibutorForVendorOrder: data})
  }

  render() {
    const {
      address,
      confirmSchedule,
      distibutorForVendorOrder
    } = this.state;

    const {user} = this.props
    return (
      <View style={styles.root}>
        <Header
          title="Checkout"
          left={
            <IconButton
              icon={backIcon}
              containerStyle={{ marginHorizontal: 5 }}
              onPress={() => this.props.navigation.goBack()}
            />
          }
        />
        <View style={styles.container}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, }}>
            {
              user?.user_type === 2 && (
                <>
                  <View style={{ marginVertical: 15 }}>
                    <Text style={styles.inputTitle}>Vendor code</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder='type here'
                      placeholderTextColor='#999999'
                      value={this.state.vendorCode}
                      onChangeText={(text) => this.setState({ vendorCode: text })}
                    />
                  </View>

                  <View style={{ height: 20 }} />

                  <View style={[styles.row, { justifyContent: 'space-between' }]}>
                    <Text style={[styles.inputTitle, { marginBottom: 10 }]}>Select delivery location</Text>
                    <TouchableOpacity
                      style={{ padding: 10, marginTop: -10 }}
                      onPress={() => this.props.navigation.navigate('addAddress')}
                    >
                      <Text style={[styles.inputTitle, { marginBottom: 10, color: colors.primary }]}>Add</Text>
                    </TouchableOpacity>
                  </View>
                  <AddressSection onSelect={this._selectedAddress} />
                  {address?.lift_available === 0 && Number(address?.floor_info) > 2 && (
                    <View style={{ marginTop: 10 }}>
                      <Text style={styles.warnText}>
                        *Nore : Rs. 10 would be extra charge for 10th floor without lift
                        facility.
                      </Text>
                    </View>
                  )}
                </>
              )
            }
            {
              user?.user_type === 3 && (
                <View>
                  <View style={[styles.row, { justifyContent: 'space-between' }]}>
                    <Text style={[styles.inputTitle, { marginBottom: 10 }]}>Select Distributor</Text>
                    <TouchableOpacity
                      style={{ padding: 10, marginTop: -10 }}
                      onPress={() => this.props.navigation.navigate('assignDistOrder', { callback: this.selectedDis })}
                    >
                      <Text style={[styles.inputTitle, { marginBottom: 10, color: colors.primary }]}>Select</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.inputTitle, { color: colors.primary }]}>{distibutorForVendorOrder?.first_name} {distibutorForVendorOrder?.last_name}</Text>
                </View>
              )
            }

            <View style={{ height: 40 }} />
            <TextInput
              style={[
                {
                  fontFamily: env.fontRegular,
                  backgroundColor: 'rgba(27, 27, 36, 0.1)',
                  paddingHorizontal: 15,
                  height: 120,
                  textAlignVertical: 'top',
                },
              ]}
              multiline
              placeholder="Delivery Note"
              placeholderTextColor="rgba(27, 27, 36, 0.3)"
              value={this.state.deliveryNote}
              onChangeText={(text) => this.setState({ deliveryNote: text })}
            />


            <View style={{ marginVertical: 30, alignSelf: 'center' }}>

              {
                confirmSchedule ? (
                  <Button
                    title='Confirm & book'
                    onPress={this._confirm}
                    containerStyle={{ paddingHorizontal: 30 }}
                  />
                ) : (
                    <>
                      <Button
                        title='Instant Service'
                        onPress={this._confirm}
                      />
                      <View style={{ height: 15 }} />
                      <SimpleButton
                        title='Schedule service'
                        onPress={this._scheduleService}
                      />
                      {/* <View style={{ height: 15 }} />
                      <SimpleButton
                        title='Subscription'
                        onPress={() => alert('Coming Soon.')}
                      /> */}
                    </>
                  )
              }
            </View>



          </ScrollView>
        </View>

        <AlertDialog
          isVisible={this.state.alert}
          message={this.state.alertMessage}
          onAction={() => this.setState({ alert: false })}
        />
        <DateTimePickerModal
          isVisible={this.state.datePicker}
          mode="date"
          minimumDate={new Date()}
          date={this.state.deliveryDate || new Date}
          onConfirm={this._handleConfirm}
          onCancel={() => this.setState({ datePicker: false })}
        />
      </View>
    );
  }

  _handleConfirm = (date) => {
    this.setState({ deliveryDate: date, datePicker: false, confirmSchedule: true })
  }
}

function mapStateToProps({ user, cart }) {
  return {
    walletBalance: user.walletBalance,
    user: user.currentUser,
    cardItems: cart.cardItems,
  };
}

export default connect(mapStateToProps, {
  rootLoader,
  getWalletTransactions,
})(CheckOut);

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
