import React from 'react'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import Login from '../screens/authentication/Login'
import CreateAccount from '../screens/authentication/CreateAccount'
import OTPVerification from '../screens/authentication/OTPVerification'

const Stack = createStackNavigator()

export default function AuthStack () {
  return (
    <Stack.Navigator
      initialRouteName='login'
    >
      <Stack.Screen name='login' component={Login} options={{ headerShown: false }} />
      <Stack.Screen name='createAccount' component={CreateAccount} options={{ headerShown: false }} />
      <Stack.Screen name='otpVerification' component={OTPVerification} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
    </Stack.Navigator>
  )
}
