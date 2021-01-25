import AsyncStorage from '@react-native-community/async-storage'
import { showMessage } from 'react-native-flash-message'
import Snackbar from 'react-native-snackbar'
import { rootLoader } from '.'
import env from '../constants/env'
import Api from '../utils/Api'

export function addToCard (params) {
  return async (dispatch) => {
    
    const res = await Api.POST('add_to_cart', params)
    if (!res.error && res.flag) {
      dispatch(updateCardItems())
      showMessage({
        message: res.message,
        floating: true,
        autoHide: true,
        type: "success"
      })
      return true
    }
    showMessage({
      message: res.message,
      floating: true,
      autoHide: true,
      type: "danger"
    })
    return false
  }
}

export function updateCardItems () {
  return async (dispatch) => {
    const res = await Api.GET('get_cart_list')
    if (!res.error && res.flag) {
      dispatch({ type: 'CARD_ITEMS', payload: res.data })
      return true
    }
    dispatch({ type: 'CARD_ITEMS', payload: [] })
    Snackbar.show({ text: res.message })
    return false
    // const data = await AsyncStorage.getItem('@cartItems')
    // if (data) {
    //   const cardItems = JSON.parse(data)
    //   dispatch({ type: 'CARD_ITEMS', payload: cardItems })
    //   return { status: true }
    // }
    // return { status: false }
  }
}

export function removeToCard (itemData) {
  return async (dispatch, getState) => {
    const request = {
      id: itemData.id
    }
    dispatch(rootLoader(true))
    const res = await Api.POST('delete_cart/' + itemData.id, request)
    await dispatch(updateCardItems())
    dispatch(rootLoader(false))
    // const { cardItems } = getState().cart
    // const newCardData = cardItems.filter(item => item.product.id !== itemData.product.id)
    // await AsyncStorage.setItem('@cartItems', JSON.stringify(newCardData))
    // Snackbar.show({ text: 'Product is removed in your cart', backgroundColor: '#4BB543' })
    // dispatch(updateCardItems())
  }
}

export function cartProductQTYUpdate (itemData, qty) {
  return async (dispatch, getState) => {
    const request = {
      id: itemData.id,
      product_id: itemData.product_id,
      quantity: qty,
      return_can: String(itemData.return_can || 0),
      number_of_can: itemData.number_of_can || '',
      supplier_id: itemData.supplier_id || ''
    }
    dispatch(rootLoader(true))
    const res = await Api.POST('update_cart/' + itemData.id, request)
    await dispatch(updateCardItems())
    dispatch(rootLoader(false))
    // const { cardItems } = getState().cart
    // const existIndex = cardItems.findIndex(item => item.product.id === itemData.product.id)
    // if (existIndex >= 0) {
    //   cardItems[existIndex].qty = qty
    //   dispatch({ type: 'CARD_ITEMS', payload: cardItems })
    // }
    // await AsyncStorage.setItem('@cartItems', JSON.stringify(cardItems))
    // dispatch(updateCardItems())
  }
}
