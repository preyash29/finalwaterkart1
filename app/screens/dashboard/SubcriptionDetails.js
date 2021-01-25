import React from 'react'
import { TextInput, StyleSheet, View, ScrollView, Text, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import { backIcon, notificationIcon } from '../../assets'
import { Button, IconButton } from '../../components/Button'
import Header from '../../components/Header'
import colors from '../../constants/colors'
import env from '../../constants/env'
import { postpond_subscription_order_date, cancel_subscription } from '../../actions'
import DateTimePickerModal from "react-native-modal-datetime-picker"

class SubcriptionDetails extends React.Component {

  state = {
    data: this.props.route.params?.data,
    tempData: null,
    datePicker: false,
    minDate: new Date()
  }


  transferOrder = (data) => {
    this.setState({
      datePicker: new Date(data?.delivery_date),
      tempData: data,
      datePicker: true
    })
  }


  _cancelSubcription = async () => {
    const { data } = this.state
    const request = {
      subscription_id: data.id,
    }
    let res = await cancel_subscription(request);
    this.props.navigation.goBack()
  }


  _handleConfirm = async (date) => {
    const { tempData } = this.state
    const request = {
      subscription_order_id: tempData.id,
      delivery_date: moment(date).format('YYYY-MM-DD')
    }
    let res = await postpond_subscription_order_date(request);
    console.log(res)
    this.setState({ datePicker: false })
    this.props.navigation.goBack()
  }

  render() {
    const { data } = this.state
    return (
      <View style={styles.root}>
        <Header
          title='Subcription Details'
          left={
            <IconButton
              icon={backIcon}
              containerStyle={{ marginHorizontal: 5 }}
              onPress={() => this.props.navigation.goBack()}
            />
          }
        />
        <View style={styles.container}>

          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingVertical: 20 }}
          >
            <View margin={20}>

              <Text style={{ fontFamily: env.fontMedium, color: '#000', fontSize: 14, marginTop: 10, paddingHorizontal: 20 }}>
                subcription's Date: {moment(data?.start_date).format('Do MMM, YYYY')} - {moment(data?.end_date).format('Do MMM, YYYY')}
              </Text>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, marginTop: 20 }}
                activeOpacity={1}
              >
                <View style={{ borderRadius: 20, overflow: 'hidden', zIndex: 1, }}>
                  <Image
                    source={{ uri: data?.product?.image }}
                    style={{ width: 80, height: 80, backgroundColor: '#f7f7f7' }}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 20 }}>
                  <Text style={styles.serviceTitle}>{data?.product?.name}</Text>
                  <Text style={styles.serviceTitle}>Amount : Rs. {data?.total_amount}  |  Qty:  {data?.quantity}</Text>
                  <Text style={styles.serviceTitle}>Total order: {data?.total_orders || 0}</Text>
                  <Text style={styles.serviceTitle}>Remaining order: {(data?.total_orders - data?.completed_orders) || 0}</Text>
                </View>
              </TouchableOpacity>
              <View style={{ height: 40 }} />
              {
                data?.subscription_orders?.map((item, index) => {
                  return (
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20 }}
                      key={String(index)}
                    >
                      <Text style={{ fontFamily: env.fontMedium, color: colors.black, fontSize: 14 }}>Delivery On : {moment(new Date(item?.delivery_date)).format('DD, MMM YYYY')}</Text>
                      {
                        (item?.status === 0 && data?.status !== 2) && (
                          <TouchableOpacity
                            style={{ marginLeft: 10 }}
                            onPress={() => this.transferOrder(item)}
                          >
                            <Text style={{ fontFamily: env.fontMedium, color: colors.primary, fontSize: 14 }}>Pospond</Text>
                          </TouchableOpacity>
                        )
                      }
                    </View>
                  )
                })
              }
            </View>

          </ScrollView>
          {
            data?.status !== 2 && data?.status !== 3 && (
              <View style={{ marginVertical: 0 }}>
                <Button
                  title='Cancel Subcription'
                  containerStyle={{ borderRadius: 0 }}
                  onPress={this._cancelSubcription}
                />
              </View>
            )
          }
          {
            data?.status === 3 && (
              <View style={{ marginVertical: 0 }}>
                <Button
                  title='Completed'
                  containerStyle={{ borderRadius: 0 }}
                  onPress={() => this.props.navigation.goBack()}
                />
              </View>
            )
          }

        </View>
        <DateTimePickerModal
          isVisible={this.state.datePicker}
          mode="date"
          minimumDate={this.state.minDate || new Date()}
          onConfirm={this._handleConfirm}
          onCancel={() => this.setState({ datePicker: false })}
        />
      </View>
    )
  }
}

export default connect()(SubcriptionDetails)

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

})
