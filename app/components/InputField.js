import React from 'react'
import { View, TextInput, Platform, Image, Dimensions } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import colors from '../constants/colors'
import env from '../constants/env'
import { arrowdownIcon, arrowupIcon, searchIcon } from '../assets'
import { Shadow } from 'react-native-neomorph-shadows'

const { width } = Dimensions.get('screen')

export default function InputField ({ left, placeholder, ...other }) {
  return (
    <>
      <View
        style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}
      >
        {left}
        <TextInput
          style={[{ fontFamily: env.fontRegular, flex: 1 }, Platform.OS === 'ios' && { height: 45 }]}
          placeholder={placeholder}
          placeholderTextColor='#999999'
          {...other}
        />
      </View>
      <View style={{ backgroundColor: '#d7d7d7', width: '100%', height: 1, opacity: 0.5 }} />
    </>
  )
}

export function BoxInputField ({ placeholder, customStyle, ...other }) {
  return (
    <TextInput
      style={[{
        fontFamily: env.fontRegular,
        // flex: 1,
        borderWidth: 1,
        borderColor: 'rgba(27, 27, 36, 0.3)',
        paddingHorizontal: 15,
        height: 50,
        color: colors.black
      }, customStyle]}
      placeholder={placeholder}
      placeholderTextColor='rgba(27, 27, 36, 0.3)'
      {...other}
    />
  )
}

export function TextareaWithLimit ({ placeholder, customStyle, ...other }) {
  return (
    <TextInput
      style={[{
        fontFamily: env.fontMedium,
        flex: 1,
        borderWidth: 1,
        borderColor: 'rgba(27, 27, 36, 0.3)',
        paddingHorizontal: 15,
        height: 200,
        textAlignVertical: 'top'
      }, customStyle]}
      multiline
      placeholder={placeholder}
      placeholderTextColor='rgba(27, 27, 36, 0.3)'
      {...other}
    />
  )
}

export function DropDownInput ({ items, defaultValue, onChangeItem, placeholder, customStyle }) {
  return (
    <DropDownPicker
      items={items}
      containerStyle={{ height: 45 }}
      style={[{
        borderWidth: 0,
        borderBottomWidth: 1
      }, customStyle]}
      placeholder={placeholder}
      placeholderStyle={{
        color: 'rgba(27, 27, 36, 0.3)',
        fontFamily: env.fontMedium
      }}
      itemStyle={{
        justifyContent: 'flex-start'
      }}
      labelStyle={{
        color: colors.lightBlack,
        fontFamily: env.fontMedium
      }}
      defaultValue={defaultValue}
      onChangeItem={onChangeItem}
      customArrowDown={() => <Image source={arrowdownIcon} style={{ width: 16, height: 16, resizeMode: 'contain' }} />}
      customArrowUp={() => <Image source={arrowupIcon} style={{ width: 16, height: 16, resizeMode: 'contain' }} />}
    />
  )
}

export function SearchInputField ({ costomStyle, ...other }) {
  return (
    <Shadow
      style={[{
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowColor: colors.gray,
        shadowRadius: 10,
        backgroundColor: colors.white,
        width: width - 60,
        height: 40,
        borderRadius: 20,
        marginHorizontal: 20,
        justifyContent: 'center',
        marginVertical: 20,
        paddingHorizontal: 15,
        marginTop: 20,
        marginBottom: 30
      }, costomStyle]}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
          height: 40
        }}
      >
        <Image
          source={searchIcon}
          style={{ tintColor: '#707070', width: 18, height: 18, marginRight: 10 }}
          resizeMode='contain'
        />
        <TextInput
          placeholder='Search'
          placeholderTextColor='#858585'
          style={{ flex: 1 }}
          {...other}
        />
      </View>

    </Shadow>
  )
}
