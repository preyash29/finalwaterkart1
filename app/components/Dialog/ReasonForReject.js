import React, { useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'
import Modal from 'react-native-modal'
import colors from '../../constants/colors'
import env from '../../constants/env'
import { closeIcon } from '../../assets'
import { TextareaWithLimit, DropDownInput } from '../InputField'
import { Button } from '../Button'
import { getReason } from '../../actions/comman'

export default function ReasonForReject ({ isVisible, onSubmit, onClose }) {
  const [rease, setRease] = React.useState()
  const [desc, setDesc] = React.useState()
  const [reasonList, setReasonList] = React.useState([])

  useEffect(() => {
    initData()
  }, [])

  const initData = async () => {
    const res = await getReason()
    if (res.status) {
      const data = res.data.map(item => {
        return { label: item.reason, value: item.reason }
      })
      setReasonList(data)
    }
  }

  const _submit = () => {
    onSubmit({
      reason: rease?.value,
      reason_message: desc
    })
    onClose()
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
          <Text style={styles.titleText}>Reason</Text>
          <TouchableOpacity
            onPress={onClose}
          >
            <Image
              source={closeIcon}
              style={{ height: 14, width: 14, resizeMode: 'contain', tintColor: colors.white }}
            />
          </TouchableOpacity>
        </View>

        <View
          margin={20}
        >

          <Text style={styles.descText}>Select reason</Text>
          <DropDownInput
            placeholder='select reason'
            items={reasonList}
            onChangeItem={item => setRease(item)}
            customStyle={{ borderWidth: 1 }}
          />

          <Text style={styles.descText}>Please mention reason</Text>
          <View style={{ height: 200 }}>
            <TextareaWithLimit
              customStyle={{ borderRadius: 10 }}
              value={desc}
              onChangeText={(text) => setDesc(text)}
            />
          </View>

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
    color: colors.black,
    marginTop: 15,
    marginBottom: 10
  }
})
