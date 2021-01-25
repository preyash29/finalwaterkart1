import React, { useEffect } from 'react'
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Dimensions,
    Platform,
    ScrollView
} from 'react-native'
import MapView from 'react-native-maps'
import { Button, IconButton, RadioButton } from '../../components/Button'
import env from '../../constants/env'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { rootLoader, addAddress, editAddress } from "../../actions";
import { connect } from 'react-redux'
import AlertDialog from '../../components/Dialog/AlertDialog'
import { backIcon } from '../../assets'
import Header from '../../components/Header'
import colors from '../../constants/colors'

const { width, height } = Dimensions.get('window')

class AddAddress extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            editData: props.route.params?.editData,
            locationType: '1',
            liftAvailabily: true,
            address: '',
            landmark: '',
            region: null,
            zipCode: '',
            city: '',
            state: '',
            country: '',
            floorInfo: '',
            aboutLift: '',
            fullname: props?.user?.first_name + ' ' + props?.user?.last_name,
            phone: props?.user?.mobile,
        }
    }

    componentDidMount() {
        if (this.state.editData) {
            const { floor_info, landmark, address_type, lift_available, note_about_lift, latitude, longitude, pincode, state, country, city, address, name, mobile } = this.state.editData
            this.setState({
                locationType: address_type,
                liftAvailabily: lift_available === 1 ? true : false,
                address,
                landmark: landmark,
                region: {
                    latitude: Number(latitude),
                    longitude: Number(longitude),
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1
                },
                zipCode: pincode,
                city: city,
                state: state,
                country: country,
                floorInfo: floor_info,
                aboutLift: note_about_lift,
                fullname: name,
                phone: mobile
            })
        }
    }


    _locationGet = (location, details) => {
        let address = details.formatted_address
        let latitude = details.geometry.location.lat
        let longitude = details.geometry.location.lng
        let zip_code = ''
        let city = ''
        let state = ''
        let country = ''

        details.address_components.map(item => {
            item.types.map(subItem => { if (subItem === 'postal_code') zip_code = item.short_name })
            item.types.map(subItem => { if (subItem === "country") country = item.long_name })
            item.types.map(subItem => { if (subItem === "administrative_area_level_1") state = item.long_name })
            // item.types.map(subItem => { if (subItem === "administrative_area_level_2") city = item.long_name })
            item.types.map(subItem => { if (subItem === "locality") city = item.long_name })
            if (!city) item.types.map(subItem => { if (subItem === "sublocality_level_1") city = item.long_name })
        })

        this.setState({
            address,
            zipCode: zip_code,
            city,
            state,
            country,
            region: {
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1
            }
        })
    }

    _onRegionChangeComplete = (data) => {
        this.setState({
            region: {
                ...data.nativeEvent.coordinate,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1
            }
        })
    }

    _addAddress = async () => {
        const { locationType, liftAvailabily, region, city, state, country, landmark, zipCode, floorInfo, aboutLift, editData, address, fullname, phone } = this.state
        if (!region) return this.showAlert('Please select location')
        else if (!address) return this.showAlert('Please enter address')
        else if (!floorInfo) return this.showAlert('Please enter floor details')
        else if (!fullname) return this.showAlert('Please enter full name')
        else if (!phone) return this.showAlert('Please enter mobile number')
        else if (isNaN(phone)) return this.showAlert('mobile number is not valid')
        const requestParams = {
            address_type: locationType,
            pincode: zipCode,
            floor_info: floorInfo,
            address,
            landmark: landmark,
            lift_available: liftAvailabily ? 1 : 0,
            note_about_lift: aboutLift,
            city,
            state,
            country,
            latitude: region?.latitude,
            longitude: region?.longitude,
            name: fullname,
            mobile: phone
        }
        this.props.rootLoader(true)
        let res;
        if (editData) {
            res = await this.props.editAddress(editData.id, requestParams)
        } else {
            res = await this.props.addAddress(requestParams)
        }
        this.props.rootLoader(false)
        if (res.status) {
            return this.props.navigation.goBack()
        }
        this.showAlert(res.message)
        this.props.rootLoader(false)

    }

    showAlert = (message) => {
        this.setState({ alert: true, alertMessage: message })
    }


    render() {
        const { locationType, liftAvailabily, region, editData, fullname, phone } = this.state
        return (
            <View style={styles.root}>
                <Header
                    title={editData ? 'Edit Address' : 'Add Address'}
                    left={
                        <IconButton
                            icon={backIcon}
                            containerStyle={{ marginHorizontal: 5 }}
                            onPress={() => this.props.navigation.goBack()}
                        />
                    }
                />
                <View style={styles.container}>
                    <View style={{ height: height * 0.4 }}>
                        <MapView
                            style={{ flex: 1 }}
                            region={this.state.region}
                            onPress={this._onRegionChangeComplete}
                        >
                            {
                                region && (
                                    <MapView.Marker
                                        coordinate={region}
                                    />
                                )
                            }


                        </MapView>
                        <View style={styles.searchBox}>
                            <GooglePlacesAutocomplete
                                placeholder='Type here'
                                minLength={3}
                                returnKeyType='search'
                                keyboardAppearance='light'
                                fetchDetails
                                onPress={this._locationGet}
                                query={{
                                    key: 'AIzaSyBTOV5P2Msbsm2r0s_GNAryTL4xhnx2W1o',
                                    language: 'en',
                                    types: 'geocode'
                                }}
                                styles={{
                                    textInputContainer: {
                                        backgroundColor: 'white',
                                        borderTopWidth: 0,
                                        borderBottomWidth: 0,
                                        height: 45,
                                        paddingHorizontal: 10
                                    },
                                    textInput: {
                                        height: 45,
                                        color: '#5d5d5d',
                                        fontSize: 14,
                                    },
                                    predefinedPlacesDescription: {
                                        color: '#1faadb'
                                    },
                                    listView: {
                                        marginTop: 10,
                                        borderRadius: 5,
                                        borderColor: '#C4C4C4',
                                        borderWidth: 0
                                    },
                                    poweredContainer: {
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                        backgroundColor: 'white'
                                    },
                                    separator: {
                                        backgroundColor: 'grey'
                                    }
                                }}
                                nearbyPlacesAPI='GooglePlacesSearch'
                                filterReverseGeocodingByTypes={['locality', 'postal_code', 'country', 'administrative_area_level_1', 'administrative_area_level_2', 'administrative_area_level_3']}
                                debounce={200}
                            />
                        </View>
                    </View>

                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                    >
                        <View>

                            <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                                <Text style={styles.widgetTitle}>Add new location</Text>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={styles.textFieldTitle}>Floor info</Text>
                                    <TextInput
                                        style={styles.textFied}
                                        value={this.state.floorInfo}
                                        keyboardType='number-pad'
                                        onChangeText={(text) => this.setState({ floorInfo: text })}
                                    />
                                </View>

                                <View style={{ marginTop: 20 }}>
                                    <Text style={styles.textFieldTitle}>Address</Text>
                                    <TextInput
                                        style={styles.textFied}
                                        value={this.state.address}
                                        onChangeText={(text) => this.setState({ address: text })}
                                    />
                                </View>

                                <View style={{ marginTop: 20 }}>
                                    <Text style={styles.textFieldTitle}>Full name</Text>
                                    <TextInput
                                        style={styles.textFied}
                                        value={fullname}
                                        onChangeText={(text) => this.setState({ fullname: text })}
                                    />
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={styles.textFieldTitle}>Mobile number</Text>
                                    <TextInput
                                        style={styles.textFied}
                                        value={phone}
                                        onChangeText={(text) => this.setState({ phone: text })}
                                    />
                                </View>

                                <View style={{ marginTop: 20 }}>
                                    <Text style={styles.textFieldTitle}>Landmark</Text>
                                    <TextInput
                                        style={styles.textFied}
                                        value={this.state.landmark}
                                        onChangeText={(text) => this.setState({ landmark: text })}
                                    />
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={styles.textFieldTitle}>Lift availabily</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 15 }}>
                                        <RadioButton
                                            title='Yes'
                                            isFill={liftAvailabily}
                                            onPress={() => this.setState({ liftAvailabily: true })}
                                            titleStyle={{ fontFamily: env.fontRegular, color: liftAvailabily ? '#0087F9' : '#313131' }}
                                        />
                                        <View style={{ width: 20 }} />
                                        <RadioButton
                                            title='No'
                                            isFill={!liftAvailabily}
                                            onPress={() => this.setState({ liftAvailabily: false })}
                                            titleStyle={{ fontFamily: env.fontRegular, color: !liftAvailabily ? '#0087F9' : '#313131' }}
                                        />
                                    </View>
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={styles.textFieldTitle}>Note About lift</Text>
                                    <TextInput
                                        style={styles.textFied}
                                        value={this.state.aboutLift}
                                        onChangeText={(text) => this.setState({ aboutLift: text })}
                                    />
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={styles.textFieldTitle}>Save location as</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 15 }}>
                                        <RadioButton
                                            title='Home'
                                            isFill={locationType === '1'}
                                            onPress={() => this.setState({ locationType: '1' })}
                                            titleStyle={{ fontFamily: env.fontRegular, color: locationType === 1 ? '#0087F9' : '#313131' }}
                                        />
                                        <View style={{ width: 20 }} />
                                        <RadioButton
                                            title='Office'
                                            isFill={locationType === '2'}
                                            onPress={() => this.setState({ locationType: '2' })}
                                            titleStyle={{ fontFamily: env.fontRegular, color: locationType === 2 ? '#0087F9' : '#313131' }}
                                        />
                                        <View style={{ width: 20 }} />
                                        <RadioButton
                                            title='Other'
                                            isFill={locationType === '3'}
                                            onPress={() => this.setState({ locationType: '3' })}
                                            titleStyle={{ fontFamily: env.fontRegular, color: locationType === 3 ? '#0087F9' : '#313131' }}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={{ width: '70%', alignSelf: 'center', marginVertical: 30 }}>
                                <Button
                                    title='Save & submit'
                                    onPress={this._addAddress}
                                />
                            </View>

                        </View>
                    </ScrollView>
                </View>
                {/* Hidden components */}
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
    }
}

export default connect(mapStateToProps, {
    addAddress,
    editAddress,
    rootLoader
})(AddAddress)

const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    container: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        overflow: 'hidden'
    },
    searchBox: {
        position: 'absolute',
        marginTop: Platform.OS === 'ios' ? 40 : 20,
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: '90%',
        alignSelf: 'center',
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: '#ccc',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10
    },
    textFieldTitle: {
        fontFamily: env.fontLight,
        fontSize: 15,
        color: '#313131',
        marginBottom: -5
    },
    textFied: {
        borderBottomWidth: 1,
        borderBottomColor: '#B4B4B4',
        height: 45,
        fontFamily: env.fontMedium
    },
    widgetTitle: {
        fontFamily: env.fontPoppinsBold,
        fontSize: 16,
        color: '#474747'
    },
})
