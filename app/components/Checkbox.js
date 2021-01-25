import React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { checkedIcon } from '../assets'
import colors from '../constants/colors'

export default function Checkbox ({ isChecked, ...other }) {
  return (
    <TouchableOpacity
      style={{ borderWidth: 1.5, height: 16, width: 16, borderColor: colors.black, justifyContent: 'center', alignItems: 'center' }}
      {...other}
    >
      {
        isChecked && (
          <Image
            source={checkedIcon}
            resizeMode='contain'
            style={{ height: 15, width: 15, marginRight: -8, marginBottom: 4 }}
          />
        )
      }
    </TouchableOpacity>
  )
}
