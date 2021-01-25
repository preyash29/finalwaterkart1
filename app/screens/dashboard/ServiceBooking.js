import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, ToastAndroid, Platform, TextInput } from 'react-native'
import { connect } from 'react-redux'
import { backIcon } from '../../assets'
import { Button, IconButton } from '../../components/Button'
import colors from '../../constants/colors'
import env from '../../constants/env'
import DateTimePickerModal from "react-native-modal-datetime-picker"
import Header from '../../components/Header'
import { addService, rootLoader } from '../../actions'
import AlertDialog from '../../components/Dialog/AlertDialog'
import AddressSection from '../../components/AddressSection'
import moment from 'moment'

class ServiceBooking extends Component {
  constructor(props) {
    super(props)

    this.state = {
      preData: props.route.params?.data,
      date: null,
      addressId: null,
      deliveryNote: ''
    }
  }

  _submit = async () => {
    const { preData, date, addressId, deliveryNote } = this.state
    if (!date) return this.showAlert('Please select date')
    else if (!addressId) return this.showAlert('Please select address')
    const requestParams = {
      service_id: preData.id,
      address_id: addressId,
      visit_date: moment(date).format('YYYY-MM-DD'),
      note: deliveryNote
    }
    this.props.rootLoader(true)
    let res = await this.props.addService(requestParams)
    this.props.rootLoader(false)
    if (res.status) {
      return this.props.navigation.navigate('myServices')
    }
    this.showAlert(res.message)
  }

  showAlert = (message) => {
    this.setState({ alert: true, alertMessage: message })
  }

  _selectedAddress = (data) => {
    this.setState({ addressId: data.id })
  }

  render() {
    const { preData, date } = this.state
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

          <TouchableOpacity
            style={{
              borderBottomWidth: 1,
              borderBottomColor: '#d7d7d7',
              paddingBottom: 10
            }}
            onPress={() => this.setState({ datePicker: true })}
          >
            <Text style={{ fontFamily: env.fontRegular, color: '#747474', fontSize: 14 }}>
              {date ? moment(date).format('DD MMMM YYYY') : 'Preffered date to visit'}
            </Text>
          </TouchableOpacity>
          <View style={{ height: 30 }} />
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

          <View style={{ height: 30 }} />

          <Text style={[styles.inputTitle, { marginBottom: 10 }]}>Select service location</Text>
          <View>
            <AddressSection
              onSelect={this._selectedAddress}
            />
          </View>
          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={() => this.props.navigation.navigate('addAddress')}
          >
            <Text style={{ fontFamily: env.fontPoppinsMedium, color: colors.blueLight, fontSize: 16, marginBottom: 3 }}> + Add new location</Text>
          </TouchableOpacity>


          <View style={{ width: '70%', alignSelf: 'center', marginTop: 30 }}>
            <Button
              title='Submit Request'
              onPress={this._submit}
            />
          </View>

        </View>

        {/* Hidden Components */}
        <AlertDialog
          isVisible={this.state.alert}
          message={this.state.alertMessage}
          onAction={() => this.setState({ alert: false })}
        />
        <DateTimePickerModal
          isVisible={this.state.datePicker}
          mode="date"
          minimumDate={new Date()}
          date={this.state.date || new Date}
          onConfirm={this._handleConfirm}
          onCancel={() => this.setState({ datePicker: false })}
        />

      </View>
    )
  }

  _handleConfirm = (date) => {
    this.setState({ date: date, datePicker: false, confirmSchedule: true })
  }
}

function mapStateToProps({ user }) {
  return {
    supplierList: user.supplierList
  }
}

export default connect(mapStateToProps, {
  addService,
  rootLoader
})(ServiceBooking)

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
    padding: 30
  },
  inputTitle: {
    fontFamily: env.fontSemiBold, color: colors.black, fontSize: 15
  },

})
