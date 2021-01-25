import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'
import Modal from 'react-native-modal'
import { useSelector } from 'react-redux'
import colors from '../../constants/colors'
import env from '../../constants/env'
import { closeIcon } from '../../assets'
import { BoxInputField, DropDownInput } from '../InputField'

export default function FliterDialog ({ isVisible, onFliter, onReset, onClose }) {
  const [supplier, setSupplier] = React.useState()
  const [min, setMin] = React.useState()
  const [max, setMax] = React.useState()

  const supplierList = useSelector(({ user }) => user.supplierList)
  const supplierData = []
  if (supplierList) {
    supplierList.map(item => {
      supplierData.push({ label: item.name, value: item.id })
    })
  }

  const _fliter = () => {
    onFliter({
      supplier: supplier.value,
      min,
      max
    })
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

        <TouchableOpacity
          style={{ position: 'absolute', right: 15, top: 15 }}
          onPress={onClose}
        >
          <Image
            source={closeIcon}
            style={{ height: 15, width: 15, resizeMode: 'contain' }}
          />
        </TouchableOpacity>

        <View
          margin={20}
        >
          <Text style={styles.titleText}>Fliter</Text>
          <Text style={styles.descText}>Brand</Text>
          <DropDownInput
            placeholder='Brand'
            items={supplierData}
            onChangeItem={item => setSupplier(item)}
          />

          <Text style={styles.descText}>Fliter Price</Text>
          <View style={{ flexDirection: 'row' }}>
            <BoxInputField
              placeholder='Min price'
              onChangeText={(text) => setMin(text)}
              value={min}
            />
            <View style={{ width: 15 }} />
            <BoxInputField
              placeholder='Max price'
              onChangeText={(text) => setMax(text)}
              value={max}
            />
          </View>

        </View>

        <View
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: '#F1F1F1' }]}
            onPress={onReset}
          >
            <Text style={[styles.buttonText, { color: colors.blueLight }]}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={_fliter}
          >
            <Text style={styles.buttonText}>Fliter</Text>
          </TouchableOpacity>
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
    color: colors.blueLight
  },
  descText: {
    fontFamily: env.fontSemiBold,
    fontSize: 14,
    color: colors.black,
    marginTop: 15,
    marginBottom: 10
  }
})
