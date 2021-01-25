import React, { Component } from 'react'
import { View, StyleSheet, Text, SafeAreaView } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import { hambargIcon, notificationIcon } from '../../assets'
import { Button, IconButton } from '../../components/Button'
import colors from '../../constants/colors'
import env from '../../constants/env'
import Header from '../../components/Header'
import { getSuppliers, customerAannounceVacation, rootLoader } from '../../actions'
import AlertDialog from '../../components/Dialog/AlertDialog'
import { Calendar, CalendarList, Agenda } from 'react-native-calendars'
import DateRangePicker from '../../components/DateRangePicker'

class AnnouceVacation extends Component {
  constructor() {
    super()

    this.state = {
      startDate: null,
      endDate: null
    }
  }

  componentDidMount() {
    this.props.getSuppliers()
  }

  _submit = async () => {
    const { startDate, endDate } = this.state

    if (!startDate) return this.showAlert('Please select date')
    else if (!endDate) return this.showAlert('Please select ending date')
    const requestParams = {
      vacation_date_from: moment(new Date(startDate)).format('YYYY-MM-DD'),
      vacation_date_to: moment(new Date(endDate)).format('YYYY-MM-DD')
    }
    this.props.rootLoader(true)
    let res = await customerAannounceVacation(requestParams)
    this.props.rootLoader(false)
    setTimeout(() => {
      this.showAlert(res.message)
    }, 350);
    if (res.status)
      this.setState({
        startDate: null,
        endDate: null
      })
  }

  showAlert = (message) => {
    this.setState({ alert: true, alertMessage: message })
  }

  render() {
   
    return (
      <View style={styles.root}>

        <Header
          title='Annouce Vacation'
        />
        <View style={styles.container}>



          {/* <Text style={{ fontFamily: env.fontMedium, color: '#747474', fontSize: 14, textAlign: 'center' }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry</Text> */}
          <View margin={10} />
          <Text style={{ fontFamily: env.fontSemiBold, color: '#000', fontSize: 14, textAlign: 'center' }}>
            Today's Date {moment().format('Do MMM, YYYY')}
          </Text>
          <View margin={10} />
          <DateRangePicker
            onSuccess={(s, e) => this.setState({ startDate: s, endDate: e })}
            minDate={new Date()}
          />
          <View margin={10} />
          <View style={{ width: '70%', alignSelf: 'center', marginTop: 30 }}>
            <Button
              title='Submit'
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

      </View>
    )
  }
}

function mapStateToProps({ user }) {
  return {
    supplierList: user.supplierList
  }
}

export default connect(mapStateToProps, {
  getSuppliers,
  rootLoader
})(AnnouceVacation)

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
  }

})
