import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Modal from 'react-native-modal'
import { Circle } from 'react-native-progress'
import colors from '../../constants/colors'
import env from '../../constants/env'

export default function CustomDialog({ isVisible, children, ...other }) {
  return (
    <Modal
      isVisible={isVisible}
      animationIn='pulse'
      animationOut='pulse'
      {...other}
    >
      <View style={{ flex: 1, justifyContent: 'center' }}>
        {children}
      </View>

    </Modal>
  )
}

const styles = StyleSheet.create({
  loaderContainer: {
    padding: 30,
    borderRadius: 20,
    backgroundColor: colors.blue1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleTextStyle: {
    fontSize: 20,
    color: colors.white,
    marginLeft: 20,
    fontFamily: env.fontMedium
  }
})
