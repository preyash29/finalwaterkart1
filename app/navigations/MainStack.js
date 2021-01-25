import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import SplashView from '../screens/SplashView'
import AuthStack from './AuthStack'
import DashboardStack from './DashboardStack'

const Stack = createStackNavigator()

export default function MainStack () {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='splashscreen'
        screenOptions={{
          gestureEnabled: false
        }}
      >
        <Stack.Screen name='splashscreen' component={SplashView} options={{ headerShown: false }} />
        <Stack.Screen name='auth' component={AuthStack} options={{ headerShown: false }} />
        <Stack.Screen name='dashboard' component={DashboardStack} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
