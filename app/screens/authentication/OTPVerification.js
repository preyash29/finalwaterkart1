import { StackActions } from '@react-navigation/native'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import React from 'react'
import { Dimensions, Image, Keyboard, ScrollView, StatusBar, StyleSheet, View } from 'react-native'
import { Shadow } from 'react-native-neomorph-shadows'
import { connect } from 'react-redux'
import { rootLoader, userLogin } from '../../actions'
import { loginGradiun, logo } from '../../assets'
import { Button } from '../../components/Button'
import AlertDialog from '../../components/Dialog/AlertDialog'
import colors from '../../constants/colors'
import env from '../../constants/env'
const { width } = Dimensions.get('window')

class OTPVerification extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      mobileNumber: props.route.params?.mobile,
      otp: ''
    }
  }

  showAlert = (message) => {
    this.setState({ alert: true, alertMessage: message })
  }

  _codeFilled = (otp) => {
    this.setState({ otp })
  }

  _submit = async () => {
    const { otp, mobileNumber } = this.state
    Keyboard.dismiss()
    if (!otp) return this.showAlert('OTP code requried.')
    this.props.rootLoader(true)
    let res = await this.props.userLogin({
      mobile: mobileNumber,
      otp
    })
    this.props.rootLoader(false)
    if (res.status) {
      return this.props.navigation.dispatch(
        StackActions.replace('dashboard')
      )
    } else {
      this.showAlert(res.message);
    }
  }

  render() {
    return (
      <View style={styles.root}>
        <StatusBar backgroundColor={colors.white} barStyle='dark-content' />

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
                width: width - 60,
              }}
              useLayout
            >
              <View style={styles.container}>

                <OTPInputView
                  style={{ width: '100%', height: 50 }}
                  pinCount={6}
                  autoFocusOnLoad
                  codeInputFieldStyle={styles.underlineStyleBase}
                  codeInputHighlightStyle={styles.underlineStyleHighLighted}
                  onCodeFilled={this._codeFilled}
                />

                <View style={{ width: '80%', marginTop: 50 }}>
                  <Button
                    title='Submit'
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
        </ScrollView>

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


export default connect(null, {
  rootLoader,
  userLogin
})(OTPVerification)

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white
  },
  container: {
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
    paddingBottom: 100,
    alignItems: 'center'
  },
  applogo: {
    resizeMode: 'contain',
    height: 150,
    width: 150,
    alignSelf: 'center',
    marginTop: 20
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: colors.primary,
    fontFamily: env.fontMedium,
    fontSize: 16
  },
  underlineStyleHighLighted: {
    borderColor: '#03DAC6'
  }
})
