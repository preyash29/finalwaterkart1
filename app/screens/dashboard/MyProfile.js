import React from 'react'
import { Image, ScrollView, StyleSheet, View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { connect } from 'react-redux'
import { getCustomerProfile, rootLoader, updateProfile } from '../../actions'
import { callIcon, emailIcon, referalcodeIcon, usernameIcon } from '../../assets'
import { Button } from '../../components/Button'
import AlertDialog from '../../components/Dialog/AlertDialog'
import Header from '../../components/Header'
import InputField from '../../components/InputField'
import colors from '../../constants/colors'

class MyProfile extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      mobileNumber: '',
      altMobileNumber: '',
      email: '',
      referralCode: ''

    }
  }

  componentDidMount() {
    this.props.rootLoader(true)
    this.initData()
  }

  initData = async () => {
    let res = await getCustomerProfile()
    this.props.rootLoader(false)
    if (res.status) {
      const user = res.data
      this.setState({
        firstName: user?.first_name || '',
        lastName: user?.last_name || '',
        mobileNumber: user?.mobile || '',
        altMobileNumber: user?.mobile2 || '',
        email: user?.email || '',
        referralCode: user?.from_referral_id || ''
      })
    }
  }


  _submit = async () => {
    const { firstName, lastName, mobileNumber, altMobileNumber, email, referralCode } = this.state
    if (!firstName) return this.showAlert('Please enter first name')
    else if (!lastName) return this.showAlert('Please enter last name')
    else if (!mobileNumber) return this.showAlert('Please enter mobile number')
    else if (isNaN(mobileNumber)) return this.showAlert('mobile number is not valid')
    else if (mobileNumber.length < 10) return this.showAlert('Please valid mobile number')
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
      latitude: this.props.locationCoords?.latitude || '',
      longitude: this.props.locationCoords?.longitude || '',
      referral_id: referralCode
    }
    this.props.rootLoader(true)
    let res = await updateProfile(requestParams)
    this.props.rootLoader(false)
    if (res.status) {
      showMessage({
        message: 'Update Success.',
        description: 'User profile update successfull.',
        type: 'success',
        icon: 'success',
        floating: true,
        autoHide: true
      })
      return this.initData()
    }
    this.showAlert(res.message)
  }

  showAlert = (message) => {
    this.setState({ alert: true, alertMessage: message })
  }


  render() {
    const { firstName, lastName, mobileNumber, altMobileNumber, email, referralCode } = this.state
    return (
      <View style={styles.root}>
        <Header
          title='My Profile'

        />
        <View style={styles.container}>

          <ScrollView
            contentContainerStyle={{ flexGrow: 1, padding: 20 }}
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
              editable={false}
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


            <View style={{ marginVertical: 50, width: '70%', alignSelf: 'center' }}>
              <Button
                title='Edit Profile'
                onPress={this._submit}
              />
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
    locationCoords: user.locationCoords
  }
}

export default connect(mapStateToProps, {
  rootLoader
})(MyProfile)

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
  inputIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: 10
  },
})
