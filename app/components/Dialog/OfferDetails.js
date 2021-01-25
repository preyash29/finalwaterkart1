import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image, Dimensions } from 'react-native'
import Modal from 'react-native-modal'
import colors from '../../constants/colors'
import env from '../../constants/env'
import { closeIcon } from '../../assets'
import { WebView } from 'react-native-webview'

const { height } = Dimensions.get('screen')

export default function OfferDetails ({ isVisible, title, data, onClose }) {
  return (
    <Modal
      isVisible={isVisible}
      animationIn='pulse'
      animationOut='pulse'
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
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
          <Text style={styles.titleText}>{title}</Text>
          <TouchableOpacity
            onPress={onClose}
          >
            <Image
              source={closeIcon}
              style={{ height: 14, width: 14, resizeMode: 'contain', tintColor: colors.white }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: colors.white, height: height * 0.5 }}>
          <WebView
            originWhitelist={['*']}
            source={{ html: data }}
            scalesPageToFit={false}
          />
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
    color: colors.black,
    marginTop: 15,
    marginBottom: 10
  }
})
