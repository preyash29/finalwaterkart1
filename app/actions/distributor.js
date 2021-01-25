import Api from '../utils/Api'

export function distributorMyvendors () {
  return async (dispatch) => {
    try {
      const res = await Api.POST('distributor_home')
      if (!res.error && res.flag) {
        dispatch({ type: 'HOME_DATA', payload: res.data })
        return { status: true, data: res.data }
      }
      return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
    } catch (error) {
      console.log('distributor_my_vendors', error)
      return { status: false, message: 'Oops!  Smpmething is wrong' }
    }
  }
}

export function addVendor (params) {
  return async (dispatch) => {
    try {
      const res = await Api.POSTFORMDATA('add_vendor_by_distributor', params)
      console.log(res)
      if (!res.error && res.flag) {
        dispatch(distributorMyvendors())
        return { status: true, data: res.data }
      }
      return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
    } catch (error) {
      console.log('add_vendor_by_distributor', error)
      return { status: false, message: 'Oops!  Smpmething is wrong' }
    }
  }
}

export function removeVendors (params) {
  return async (dispatch) => {
    try {
      const res = await Api.POST('distributor_remove_request_to_vendor', params)
      if (!res.error && res.flag) {
        dispatch(distributorMyvendors())
        return { status: true, data: res.data }
      }
      return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
    } catch (error) {
      console.log('distributor_remove_request_to_vendor', error)
      return { status: false, message: 'Oops!  Smpmething is wrong' }
    }
  }
}

export async function distributorPassbook () {
  try {
    const res = await Api.GET('get_distributor_vendor_orders')
    if (!res.error && res.flag) {
      return { status: true, data: res.data }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log('get_distributor_vendor_orders', error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}

export async function get_vendor_orders_by_vendor (id) {
  try {
    const res = await Api.GET('get_vendor_orders_by_vendor/' + id)
    if (!res.error && res.flag) {
      return { status: true, data: res.data }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log('get_vendor_orders_by_vendor', error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}

export async function send_vendor_order_verify_otp_to_vendor (params) {
  try {
    const res = await Api.POST('send_vendor_order_verify_otp_to_vendor', params)
    if (!res.error && res.flag) {
      return { status: true, message: res.message }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log('send_vendor_order_verify_otp_to_vendor', error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}

export async function verify_otp_vendor_order (params) {
  try {
    const res = await Api.POST('verify_otp_vendor_order', params)
    if (!res.error && res.flag) {
      return { status: true, message: res.message }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log('verify_otp_vendor_order', error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}
