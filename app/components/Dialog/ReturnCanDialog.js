import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Modal from 'react-native-modal'
import colors from '../../constants/colors'
import env from '../../constants/env'

export default function ReturnCanDialog ({ isVisible, returnAction, onClose }) {
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
          margin={20}
        >
          <Text style={styles.titleText}>Return can</Text>
          <Text style={styles.descText}>You have can which is different company, return those can to the vendor you bought from</Text>
        </View>

        <TouchableOpacity
          style={styles.btn}
          onPress={returnAction}
        >
          <Text style={styles.buttonText}>Return</Text>
        </TouchableOpacity>

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
    paddingVertical: 20,
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
    color: colors.blueLight
  },
  descText: {
    fontFamily: env.fontSemiBold,
    textAlign: 'center',
    fontSize: 14,
    color: colors.black,
    marginTop: 15,
    marginBottom: 10
  }
})
