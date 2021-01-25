import React from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    StatusBar,
    SafeAreaView,
    Platform,
    Dimensions,
    Image,
    ToastAndroid
} from 'react-native'
import { connect } from 'react-redux'
import colors from '../../constants/colors'
import env from '../../constants/env'
import { callIcon, backIcon, usernameIcon, emailIcon, locationIcon } from '../../assets'
import { Button, IconButton } from '../../components/Button'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import Header from '../../components/Header'
import InputField from '../../components/InputField'
import AlertDialog from '../../components/Dialog/AlertDialog'
import { addVendor, rootLoader } from '../../actions'
import DocumentPicker from 'react-native-document-picker';

const { width } = Dimensions.get('screen')

class AddVendor extends React.Component {
    constructor() {
        super()
        this.state = {
            firstName: '',
            lastName: '',
            mobileNumber: '',
            altMobileNumber: '',
            email: '',
            address: '',
            imageFile: null
        }
    }

    componentDidMount() {
        if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor = colors.blueLight
            StatusBar.setBarStyle = 'light-content'
        }
    }

    showAlert = (message) => {
        this.setState({ alert: true, alertMessage: message })
    }

    _submit = async () => {
        try {
            const { firstName, lastName, mobileNumber, altMobileNumber, email, address, imageFile } = this.state
            if (!firstName) return this.showAlert('Please enter first name')
            else if (!lastName) return this.showAlert('Please enter last name')
            else if (!mobileNumber) return this.showAlert('Please enter mobile number')
            else if (mobileNumber.length > 10) return this.showAlert('Please valid mobile number')
            else if (!address) return this.showAlert('Please enter address')
            else if (!imageFile) return this.showAlert('Please ID Proof')
            const requestParams = {
                first_name: firstName,
                last_name: lastName,
                email,
                mobile: mobileNumber,
                mobile2: altMobileNumber,
                address: address,
                id_proof: imageFile
            }
            this.props.rootLoader(true)
            let res = await this.props.addVendor(requestParams)
            this.props.rootLoader(false)
            if (res.status) {
                return this.props.navigation.navigate('home')
            }
            this.showAlert(res.message)
        } catch (error) {
            console.log(error)
            this.props.rootLoader(false)
        }
    }

    _picker = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
            });
            const kilobytes = 1024
            const size = res.size / kilobytes
            if (size > 600) {
                return this.showAlert('Maximum file size limit is 600KB.')
            }
            this.setState({
                imageFile: {
                    uri: res.uri,
                    type: res.type,
                    name: res.name,
                    filename: res.name
                }
            })
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                console.log(err)
            }
        }
        // ImagePicker.showImagePicker({
        //     noData: true,
        //     quality: 0.8
        // }, (image) => {
        //     if (image.didCancel) {
        //         console.log('User cancelled image picker');
        //     } else if (image.error) {
        //         ToastAndroid.show(JSON.stringify(image), ToastAndroid.LONG)
        //         console.log('ImagePicker Error: ', image.error);
        //     } else if (image.customButton) {
        //         console.log('User tapped custom button: ', image.customButton);
        //     } else {
        //         const time = new Date().getTime();
        //         let filename = 'image' + time + '.png';
        //         if (Platform.OS === 'ios' && image.filename) filename = image.filename;
        //         this.setState({
        //             imageFile: {
        //                 uri: image.uri,
        //                 type: image.type,
        //                 name: filename,
        //                 filename
        //             }
        //         })
        //     }
        // })
    }

    render() {
        const { address, firstName, lastName, mobileNumber, altMobileNumber, email, imageFile } = this.state
        return (
            <View style={styles.root}>
                <StatusBar backgroundColor={colors.blueLight} barStyle='light-content' />
                <Header
                    title='Add Vendor'
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
                        contentContainerStyle={{ padding: 30 }}

                    >
                        <InputField
                            value={firstName}
                            onChangeText={(text) => this.setState({ firstName: text })}
                            placeholder='Enter your First name'
                            left={(<Image source={usernameIcon} style={styles.inputIcon} />)}
                        />
                        <View style={{ height: 10 }} />
                        <InputField
                            value={lastName}
                            onChangeText={(text) => this.setState({ lastName: text })}
                            placeholder='Enter your Last name'
                            left={(<Image source={usernameIcon} style={styles.inputIcon} />)}
                        />
                        <View style={{ height: 10 }} />
                        <InputField
                            value={mobileNumber}
                            onChangeText={(text) => this.setState({ mobileNumber: text })}
                            placeholder='Enter your mobile number'
                            left={(<Image source={callIcon} style={styles.inputIcon} />)}
                        />
                        <View style={{ height: 10 }} />
                        <InputField
                            value={altMobileNumber}
                            onChangeText={(text) => this.setState({ altMobileNumber: text })}
                            placeholder='Alternate mobile number (optional)'
                            left={(<Image source={callIcon} style={styles.inputIcon} />)}
                        />
                        <View style={{ height: 10 }} />
                        <InputField
                            value={email}
                            onChangeText={(text) => this.setState({ email: text })}
                            placeholder='Email address (optional)'
                            left={(<Image source={emailIcon} style={styles.inputIcon} />)}
                        />
                        <View style={{ height: 10 }} />
                        <InputField
                            value={address}
                            onChangeText={(text) => this.setState({ address: text })}
                            placeholder='Address'
                            left={(<Image source={locationIcon} style={styles.inputIcon} />)}
                        />
                        <View style={{ height: 20 }} />
                        <TouchableOpacity
                            onPress={this._picker}
                        >
                            <Text style={styles.linkText}>Select Id Proof</Text>
                        </TouchableOpacity>
                        {
                            imageFile && (
                                <Image
                                    source={imageFile}
                                    style={{ height: width * 0.4, marginTop: 10 }}
                                />
                            )
                        }

                        <View style={{ marginTop: 40 }}>
                            <Button
                                title='Request to Add'
                                onPress={this._submit}
                            />
                        </View>
                    </KeyboardAwareScrollView>
                </View>
                <SafeAreaView />
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

export default connect(null, {
    rootLoader,
    addVendor
})(AddVendor)

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.white
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        overflow: 'hidden'
    },
    inputIcon: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
        marginRight: 10
    },
    linkText: {
        fontSize: 15,
        fontFamily: env.fontPoppinsMedium,
        color: colors.blueLight
    }
})
