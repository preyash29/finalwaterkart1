import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { Image } from 'react-native'
import { basketIcon, homeDrawerIc, returnBottleIc } from '../assets'
import colors from '../constants/colors'
import env from '../constants/env'
import Home from '../screens/dashboard/Home'
import ProductCart from '../screens/dashboard/ProductCart'
import ReturnCan from '../screens/dashboard/ReturnCan'
const Tab = createBottomTabNavigator()

export default function BottonTabNavigation () {
  return (
    <Tab.Navigator
      initialRouteName='home'
      tabBarOptions={{
        activeTintColor: colors.blueLight,
        inactiveTintColor: '#575757',
        labelStyle: {
          fontFamily: env.font_regular,
          fontSize: 12
        },
        keyboardHidesTabBar: true,
        showLabel: false
      }}
    >
      <Tab.Screen
        name='hometab'
        component={Home}
        options={{
          tabBarIcon: ({ color }) => <TabbarIcon icon={homeDrawerIc} color={color} />
        }}
      />
      <Tab.Screen
        name='cart'
        component={ProductCart}
        options={{
          tabBarIcon: ({ color }) => <TabbarIcon icon={basketIcon} color={color} />
        }}
      />
      <Tab.Screen
        name='returncan'
        component={ReturnCan}
        options={{
          tabBarIcon: ({ color }) => <TabbarIcon icon={returnBottleIc} color={color} size={26} />
        }}
      />
    </Tab.Navigator>
  )
}

function TabbarIcon ({ icon, color, size }) {
  return (
    <Image
      source={icon}
      style={{ width: size || 20, height: size || 20, tintColor: color }}
      resizeMode='contain'
    />
  )
}
