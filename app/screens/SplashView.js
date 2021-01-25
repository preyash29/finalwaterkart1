import React, { useEffect } from 'react'
import SplashScreen from 'react-native-splash-screen'
import AsyncStorage from '@react-native-community/async-storage'
import env from '../constants/env'
import { StackActions } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { setLoginUser } from '../actions/user'
import locationService from '../utils/locationService'

function SplashView ({ navigation }) {
  const dispatch = useDispatch()

  useEffect(() => {
    _checkAuth()
  }, [])

  const _checkAuth = async () => {
    try {
      const value = await AsyncStorage.getItem(env.authorization_key)
      if (value !== null) {
        dispatch(setLoginUser(JSON.parse(value)))
        return _navigation('dashboard') // navigate to dashboard
      }
    } catch (e) {

    }
    _userlocation()
    return _navigation('auth') // navigate to authentication
  }

  const _userlocation = async () => {
    try {
      const res = await locationService()
      dispatch({ type: 'USER_CURRENT_LOCATION', payload: res })
    } catch (error) {

    }
  }

  const _navigation = (router, params) => {
    SplashScreen.hide()
    navigation.dispatch(
      StackActions.replace(router, params)
    )
  }

  return null
}

export default SplashView
