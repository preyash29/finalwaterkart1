import React from 'react'
import { View, Text, Image, TextInput, StyleSheet, Dimensions, StatusBar, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native'
import SignupDailog from '../../components/SignupDailog'
import { Button } from '../../components/Button'
import { callIcon, loginGradiun, logo } from '../../assets'
import colors from '../../constants/colors'
import { connect } from 'react-redux'
import env from '../../constants/env'
import { Shadow } from 'react-native-neomorph-shadows'
import AlertDialog from '../../components/Dialog/AlertDialog'
import { sendOTP, rootLoader } from '../../actions'

const { width } = Dimensions.get('window')

class Login extends React.Component {

  constructor() {
    super()
    this.state = {
      isVisible: false,
      mobileNumber: ''
    }
  }

  showAlert = (message) => {
    this.setState({ alert: true, alertMessage: message })
  }

  _signupAction = (action) => {
    this.setState({ isVisible: false })
    this.props.navigation.navigate('createAccount', { type: action })
  }

  _submit = async () => {
    let { mobileNumber } = this.state
    if (!mobileNumber) return this.showAlert('Please enter mobile number')
    else if (isNaN(mobileNumber)) return this.showAlert('mobile number is not valid')
    else if (mobileNumber.length < 10) return this.showAlert('Please valid mobile number')
    this.props.rootLoader(true)
    let res = await this.props.sendOTP({ mobile: mobileNumber })
    this.props.rootLoader(false)
    if (res.status) {
      return this.props.navigation.navigate('otpVerification', { mobile: mobileNumber })
    } else {
      this.showAlert(res.message);
    }
  }

  render() {
    const { mobileNumber } = this.state

    return (
      <View style={styles.root}>
        <StatusBar backgroundColor={colors.white} barStyle='dark-content' />
        <SafeAreaView />

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps='handled'
          bounces={false}
          scrollEnabled={false}
        >
          <Image
            source={logo}
            style={styles.applogo}
          />

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 30 }}>


            <Shadow
              style={{
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.2,
                shadowColor: colors.gray,
                shadowRadius: 10,
                backgroundColor: colors.white,
                height: width - 60,
                width: width - 60,
              }}
              useLayout
            >
              <View style={styles.container}>
                <Text style={styles.boxTitle}>Sign in</Text>
                <View style={styles.inputBox}>
                  <Image source={callIcon} style={{ width: 16, height: 16, resizeMode: 'contain', marginRight: 10 }} />
                  <Text style={{ color: '#999999', fontSize: 15, fontFamily: env.fontMedium }}>+{this.props.countryCode}</Text>
                  <View style={{ backgroundColor: '#999999', width: 1, height: 20, marginHorizontal: 10 }} />
                  <TextInput
                    placeholder='Enter your mobile number'
                    style={{ color: 'black', flex: 1, fontFamily: env.fontMedium }}
                    placeholderTextColor='#999999'
                    keyboardType='phone-pad'
                    maxLength={10}
                    value={mobileNumber}
                    onChangeText={(text) => this.setState({ mobileNumber: text })}
                  />
                </View>
                <View style={{ width: '80%', marginVertical: 40 }}>
                  <Button
                    title='Login'
                    onPress={this._submit}
                  />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[styles.bottomText, { opacity: 0.6 }]}>Don't have an account?</Text>
                  <TouchableOpacity
                    style={{ marginLeft: 10 }}
                    onPress={() => this.props.navigation.navigate('createAccount')}
                  >
                    <Text style={styles.bottomText}>Sign Up Now</Text>
                  </TouchableOpacity>
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
        </ScrollView>

        {/* Hidden components */}
        <SignupDailog
          isVisible={this.state.isVisible}
          onClose={() => this.setState({ isVisible: false })}
          onAction={this._signupAction}
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
  return ({
    countryCode: user.countryCode
  })
}

export default connect(mapStateToProps, {
  sendOTP,
  rootLoader
})(Login)

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white
  },
  boxTitle: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: env.fontSemiBold,
    color: colors.black
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputBox: {
    borderBottomColor: '#EFEFEF',
    borderBottomWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10
  },
  applogo: {
    resizeMode: 'contain',
    height: 150,
    width: 150,
    alignSelf: 'center',
    marginTop: 20
  },
  bottomText: {
    fontSize: 12,
    fontFamily: env.fontMedium,
    color: colors.black
  }
})
