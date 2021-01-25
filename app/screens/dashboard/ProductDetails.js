import React from 'react'
import { View, StyleSheet, Text, Image, Dimensions, TouchableOpacity } from 'react-native'
import { Shadow } from 'react-native-neomorph-shadows'
import { connect } from 'react-redux'
import { backIcon, referalcodeIcon } from '../../assets'
import { Button, IconButton, RadioButton, SimpleButton } from '../../components/Button'
import colors from '../../constants/colors'
import env from '../../constants/env'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import InputField, { BoxInputField, DropDownInput } from '../../components/InputField'
import DateTimePickerModal from "react-native-modal-datetime-picker"
import Header from '../../components/Header'
import AddressSection from '../../components/AddressSection'
import {
  getProductDetails,
  rootLoader,
  getSuppliers,
  addToCard
} from '../../actions'
import moment from 'moment'
import AlertDialog from '../../components/Dialog/AlertDialog'
import Checkbox from '../../components/Checkbox'
import ReturnCanDialog from '../../components/Dialog/ReturnCanDialog'
import { WebView } from 'react-native-webview'
import HTML from 'react-native-render-html'

const { width } = Dimensions.get('screen')

class ProductDetails extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      preData: props.route.params?.data,
      data: null,
      emptyCan: 1, // 1 Yes 0 No
      paymentType: 1, // 1 Cash on delivery 2 Pay online
      datePicker: false,
      deliveryDate: null,
      address: null,
      confirmSchedule: false,
      deliveryNote: '',
      supplierId: null,
      numberOfCan: '',
      size: '',
      vendorCode: '',
      qty: 1
    }
  }

  componentDidMount() {
    this.initData()
  }

  initData = async () => {
    this.props.rootLoader(true)
    this.props.getSuppliers()
    let res = await getProductDetails(this.state.preData?.id)
    this.props.rootLoader(false)
    if (res.status) {
      this.setState({ data: res.data })
    }
  }

  _addToCard = () => {
    const { data, emptyCan, numberOfCan, qty, supplierId } = this.state
    const request = {
      product_id: data.id,
      quantity: qty,
      return_can: String(emptyCan || 0),
      number_of_can: numberOfCan || '',
      supplier_id: supplierId || ''
    }
    this.props.addToCard(request);
  }

  showAlert = (message) => {
    this.setState({ alert: true, alertMessage: message })
  }

  _suppilerChange = (supplier) => {
    this.setState({ supplierId: supplier.value })
    const { data } = this.state
    if (supplier.value !== data.supplier.id) this.setState({ returnDialog: true })
  }

  _getSub = () => {
    const { data, emptyCan, numberOfCan, qty, supplierId } = this.state
    if(emptyCan ===1 && !numberOfCan) return this.showAlert('Please enter number of can')
    if(emptyCan ===1 && !supplierId) return this.showAlert('Please select company name')
    this.props.navigation.navigate('subscription', { data: { ...data, empty_can: emptyCan, number_of_can: numberOfCan, supplier_id: supplierId, quantity: qty } })
  }

  _increaseQty = () => {
    try {
      let qty = Number(this.state.qty)
      if (!Number(qty)) qty = 0;
      qty += 1;
      this.setState({ qty })
    } catch (error) { }
  };

  _decreaseQty = () => {
    try {
      let qty = Number(this.state.qty)
      if (!Number(qty)) qty = 0;
      qty -= 1;
      if (qty <= 0) qty = 1;
      this.setState({ qty })
    } catch (error) { }
  };

  render() {
    const { emptyCan, deliveryDate, data, confirmSchedule } = this.state
    let supplierData = []
    if (this.props.supplierList) {
      this.props.supplierList.map(item => {
        supplierData.push({ label: item.name, value: item.id })
      })
    }
    let isCardExist = this.props.cardItems?.findIndex(item => item?.product_id === data?.id)

    return (
      <View style={styles.root}>
        <Header
          title={data?.name}
          left={
            <IconButton
              icon={backIcon}
              containerStyle={{ marginHorizontal: 5 }}
              onPress={() => this.props.navigation.goBack()}
            />
          }
        />
        <View style={styles.container}>
          <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={{ height: 30 }} />
            <View style={{ alignSelf: 'center' }}>
              <Shadow
                style={{
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.2,
                  shadowColor: colors.gray,
                  shadowRadius: 10,
                  backgroundColor: colors.white,
                  width: width / 2 - 40,
                  height: width / 2 - 40,
                  borderRadius: 30,
                  marginHorizontal: 20
                }}
              >
                <View
                  style={{ flex: 1, overflow: 'hidden', borderRadius: 30 }}
                >
                  <Image
                    source={{ uri: data?.image }}
                    style={{ height: '100%', width: '100%' }}
                  />
                </View>
              </Shadow>
            </View>
            <View margin={20} style={{ flex: 1 }}>
              <Text numberOfLines={1} style={styles.itemTitle}>{data?.supplier.name}</Text>
              <View style={{ height: 5 }} />
              <Text numberOfLines={1} style={styles.itemDesc}><Text style={{ color: colors.black }}>Rs: {data?.sell_price}</Text>  |  Weight: {data?.measurement_unit}L</Text>
              <View style={{ height: 10 }} />

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 8,
                  alignSelf: 'center'
                }}>
                
                <TouchableOpacity
                  style={[styles.qtyBtn, { backgroundColor: colors.red }]}
                  onPress={() => this._decreaseQty()}
                >
                  <Text style={styles.qtyBtnText}>−</Text>
                </TouchableOpacity>
                <BoxInputField
                  customStyle={{
                    height: undefined,
                    marginHorizontal: 10,
                    width: 60,
                    paddingHorizontal: 10,
                    fontSize: 13,
                    paddingVertical: 0,
                    textAlign: 'center',
                  }}
                  keyboardType="number-pad"
                  value={String(this.state.qty)}
                  // editable={false}
                  onChangeText={(text) => this.setState({ qty: text })}
                />
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => this._increaseQty()}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>

              <View style={{ height: 20 }} />
              {
                data?.product_type === 1 ? (
                  <HTML
                    html={data?.description}
                    contentWidth={width}
                  />
                ) : null
              }
            </View>
            <View style={styles.divider} />
            <View margin={20} style={{ flex: 1 }}>
              {
                confirmSchedule && (
                  <>
                    <Text style={[styles.inputTitle, { opacity: 0.5 }]}>Delivery Date : {moment(deliveryDate).format('Do MMMM YYYY [time :] hh:mm a')}</Text>
                    <View style={{ height: 20 }} />
                  </>
                )
              }

              {
                data?.product_type === 2 ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Text style={styles.inputTitle}>Do you have empty can?</Text>
                    <View style={{ marginLeft: 20, flexDirection: 'row' }}>
                      <RadioButton
                        title='Yes'
                        isFill={emptyCan === 1}
                        onPress={() => this.setState({ emptyCan: 1 })}
                      />
                      <View style={{ width: 10 }} />
                      <RadioButton
                        title='No'
                        isFill={emptyCan === 0}
                        onPress={() => this.setState({ emptyCan: 0 })}
                      />
                    </View>
                  </View>
                ) : null
              }


              {
                emptyCan === 1 && data?.product_type === 2 ? (
                  <View>
                    <View style={{ width: '70%' }}>
                      <InputField
                        placeholder='Number of empty can you have'
                        value={this.state.numberOfCan}
                        onChangeText={(text) => this.setState({ numberOfCan: text })}
                      />
                    </View>
                    <View style={{ width: '70%' }}>
                    <DropDownInput
                          placeholder='Company name'
                          items={supplierData}
                          defaultValue={this.state.supplierId}
                          onChangeItem={this._suppilerChange}
                        />
                    </View>
                    
                  </View>
                  // ) : null
                ) : (
                    <View style={{ marginTop: 10 }}>
                      {
                        data?.empty_can_charges > 0 && data?.product_type === 2 ? (
                          <Text style={styles.warnText}>Refundable Deposited of Rs. {data?.empty_can_charges} will be added</Text>
                        ) : null
                      }
                    </View>
                  )
              }

              <View style={{ height: 30 }} />
              {
                data?.product_type === 2 && (
                  <Button
                    title='Subscription'
                    onPress={this._getSub}
                  />
                )
              }

            </View>
          </KeyboardAwareScrollView>
          {
            isCardExist < 0 ? (
              <View style={{ marginVertical: 0 }}>
                <Button
                  title='ADD TO CART'
                  containerStyle={{ borderRadius: 0 }}
                  onPress={this._addToCard}
                />
              </View>
            ) : (
                <View style={{ flexDirection: 'row' }}>
                  <Button
                    title='Continue shopping'
                    containerStyle={{ borderRadius: 0, width: width / 2 }}
                    onPress={() => this.props.navigation.goBack()}
                  />
                  <Button
                    title='Go Cart'
                    containerStyle={{ borderRadius: 0, width: width / 2 }}
                    onPress={() => this.props.navigation.navigate('cart')}
                  />
                </View>
              )
          }


        </View>

        {/* Hidden Components */}
        <AlertDialog
          isVisible={this.state.alert}
          message={this.state.alertMessage}
          onAction={() => this.setState({ alert: false })}
        />
        <ReturnCanDialog
          isVisible={this.state.returnDialog}
          onClose={() => this.setState({ returnDialog: false })}
          returnAction={() => this.setState({ returnDialog: false })}
        />

      </View>
    )
  }

  _handleConfirm = (date) => {
    this.setState({ deliveryDate: date, datePicker: false, confirmSchedule: true })
  }


}

function mapStateToProps({ user, cart }) {
  return {
    supplierList: user.supplierList,
    cardItems: cart.cardItems
  }
}

export default connect(mapStateToProps, {
  getProductDetails,
  rootLoader,
  getSuppliers,
  addToCard
})(ProductDetails)

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
  itemTitle: {
    fontSize: 16,
    fontFamily: env.fontPoppinsRegular,
    color: '#515151',
    textAlign: 'center'
  },
  itemDesc: {
    fontSize: 13,
    fontFamily: env.fontPoppinsRegular,
    color: '#515151',
    textAlign: 'center'
  },
  divider: {
    height: 3,
    backgroundColor: '#F6F6F6'
  },
  inputTitle: {
    fontFamily: env.fontPoppinsMedium, color: colors.black, fontSize: 15
  },
  inputIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginRight: 10
  },
  warnText: {
    fontSize: 14,
    fontFamily: env.fontPoppinsMedium,
    color: '#ff0000',
  },
  qtyBtn: {
    height: 24,
    width: 24,
    backgroundColor: colors.blueLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  qtyBtnText: {
    fontSize: 16,
    fontFamily: env.fontSemiBold,
    color: colors.white,
  },
})
