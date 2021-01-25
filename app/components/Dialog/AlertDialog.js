import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Modal from 'react-native-modal'
import colors from '../../constants/colors'
import env from '../../constants/env'

export default function AlertDialog ({ isVisible, message, onAction, buttonText, ...other }) {
  return (
    <Modal
      isVisible={isVisible}
      animationIn='pulse'
      animationOut='pulse'
      {...other}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.popupContainerViewStyle}>
          <Text style={styles.descpTextStyle}>{message}</Text>
        </View>
        <TouchableOpacity
          onPress={onAction}
          style={styles.bubbleViewStyle}
        >
          <Text style={styles.bubbleTextStyle}>{(buttonText) || 'OK'}</Text>
        </TouchableOpacity>
      </View>

    </Modal>
  )
}

const styles = StyleSheet.create({

  popupContainerViewStyle: {
    padding: 30,
    borderRadius: 30,
    backgroundColor: colors.white,
    alignSelf: 'center'
  },

  descpTextStyle: {
    fontSize: 16,
    color: colors.black,
    fontFamily: env.fontRegular,
    marginBottom: 20
  },

  bubbleViewStyle: {
    minHeight: 60,
    minWidth: 60,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: colors.primary,
    marginTop: -30
  },
  bubbleTextStyle: {
    fontSize: 18,
    color: colors.white,
    fontFamily: env.fontSemiBold
  }
})
