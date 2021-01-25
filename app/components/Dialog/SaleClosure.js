import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'
import Modal from 'react-native-modal'
import colors from '../../constants/colors'
import env from '../../constants/env'
import { closeIcon } from '../../assets'
import { Button } from '../Button'
import OTPInputView from '@twotalltotems/react-native-otp-input'

export default function SaleClosure ({ isVisible, title, callBack, onClose }) {
  const [code, setCode] = React.useState()
  const [error, setError] = React.useState()

  const _submit = async () => {
    if (!code) return setError('Enter OTP code')
    const res = await callBack(code)
    if (!res.status) {
      return setError(res.message)
    } else {
      onClose()
    }
  }

  return (
    <Modal
      isVisible={isVisible}
      animationIn='pulse'
      animationOut='pulse'
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      avoidKeyboard
    >
      <View style={styles.container}>

        <View
          style={{
            backgroundColor: colors.blueLight,
            height: 50,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 20
          }}
        >
          <View style={{ width: 14 }} />
          <Text style={styles.titleText}>Sale Closure</Text>
          <TouchableOpacity
            onPress={onClose}
          >
            <Image
              source={closeIcon}
              style={{ height: 14, width: 14, resizeMode: 'contain', tintColor: colors.white }}
            />
          </TouchableOpacity>
        </View>

        <View margin={20}>

          <Text style={styles.descText}>{title}</Text>
          <OTPInputView
            style={{ width: '100%', height: 50 }}
            pinCount={6}
            autoFocusOnLoad={false}
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={(text) => setCode(text)}
          />
          <View style={{ height: 15 }}>
            {
              error ? (<Text style={styles.errorText}>{error}</Text>) : null
            }
          </View>

          <View margin={12} />
          <View style={{ marginVertical: 20, alignSelf: 'center' }}>

            <Button
              title='Submit'
              containerStyle={{ paddingHorizontal: 40 }}
              onPress={_submit}
            />

          </View>

        </View>

      </View>

    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 10,
    overflow: 'hidden'
  },
  btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: colors.blueLight
  },
  buttonText: {
    fontFamily: env.fontMedium,
    textAlign: 'center',
    fontSize: 14,
    color: '#fff'
  },
  titleText: {
    fontFamily: env.fontSemiBold,
    textAlign: 'center',
    fontSize: 15,
    color: colors.white
  },
  descText: {
    fontFamily: env.fontSemiBold,
    fontSize: 14,
    color: colors.lightBlack,
    marginTop: 15,
    marginBottom: 10
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
  },
  errorText: {
    fontFamily: env.fontSemiBold,
    fontSize: 12,
    color: '#ff0000',
    marginTop: 15,
    marginBottom: 10
  }
})
