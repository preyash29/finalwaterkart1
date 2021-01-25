import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import colors from '../constants/colors'
import env from '../constants/env'
import { RadioButton } from './Button'

export default function AddressSection({ onSelect }) {
  const { addressList } = useSelector(({ user }) => user)

  const [active, setActive] = useState()

  const renderAddress = (item, index) => {
    const status = item.id === active

    let addressName = 'Other'

    if (item.address_type === '1') addressName = 'Home'
    else if (item.address_type === '2') addressName = 'Office'
    return (
      <View
        key={String(index)}
        style={{ borderBottomWidth: 1, borderBottomColor: '#D7D7D7', paddingVertical: 10 }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setActive(item.id)
            onSelect(item)
          }}
        >
          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: env.fontPoppinsMedium, color: colors.blueLight, fontSize: 16, marginBottom: 3 }}>{addressName}</Text>
            <RadioButton
              isFill={status}
              onPress={() => {
                setActive(item.id)
                onSelect(item)
              }}
            />
          </View>

          <Text style={{ fontFamily: env.fontPoppinsRegular, color: '#747474', fontSize: 14 }}>Name:  {item.name}</Text>
          <Text style={{ fontFamily: env.fontPoppinsRegular, color: '#747474', fontSize: 14 }}>Mobile number:  {item.mobile}</Text>
          <Text style={{ fontFamily: env.fontPoppinsRegular, color: '#747474', fontSize: 14, marginRight: 10 }}>{item.floor_info}, {item.address}</Text>

        </TouchableOpacity>
        {item.lift_available === 1 && (
          <Text style={{ fontFamily: env.fontPoppinsMedium, color: '#747474', fontSize: 14, marginTop: 10 }}>Lift available</Text>
        )}

      </View>
    )
  }

  return (
    <>
      {
        addressList && addressList.map(renderAddress)
      }
    </>
  )
}
