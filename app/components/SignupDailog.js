import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import Modal from 'react-native-modal'
import { appartmentIcon, houseIcon } from '../assets'
import env from '../constants/env'

export default function SignupDailog ({ isVisible, onClose, onAction }) {
  const _action = (action) => {
    onAction(action)
  }
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      animationIn='pulse'
      animationOut='fadeOut'
    >
      <View style={{ backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden' }}>

        <View style={{ paddingHorizontal: 20, paddingVertical: 50 }}>
          <Text style={styles.title}>Choose{'\n'} Appratment or Individual House</Text>
        </View>

        <View style={{ flexDirection: 'row', height: 50 }}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: '#F1F1F1' }]}
            onPress={() => _action('appratment')}
          >
            <Image source={appartmentIcon} style={styles.btnIcon} />
            <Text style={styles.buttonText}>Appratment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: '#0081FF' }]}
            onPress={() => _action('individual')}
          >
            <Image source={houseIcon} style={styles.btnIcon} />
            <Text style={[styles.buttonText, { color: '#fff' }]}>Individual House</Text>
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
