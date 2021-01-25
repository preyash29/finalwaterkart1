import { Platform } from "react-native";
import Api from '../utils/Api'
import AsyncStorage from '@react-native-community/async-storage'
import env from '../constants/env'

export const USER_LOGIN = 'USER_LOGIN'
export const USER_LOGOUT = 'USER_LOGOUT'

export function setLoginUser(data) {
  return (dispatch) => {
    dispatch({ type: USER_LOGIN, payload: data })
    Api.defaultHeader({
      Authorization: 'Bearer ' + data.accessToken
    })
  }
}

export function sendOTP(params) {
  return async () => {
    const res = await Api.POST('send_otp', params)
    if (!res.error && res.flag) {
      return { status: true }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  }
}

export function userLogin(params) {
  return async (dispatch, getState) => {
    const { notificationToken } = getState().user
    params = {
      ...params,
      device_token: notificationToken,
      device: Platform.OS === 'android' ? 1 : 2
    }
    const res = await Api.POST('login', params)
    if (!res.error && res.flag) {
      const userProfile = { ...res.data.user_data, accessToken: res.data.access_token }
      dispatch(setLoginUser(userProfile))
      AsyncStorage.setItem(env.authorization_key, JSON.stringify(userProfile))
      return { status: true }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  }
}

export function createAccount(params) {
  return async () => {
    const res = await Api.POST('customer_signup', params)
    if (!res.error && res.flag) {
      return { status: true }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  }
}

export function userLogout() {
  return async (dispatch) => {
    dispatch({ type: USER_LOGOUT })
    Api.POST('logout')
    await AsyncStorage.clear()
    return { status: true }
  }
}

export function addComplain(params) {
  return async () => {
    const res = await Api.POST('add_complain', params)
    if (!res.error && res.flag) {
      return { status: true, message: res.message }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  }
}

export async function getAboutUS(params) {
  const res = await Api.GET('get_about_us', params)
  if (!res.error && res.flag) {
    return { status: true, data: res.data }
  }
  return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
}

export async function addWalletBalance(params) {
  const res = await Api.POST('add_wallet_balance', params)
  if (!res.error && res.flag) {
    return { status: true, data: res.data }
  }
  return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
}


export async function getCustomerProfile() {
  try {
    const res = await Api.GET('get_customer_profile')
    if (!res.error && res.flag) {
      return { status: true, data: res.data }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log(error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}

export async function updateProfile(params) {
  try {
    const res = await Api.POST('update_customer_profile', params)
    if (!res.error && res.flag) {
      return { status: true }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log(error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}