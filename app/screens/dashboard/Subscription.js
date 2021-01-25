import moment from 'moment'
import React from 'react'
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { connect } from 'react-redux'
import { add_subscription, rootLoader } from '../../actions'
import { backIcon } from '../../assets'
import AddressSection from '../../components/AddressSection'
import { Button, IconButton } from '../../components/Button'
import Checkbox from '../../components/Checkbox'
import AlertDialog from '../../components/Dialog/AlertDialog'
import Header from '../../components/Header'
import colors from '../../constants/colors'
import env from '../../constants/env'

class Subscription extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            preData: props.route.params?.data,
            startdatePicker: false,
            startDate: new Date(Date.now() + 24*60*60*1000),
            endDatePicker: false,
            endDate: new Date(Date.now() + 7*24*60*60*1000),
            isSunday: false,
            isMonday: false,
            isTuesday: false,
            isWednesday: false,
            isThursday: false,
            isFriday: false,
            isSaturday: false,
            address: null,
            vendorCode: props.user?.from_referral_id || ''
        }
    }

    _submit = async () => {
        const { startDate, endDate, isSunday, isMonday, isTuesday, isWednesday, isThursday, isFriday, isSaturday, address, preData, vendorCode } = this.state
        if (!startDate) return this.showAlert('Please select start date')
        else if (!endDate) return this.showAlert('Please select end date')
        else if (moment(startDate).isAfter(endDate)) return this.showAlert('Please select valid date range')
        else if (!isSunday && !isMonday && !isTuesday && !isWednesday && !isThursday && !isFriday && !isSaturday) return this.showAlert('Please select at list one a day in week')
        else if (!address) return this.showAlert('Please select address')
        this.props.rootLoader(true)
        const request = {
            product_id: preData.id,
            quantity: preData?.quantity || 1,
            start_date: moment(startDate).format('YYYY-MM-DD'),
            end_date: moment(endDate).format('YYYY-MM-DD'),
            delivery_address_id: address.id,
            setting_of_delivery: JSON.stringify({
                Monday: isMonday,
                Tuesday: isTuesday,
                Wednesday: isWednesday,
                Thursday: isThursday,
                Friday: isFriday,
                Saturday: isSaturday,
                Sunday: isSunday
            }),
            empty_can: String(preData?.empty_can || 0),
            number_of_can: preData?.number_of_can || '',
            supplier_id: preData?.supplier_id || '',
            vendor_code: vendorCode
        }

        let res = await add_subscription(request)
        this.props.rootLoader(false)
        if (res.status) {
            return this.props.navigation.navigate('customerPayment', { data: res.data, type: 'sub' })
        } else {
            this.showAlert(res.message)
        }
    }

    showAlert = (message) => {
        this.setState({ alert: true, alertMessage: message })
    }

    _selectedAddress = (data) => {
        this.setState({ address: data });
    };

    render() {
        const { startDate, endDate, address } = this.state
        return (
            <View style={styles.root}>
                <Header
                    title='Subscription'
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
                            <Text style={styles.inputTitle}>Vendor code</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder='type here'
                                placeholderTextColor='#999999'
                                value={this.state.vendorCode}
                                onChangeText={(text) => this.setState({ vendorCode: text })}
                            />
                            <View style={{ height: 30 }} />
                            <Text style={styles.inputTitle}>Select subscription plan</Text>
                            <View style={{ height: 20 }} />

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View style={{ flexGrow: 1 }}>
                                    <Text style={styles.reminderTitle}>Start date</Text>
                                    <TouchableOpacity
                                        style={styles.dateBox}
                                        onPress={() => this.setState({ startdatePicker: true })}
                                    >
                                        <Text style={styles.reminderTitle}>{startDate && moment(startDate).format('DD-MMM-YYYY')}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: 20 }} />
                                <View style={{ flexGrow: 1 }}>
                                    <Text style={styles.reminderTitle}>End date</Text>
                                    <TouchableOpacity
                                        style={styles.dateBox}
                                        onPress={() => this.setState({ endDatePicker: true })}
                                    >
                                        <Text style={styles.reminderTitle}>{endDate && moment(endDate).format('DD-MMM-YYYY')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View margin={10} />
                            <View style={{ backgroundColor: '#d7d7d7', height: 1, marginVertical: 15 }} />
                            <TouchableOpacity activeOpacity={1} style={styles.row} onPress={() => this.setState({ isSunday: !this.state.isSunday })}>
                                <Text style={styles.repeaterText}>Sunday</Text>
                                <Checkbox
                                    isChecked={this.state.isSunday}
                                    // onPress={() => this.setState({ isSunday: !this.state.isSunday })}
                                />
                            </TouchableOpacity>
                            <View style={{ backgroundColor: '#d7d7d7', height: 1, marginVertical: 15 }} />
                            <TouchableOpacity activeOpacity={1} style={styles.row} onPress={() => this.setState({ isMonday: !this.state.isMonday })}>
                                <Text style={styles.repeaterText}>Monday</Text>
                                <Checkbox
                                    isChecked={this.state.isMonday}
                                    // onPress={() => this.setState({ isMonday: !this.state.isMonday })}
                                />
                            </TouchableOpacity>
                            <View style={{ backgroundColor: '#d7d7d7', height: 1, marginVertical: 15 }} />
                            <TouchableOpacity activeOpacity={1} style={styles.row} onPress={() => this.setState({ isTuesday: !this.state.isTuesday })}>
                                <Text style={styles.repeaterText}>Tuesday</Text>
                                <Checkbox
                                    isChecked={this.state.isTuesday}
                                    // onPress={() => this.setState({ isTuesday: !this.state.isTuesday })}
                                />
                            </TouchableOpacity>
                            <View style={{ backgroundColor: '#d7d7d7', height: 1, marginVertical: 15 }} />
                            <TouchableOpacity activeOpacity={1} style={styles.row} onPress={() => this.setState({ isWednesday: !this.state.isWednesday })}>
                                <Text style={styles.repeaterText}>Wednesday</Text>
                                <Checkbox
                                    isChecked={this.state.isWednesday}
                                    // onPress={() => this.setState({ isWednesday: !this.state.isWednesday })}
                                />
                            </TouchableOpacity>
                            <View style={{ backgroundColor: '#d7d7d7', height: 1, marginVertical: 15 }} />
                            <TouchableOpacity activeOpacity={1} style={styles.row}  onPress={() => this.setState({ isThursday: !this.state.isThursday })}>
                                <Text style={styles.repeaterText}>Thursday</Text>
                                <Checkbox
                                    isChecked={this.state.isThursday}
                                    // onPress={() => this.setState({ isThursday: !this.state.isThursday })}
                                />
                            </TouchableOpacity>
                            <View style={{ backgroundColor: '#d7d7d7', height: 1, marginVertical: 15 }} />
                            <TouchableOpacity activeOpacity={1} style={styles.row} onPress={() => this.setState({ isFriday: !this.state.isFriday })}>
                                <Text style={styles.repeaterText}>Friday</Text>
                                <Checkbox
                                    isChecked={this.state.isFriday}
                                    // onPress={() => this.setState({ isFriday: !this.state.isFriday })}
                                />
                            </TouchableOpacity>
                            <View style={{ backgroundColor: '#d7d7d7', height: 1, marginVertical: 15 }} />
                            <TouchableOpacity activeOpacity={1} style={styles.row} onPress={() => this.setState({ isSaturday: !this.state.isSaturday })}>
                                <Text style={styles.repeaterText}>Saturday</Text>
                                <Checkbox
                                    isChecked={this.state.isSaturday}
                                    // onPress={() => this.setState({ isSaturday: !this.state.isSaturday })}
                                />
                            </TouchableOpacity>
                            <View style={{ backgroundColor: '#d7d7d7', height: 1, marginVertical: 15 }} />
                            <View style={{ height: 30 }} />

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

                        </View>

                    </ScrollView>

                    <Button
                        title='Subscribe'
                        onPress={this._submit}
                        containerStyle={{ borderRadius: 0 }}
                    />


                </View>
                {/* Hidden Components */}
                <DateTimePickerModal
                    isVisible={this.state.startdatePicker}
                    mode='date'
                    minimumDate={new Date()}
                    date={startDate || new Date()}
                    onConfirm={(date) => this.setState({ startDate: date, startdatePicker: false })}
                    onCancel={() => this.setState({ startdatePicker: false })}
                />
                <DateTimePickerModal
                    isVisible={this.state.endDatePicker}
                    mode='date'
                    minimumDate={new Date()}
                    date={endDate || new Date()}
                    onConfirm={(date) => this.setState({ endDate: date, endDatePicker: false })}
                    onCancel={() => this.setState({ endDatePicker: false })}
                />
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
        user: user.currentUser
    };
  }

export default connect(mapStateToProps, {
    rootLoader
})(Subscription)

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
    dateBox: {
        borderWidth: 1,
        borderColor: '#d7d7d7',
        padding: 10,
        marginTop: 5
    },

    inputTitle: {
        fontFamily: env.fontMedium,
        color: colors.black,
        fontSize: 16
    },
    reminderTitle: {
        fontFamily: env.fontMedium,
        fontSize: 14,
        color: '#747474'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    repeaterText: {
        fontFamily: env.fontMedium,
        fontSize: 14,
        color: colors.black
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
})
