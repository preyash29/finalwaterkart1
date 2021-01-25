import React from 'react'
import { View, StyleSheet, Image, Text, ScrollView, TouchableOpacity, Linking } from 'react-native'
import { connect } from 'react-redux'
import colors from '../../../constants/colors'
import {
  deliveryIcon,
  warehoursIcon,
  appratmentstorageIcon,
  arrowrightIcon,
  callCenterIcon,
  mobileIcon,
  webIcon
} from '../../../assets'
import env from '../../../constants/env'
import { BoxInputField } from '../../../components/InputField'
import AddressSection from '../../../components/AddressSection'
import { Button } from '../../../components/Button'
import AlertDialog from '../../../components/Dialog/AlertDialog'
import { rootLoader, addCorporateBooking, corporateBookingSetting } from '../../../actions'

class Community extends React.Component {
  constructor() {
    super()

    this.state = {
      cname: '',
      contactPerson: '',
      mobile: '',
      message: '',
      addressId: null,
      settings: null
    }
  }

  async componentDidMount() {
    this.props.rootLoader(true)
    let res = await corporateBookingSetting()
    this.props.rootLoader(false)
    if (res.status)
      this.setState({ settings: res.data })
  }

  _selectedAddress = (data) => {
    this.setState({ addressId: data.id })
  }

  _submit = async () => {
    const { contactPerson, mobile, message, addressId, cname } = this.state
    if (!addressId) return this.showAlert('Please select address')
    else if (!cname) return this.showAlert('Please enter community name')
    else if (!contactPerson) return this.showAlert('Please enter person name')
    else if (!mobile) return this.showAlert('Please enter mobile number')
    else if (!message) return this.showAlert('Please enter message')
    const requestParams = {
      address_id: addressId,
      person_name: contactPerson,
      mobile_number: mobile,
      message: message
    }
    this.props.rootLoader(true)
    let res = await this.props.addCorporateBooking(requestParams)
    this.props.rootLoader(false)
    setTimeout(() => {
      this.showAlert(res.message)
    }, 350);
    if (res.status)
      this.setState({
        contactPerson: '',
        mobile: '',
        message: '',
      })
  }

  showAlert = (message) => {
    this.setState({ alert: true, alertMessage: message })
  }

  _openList = (uri) => {
    Linking.openURL(uri)
      .catch(error => {
        // alert(error)
      })
  }

  render() {
    const { contactPerson, mobile, message, settings } = this.state

    return (
      <View style={styles.root}>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
        >

          <View style={{ flexDirection: 'row', marginTop: 10 }}>

            <View style={styles.rowItem}>
              <Image
                source={warehoursIcon}
                style={styles.stockIcon}
              />
              <Text style={styles.rowItemTitle}>Stock from Warehouse</Text>
            </View>

            <View style={{ justifyContent: 'center', marginTop: -60 }}>
              <Image source={arrowrightIcon} style={{ height: 12, width: 12, resizeMode: 'contain' }} />
            </View>

            <View style={styles.rowItem}>
              <Image
                source={appratmentstorageIcon}
                style={styles.stockIcon}
              />
              <Text style={styles.rowItemTitle}>Corporate in house storage center by us</Text>
            </View>

            <View style={{ justifyContent: 'center', marginTop: -60 }}>
              <Image source={arrowrightIcon} style={{ height: 12, width: 12, resizeMode: 'contain' }} />
            </View>

            <View style={styles.rowItem}>
              <Image
                source={deliveryIcon}
                style={styles.stockIcon}
              />
              <Text style={styles.rowItemTitle}>Delivery to individuals in complex</Text>
            </View>
          </View>

          <View style={{ marginHorizontal: 20 }}>
            <Text style={styles.inputTitle}>Place an order by</Text>

            <View style={[styles.row, { justifyContent: 'space-between', marginTop: 10 }]}>

              <TouchableOpacity
                style={{ padding: 10, alignItems: 'center' }}
                onPress={() => this._openList(`tel:${settings?.call_center_number}`)}
              >
                <Image source={callCenterIcon} style={styles.stockIcon} />
                <Text style={{ fontFamily: env.fontMedium, fontSize: 14, color: colors.black }}>Call center</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ padding: 10, alignItems: 'center' }}
                onPress={() => this._openList(settings?.website_url)}
              >
                <Image source={webIcon} style={styles.stockIcon} />
                <Text style={{ fontFamily: env.fontMedium, fontSize: 14, color: colors.black }}>Website</Text>
              </TouchableOpacity>

              <View style={{ padding: 10, alignItems: 'center', flex: 1 / 3 }}>
                {/* <Image source={mobileIcon} style={styles.stockIcon} />
                <Text style={{ fontFamily: env.fontMedium, fontSize: 14, color: colors.black }}>Mobile app</Text> */}
              </View>
            </View>
            <View style={{ height: 20 }} />
            <Text style={styles.inputTitle}>Benefits of community booking</Text>
            <View style={{ height: 20 }} />
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 8, height: 8, borderRadius: 10, backgroundColor: colors.blueLight, marginRight: 15, marginTop: 5 }} />
              <Text style={{ fontFamily: env.fontMedium, fontSize: 13, color: '#747474', flex: 1 }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry , Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</Text>
            </View>
            <View style={{ height: 10 }} />
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 8, height: 8, borderRadius: 10, backgroundColor: colors.blueLight, marginRight: 15, marginTop: 5 }} />
              <Text style={{ fontFamily: env.fontMedium, fontSize: 13, color: '#747474', flex: 1 }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry</Text>
            </View>
            <View style={{ height: 20 }} />
            <Text style={[styles.inputTitle, { color: colors.blueLight }]}>Contact us for programme enrollment</Text>
            <View style={{ height: 20 }} />
            <Text style={styles.inputTitle}>{settings?.contact_person_name} : +91 {settings?.contact_person_number}</Text>
            <View style={{ height: 20 }} />

            <BoxInputField
              placeholder='Company Name'
              value={this.state.cname}
              onChangeText={(val) => this.setState({ cname: val })}
            />
            <View style={{ height: 10 }} />


            <BoxInputField
              placeholder='Contact person'
              value={contactPerson}
              onChangeText={(val) => this.setState({ contactPerson: val })}
            />
            <View style={{ height: 10 }} />
            <BoxInputField
              placeholder='Mobile number'
              value={mobile}
              keyboardType='phone-pad'
              onChangeText={(val) => this.setState({ mobile: val })}
            />
            <View style={{ height: 10 }} />
            <BoxInputField
              placeholder='Write your message...'
              value={message}
              onChangeText={(val) => this.setState({ message: val })}
              multiline
              numberOfLines={6}
              customStyle={{ height: 120, textAlignVertical: 'top' }}
            />
            <View style={{ height: 20 }} />
            <Text style={styles.inputTitle}>Select Location</Text>
            <AddressSection
              onSelect={this._selectedAddress}
            />
            <View style={{ marginVertical: 50, width: '70%', alignSelf: 'center' }}>
              <Button
                title='Submit'
                onPress={this._submit}
              />
            </View>
          </View>

          {/* <TouchableOpacity
            style={styles.footer}
          >
            <Text style={{ fontFamily: env.fontSemiBold, fontSize: 14, color: colors.black, textAlign: 'center' }}>Conatct waterkart sales team</Text>
          </TouchableOpacity> */}

        </ScrollView>
        <AlertDialog
          isVisible={this.state.alert}
          message={this.state.alertMessage}
          onAction={() => this.setState({ alert: false })}
        />

      </View>
    )
  }
}

export default connect(null, {
  rootLoader,
  addCorporateBooking
})(Community)

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  stockIcon: {
    resizeMode: 'contain',
    width: 35,
    height: 35,
    marginBottom: 10
  },
  rowItem: {
    margin: 20,
    alignItems: 'center',
    flex: 1 / 3
  },
  rowItemTitle: {
    textAlign: 'center',
    fontSize: 11,
    fontFamily: env.fontMedium
  },
  inputTitle: {
    fontFamily: env.fontMedium,
    color: colors.black,
    fontSize: 15
  },
  footer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#BFE2FF'
  }
})
