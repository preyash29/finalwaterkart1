import React from 'react'
import { Text, TouchableOpacity, ImageBackground, Image, View, Dimensions } from 'react-native'
import { btnGradiun } from '../assets'
import colors from '../constants/colors'
import env from '../constants/env'
import { Shadow } from 'react-native-neomorph-shadows'

const { width } = Dimensions.get('screen')

function Button ({ title, textStyle, containerStyle, ...others }) {
  return (
    <TouchableOpacity
      {...others}
    >
      <ImageBackground
        source={btnGradiun}
        style={[{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
          height: 50
        }, containerStyle]}
        imageStyle={[{ borderRadius: 30 }, containerStyle]}
      >
        <Text style={[{ fontSize: 15, color: colors.white, fontFamily: env.fontPoppinsMedium, marginTop: 3 }, textStyle]}>{title}</Text>
      </ImageBackground>

    </TouchableOpacity>
  )
}

function SimpleButton ({ title, icon, customWidth, customHeight, containStyle, titleStyle, ...others }) {
  return (
    <Shadow
      style={{
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowColor: colors.gray,
        shadowRadius: 10,
        borderRadius: 30,
        backgroundColor: colors.white,
        width: customWidth || width * 0.6,
        height: customHeight || 50
      }}
    >
      <TouchableOpacity
        {...others}
        style={[{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
          backgroundColor: colors.white,
          borderRadius: 30,
          flexDirection: 'row'
        }, containStyle]}
      >
        {icon}
        <Text style={[{ fontSize: 15, color: '#464646', fontFamily: env.fontPoppinsMedium, marginTop: 3 }, titleStyle]}>{title}</Text>
      </TouchableOpacity>
    </Shadow>

  )
}

function IconButton ({ icon, iconStyle, containerStyle, ...others }) {
  return (
    <TouchableOpacity
      style={[{ padding: 10 }, containerStyle]}
      {...others}
    >
      <Image
        source={icon}
        style={[{
          height: 20,
          width: 20,
          resizeMode: 'contain'
        }, iconStyle]}
      />
    </TouchableOpacity>
  )
}

function RadioButton ({ size, isFill, title, containerStyle, titleStyle, ...others }) {
  return (
    <TouchableOpacity
      style={{ flexDirection: 'row', alignItems: 'center' }}
      activeOpacity={0.8}
      {...others}
    >
      <View
        style={[{
          borderWidth: 2,
          borderColor: colors.blueLight,
          borderRadius: size ? size / 2 : 15 / 2,
          height: size | 15,
          width: size | 15
        }, isFill ? { backgroundColor: colors.blueLight } : {}, containerStyle]}
      />
      {
        title ? (
          <Text style={[{ fontFamily: env.fontPoppinsRegular, color: colors.black, marginLeft: 10, fontSize: 14 }, titleStyle]}>{title}</Text>
        ) : null
      }
    </TouchableOpacity>
  )
}

export {
  Button,
  IconButton,
  RadioButton,
  SimpleButton
}
