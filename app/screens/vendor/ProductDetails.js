import React from 'react'
import { View, StyleSheet, Text, Image, Dimensions, TouchableOpacity } from 'react-native'
import { Shadow } from 'react-native-neomorph-shadows'
import { connect } from 'react-redux'
import { notificationIcon, backIcon, bottlePlaceholder } from '../../assets'
import { Button, IconButton } from '../../components/Button'
import colors from '../../constants/colors'
import env from '../../constants/env'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import Header from '../../components/Header'
import { BoxInputField } from '../../components/InputField'
import AlertDialog from '../../components/Dialog/AlertDialog'
import { addToCard, rootLoader } from '../../actions'

const { width } = Dimensions.get('screen')

class ProductDetails extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      preData: props.route.params.data,
      qty: '1'
    }
  }


  _addToCard = () => {
    const { preData, qty } = this.state
    const request = {
      product_id: preData.id,
      quantity: qty,
      return_can: '0',
      number_of_can: '',
      supplier_id: ''
    }
    this.props.addToCard(request);
  }

  // _submit = async () => {
  //   const { preData, qty } = this.state
  //   // this.props.rootLoader(true)
  //   // let res = await submitVendorOrder({
  //   //   product_id: preData.id,
  //   //   quantity: qty
  //   // })
  //   // this.props.rootLoader(false)
  //   // if (res.status) {
  //   //   return  this.props.navigation.navigate('payment', {
  //   //     data: { product: preData },
  //   //     qty
  //   //   })
  //   // } else {
  //   //   this.showAlert(res.message)
  //   // }
  //   return this.props.navigation.navigate('payment', {
  //     data: { product: preData },
  //     qty
  //   })
  // }

  showAlert = (message) => {
    this.setState({ alert: true, alertMessage: message })
  }


  render() {
    const { preData, qty } = this.state

    let isCardExist = this.props.cardItems?.findIndex(item => item?.product_id === preData?.id)

    return (
      <View style={styles.root}>
        <Header
          title={preData?.name}
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
                    source={{ uri: preData.image }}
                    style={{ height: '100%', width: '100%' }}
                  />
                </View>
              </Shadow>
            </View>
            <View margin={20}>
              <Text numberOfLines={1} style={styles.itemTitle}>{preData?.name}  |  Weight: {preData?.measurement_value}</Text>
              <View style={{ height: 5 }} />
              <Text numberOfLines={1} style={[styles.itemTitle, { color: colors.black }]}>Distributor price Rs: {preData?.distributor_price}</Text>
              <Text numberOfLines={1} style={[styles.itemTitle, { color: colors.black }]}>User price Rs: {preData?.sell_price}</Text>
              <View margin={10} />
              <View style={styles.divider} />
              <View margin={15} />
              

            </View>

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

          <AlertDialog
            isVisible={this.state.alert}
            message={this.state.alertMessage}
            onAction={() => this.setState({ alert: false })}
          />
        </View>
    )
  }

  _increaseQty = () => {
          let qty = this.state.qty || 0
    qty = Number(qty) + 1
    this.setState({ qty: String(qty) })
  }
  _decreaseQty = () => {
          let qty = this.state.qty || 0
    qty = Number(qty) - 1
    if (qty < 1) qty = 1
    this.setState({ qty: String(qty) })
  }

}

function mapStateToProps({ user, cart}) {
  return {
          supplierList: user.supplierList,
    cardItems: cart.cardItems
  }
}

export default connect(mapStateToProps, {
          rootLoader,
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
    color: '#515151'
  },
  divider: {
          height: 1,
    backgroundColor: '#515151',
    opacity: 0.3
  },
  qtyBtn: {
          height: 30,
    width: 30,
    backgroundColor: colors.blueLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15
  },
  qtyBtnText: {
          fontSize: 16,
    fontFamily: env.fontSemiBold,
    color: colors.white
  }
})
