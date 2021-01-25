import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Modal from 'react-native-modal'
import env from '../../constants/env'

export default function WarnDialog ({ isVisible, message, leftText, rightText, leftAction, rightAction }) {
  return (
    <Modal
      isVisible={isVisible}
      animationIn='fadeIn'
      animationOut='fadeOut'
    >
      <View style={{ backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden' }}>

        <View style={{ paddingHorizontal: 20, paddingVertical: 50 }}>
          <Text style={styles.title}>{message}</Text>
        </View>

        <View style={{ flexDirection: 'row', height: 50 }}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: '#F1F1F1' }]}
            onPress={leftAction}
          >
            <Text style={styles.buttonText}>{leftText}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: '#0081FF' }]}
            onPress={rightAction}
          >
            <Text style={[styles.buttonText, { color: '#fff' }]}>{rightText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  title: {
    fontFamily: env.fontMedium,
    textAlign: 'center',
    fontSize: 18,
    color: '#141414'
  },
  buttonText: {
    fontFamily: env.fontRegular,
    textAlign: 'center',
    fontSize: 14,
    color: '#141414'
  },
  btnIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginRight: 10
  },
  btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10
  }
})
