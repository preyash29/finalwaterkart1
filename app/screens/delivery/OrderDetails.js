import React from 'react'
import { View, StyleSheet, Text, Image, Dimensions, Platform, Linking } from 'react-native'
import { connect } from 'react-redux'
import { backIcon, usernameIcon, clockIcon, localIcon, phoneIcon, directionIcon } from '../../assets'
import { IconButton, SimpleButton } from '../../components/Button'
import colors from '../../constants/colors'
import env from '../../constants/env'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import Header from '../../components/Header'
import momen from 'moment'

const { width } = Dimensions.get('screen')

class OrderDetails extends React.Component {
  constructor (props) {
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

  render () {
    const { data } = this.state
    const { product, customer, delivery_address } = data
    return (
      <View style={styles.root}>
        <Header
          title={product?.name}
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
                  <Text numberOfLines={3} style={styles.normalText}>Weight: {product?.measurement_unit}L</Text>
                </View>
              </View>
              <View margin={12} />
              <View style={styles.row}>
                <View style={styles.hightlight}>
                  <Text style={[styles.hightlightText, { fontSize: 18, fontFamily: env.fontPoppinsMedium }]}>10th</Text>
                  <Text style={[styles.hightlightText, { marginTop: -5 }]}>March</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.normalText}>Order no #{data.id}</Text>
                  <Text style={styles.normalText}>Total Price : Rs. {data.total_amount} </Text>
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
            </View>
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
                <Image source={localIcon} style={styles.itemIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.otherText, { fontSize: 16, color: '#353535' }]}>Delivery to Address:</Text>
                  <Text style={[styles.otherText, { fontSize: 14, color: '#616161' }]}>{delivery_address?.floor_info} {delivery_address?.landmark}</Text>
                </View>
              </View>
              <View margin={20} />
              <View style={{ marginVertical: 30, flexDirection: 'row', justifyContent: 'space-between' }}>
                <SimpleButton
                  title='Customer'
                  customWidth={(width - 60) / 2}
                  customHeight={45}
                  titleStyle={{ color: colors.white }}
                  containStyle={{ backgroundColor: colors.blueLight }}
                  icon={<Image source={phoneIcon} style={styles.buttonIcon} />}
                  onPress={() => this._openLink(`tel:${customer?.mobile}`)}
                />
                <View style={{ height: 15 }} />
                <SimpleButton
                  title='Direction'
                  customWidth={(width - 60) / 2}
                  customHeight={45}
                  icon={<Image source={directionIcon} style={styles.buttonIcon} />}
                  onPress={() => this.openLocation(delivery_address?.latitude, delivery_address?.longitude)}
                />
              </View>

            </View>
          </KeyboardAwareScrollView>
        </View>

      </View>
    )
  }
}

export default connect()(OrderDetails)

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
