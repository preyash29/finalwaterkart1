import Api from '../utils/Api'

export function getDeliverymanHome (params) {
  return async (dispatch) => {
    try {
      const res = await Api.POST('deliveryman_home', params)
      if (!res.error && res.flag) {
        dispatch({ type: 'HOME_DATA', payload: res.data })
        return { status: true, data: res.data }
      }
      return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
    } catch (error) {
      console.log('deliveryman_home', error)
      return { status: false, message: 'Oops!  Smpmething is wrong' }
    }
  }
}

export function getDeliverymanOrderHistory () {
  return async (dispatch) => {
    try {
      const res = await Api.GET('get_delivery_man_order_history')
      if (!res.error && res.flag) {
        dispatch({ type: 'ORDER_HISTORY', payload: res.data })
        return { status: true, data: res.data }
      }
      return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
    } catch (error) {
      console.log('get_delivery_man_order_history', error)
      return { status: false, message: 'Oops!  Smpmething is wrong' }
    }
  }
}

export async function send_customer_order_verify_otp_to_customer (params) {
  try {
    const res = await Api.POST('send_customer_order_verify_otp_to_customer', params)
    if (!res.error && res.flag) {
      return { status: true, message: res.message }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log('send_customer_order_verify_otp_to_customer', error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}
export function deliveryOrder (params) {
  return async (dispatch) => {
    try {
      const res = await Api.POST('verify_otp_customer_order', params)
      if (!res.error && res.flag) {
        dispatch(getDeliverymanHome())
        return { status: true, message: res.message }
      }
      return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
    } catch (error) {
      console.log('verify_otp_customer_order', error)
      return { status: false, message: 'Oops!  Smpmething is wrong' }
    }
  }
}

export function closedeliveryOrder (params) {
  return async (dispatch) => {
    try {
      const res = await Api.POST('submit_deliveryman_close_customer_order', params)
      if (!res.error && res.flag) {
        dispatch(getDeliverymanHome())
        return { status: true, message: res.message }
      }
      return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
    } catch (error) {
      console.log('submit_deliveryman_close_customer_order', error)
      return { status: false, message: 'Oops!  Smpmething is wrong' }
    }
  }
}
