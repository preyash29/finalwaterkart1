import React from 'react'
import { View, Text, Image, StyleSheet, Dimensions, StatusBar, SafeAreaView } from 'react-native'
import { Button } from '../../components/Button'
import { callIcon, loginGradiun, logo, usernameIcon, emailIcon, referalcodeIcon } from '../../assets'
import colors from '../../constants/colors'
import { connect } from 'react-redux'
import env from '../../constants/env'
import InputField from '../../components/InputField'
import Checkbox from '../../components/Checkbox'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { Shadow } from 'react-native-neomorph-shadows'
import AlertDialog from '../../components/Dialog/AlertDialog'
import { createAccount, rootLoader } from '../../actions'

const { width } = Dimensions.get('window')
const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
class CreateAccount extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      type: props.route.params?.type,
      isChecked: false,
      firstName: '',
      lastName: '',
      mobileNumber: '',
      altMobileNumber: '',
      email: '',
      referralCode: ''

    }
  }

  showAlert = (message) => {
    this.setState({ alert: true, alertMessage: message })
  }

  _submit = async () => {
    const { isChecked, firstName, lastName, mobileNumber, altMobileNumber, email, referralCode } = this.state
    if (!firstName) return this.showAlert('Please enter first name')
    else if (!lastName) return this.showAlert('Please enter last name')
    else if (!mobileNumber) return this.showAlert('Please enter mobile number')
    else if (isNaN(mobileNumber)) return this.showAlert('mobile number is not valid')
    else if (mobileNumber.length < 10) return this.showAlert('Please valid mobile number')
    else if (!isChecked) return this.showAlert('Please accept terms & condition')
    if (email) {
      if (emailReg.test(email) === false) {
        return this.showAlert('Email is not correct')
      }
    }
    const requestParams = {
      first_name: firstName,
      last_name: lastName,
      email,
      mobile: mobileNumber,
      mobile2: altMobileNumber,
      latitude: this.props.locationCoords?.latitude,
      longitude: this.props.locationCoords?.longitude,
      referral_id: referralCode
    }
    this.props.rootLoader(true)
    let res = await this.props.createAccount(requestParams)
    this.props.rootLoader(false)
    if (res.status) {
      return this.props.navigation.navigate('otpVerification', { mobile: mobileNumber })
    }
    this.showAlert(res.message)
  }

  render() {
    const { isChecked, firstName, lastName, mobileNumber, altMobileNumber, email, referralCode } = this.state
    return (
      <View style={styles.root}>
        <StatusBar backgroundColor={colors.white} barStyle='dark-content' />
        <SafeAreaView />
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps='handled'
        >
          <Image
            source={logo}
            style={styles.applogo}
          />

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 30 }}>

            <Shadow
              style={{
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.2,
                shadowColor: colors.gray,
                shadowRadius: 10,
                backgroundColor: colors.white,
                width: width - 60,
              }}
              useLayout
            >
              <View style={styles.container}>
                <Text style={styles.boxTitle}>Create an account</Text>

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
                  keyboardType='phone-pad'
                  maxLength={10}
                  onChangeText={(text) => this.setState({ mobileNumber: text })}
                  placeholder='Enter your mobile number'
                  left={(<Image source={callIcon} style={styles.inputIcon} />)}
                />
                <View style={{ height: 10 }} />
                <InputField
                  value={altMobileNumber}
                  keyboardType='phone-pad'
                  maxLength={10}
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
                  value={referralCode}
                  onChangeText={(text) => this.setState({ referralCode: text })}
                  placeholder='Vendor referral code'
                  left={(<Image source={referalcodeIcon} style={styles.inputIcon} />)}
                />
                <View style={{ height: 30 }} />
                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>

                  <Checkbox
                    isChecked={isChecked}
                    onPress={() => this.setState({ isChecked: !isChecked })}
                  />

                  <Text style={styles.termText}>I accept terms & condition</Text>
                </View>



                <View style={{ width: '80%', marginTop: 50 }}>
                  <Button
                    title='Continue'
                    onPress={this._submit}
                  />
                </View>
              </View>

            </Shadow>




          </View>
          <Image
            source={loginGradiun}
            style={{
              width: '100%',
              height: 150,
              resizeMode: 'stretch'
            }}
          />
        </KeyboardAwareScrollView>

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

function mapStateToProps({ user }) {register
  return {
    locationCoords: user.locationCoords
  }
}

export default connect(mapStateToProps, {
  rootLoader,
  createAccount
})(CreateAccount)

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white
  },
  boxTitle: {
    fontSize: 16,
    marginBottom: 30,
    fontFamily: env.fontSemiBold,
    color: colors.black
  },
  container: {
    // minHeight: width - 60,
    // width: width - 60,
    // margin: 30,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.3,
    shadowRadius: 1.5,
    elevation: 3,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  applogo: {
    resizeMode: 'contain',
    height: 150,
    width: 150,
    alignSelf: 'center',
    marginTop: 20
  },
  inputIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: 10
  },
  termText: {
    color: colors.gray,
    fontFamily: env.fontRegular,
    fontSize: 14,
    marginLeft: 15
  }
})
