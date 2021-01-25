import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'
import Modal from 'react-native-modal'
import colors from '../../constants/colors'
import env from '../../constants/env'
import { closeIcon } from '../../assets'
import { Button } from '../../components/Button'
import DateRangePicker from '../DateRangePicker'

export default function PassbookStatement ({ isVisible, onClose, onSubmit }) {
  const [dates, setDates] = React.useState({
    startDate: null,
    endDate: null
  })

  const _submit = () => {
    if (!dates.startDate || !dates.endDate) return
    onSubmit(dates)
  }

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
          <Text style={styles.titleText}>Statement date rang</Text>
          <TouchableOpacity
            onPress={onClose}
          >
            <Image
              source={closeIcon}
              style={{ height: 14, width: 14, resizeMode: 'contain', tintColor: colors.white }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: colors.white }}>
          <DateRangePicker
            onSuccess={(s, e) => setDates({ startDate: s, endDate: e })}
          />
          <View style={{ width: '75%', alignSelf: 'center', marginVertical: 25 }}>
            <Button
              title='Submit'
              containerStyle={{ height: 40 }}
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
    color: colors.black,
    marginTop: 15,
    marginBottom: 10
  }
})
