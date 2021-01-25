import Api from '../utils/Api'

export function addAddress(params) {
  return async (dispatch) => {
    const res = await Api.POST('add_address', params)
    if (!res.error && res.flag) {
      dispatch(getAddressList())
      return { status: true }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  }
}

export function editAddress(id, params) {
  return async (dispatch) => {
    const res = await Api.POST('update_address/' + id, params)
    if (!res.error && res.flag) {
      dispatch(getAddressList())
      return { status: true }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  }
}

export function getAddressList(params) {
  return async (dispatch) => {
    const res = await Api.GET('get_address_list', params)
    if (!res.error && res.flag) {
      dispatch({ type: 'USER_ADDRESS_LIST', payload: res.data })
      return { status: true, data: res.data }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  }
}

export function deleteAddress(id) {
  return async (dispatch) => {
    const res = await Api.POST('delete_address/' + id)
    if (!res.error && res.flag) {
      dispatch(getAddressList())
      return { status: true }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  }
}

export function getCustomerHome(params) {
  return async (dispatch) => {
    try {
      const res = await Api.POST('customer_home', params)
      if (!res.error && res.flag) {
        return { status: true, data: res.data }
      }
      return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
    } catch (error) {
      return { status: false, message: 'Oops!  Smpmething is wrong' }
    }
  }
}

export async function getMySub() {
  try {
    const res = await Api.GET('get_subscription_list')
    if (!res.error && res.flag) {
      return { status: true, data: res.data }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log(error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}

export async function getOffers() {
  try {
    const res = await Api.GET('get_offers')
    if (!res.error && res.flag) {
      return { status: true, data: res.data }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log(error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}

export function getCustomerOrders(params) {
  return async (dispatch) => {
    try {
      const res = await Api.GET('get_customer_orders')
      if (!res.error && res.flag) {
        dispatch({ type: 'ORDER_HISTORY_DATA', canceled: res.data?.cancel_orders, orders: res.data?.orders })
        return { status: true, data: res.data }
      }
      return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
    } catch (error) {
      return { status: false, message: 'Oops!  Smpmething is wrong' }
    }
  }
}

export function addReturnCan(params) {
  return async (dispatch) => {
    try {
      const res = await Api.POST('add_return_can', params)
      if (!res.error && res.flag) {
        return { status: true, message: res.message }
      }
      return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
    } catch (error) {
      return { status: false, message: 'Oops!  Smpmething is wrong' }
    }
  }
}

export async function communityBookingSetting() {
  try {
    const res = await Api.GET('get_community_booking_setting')
    if (!res.error && res.flag) {
      return { status: true, data: res.data }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}

export function addCommunityBooking(params) {
  return async (dispatch) => {
    try {
      const res = await Api.POST('add_community_booking', params)
      if (!res.error && res.flag) {
        return { status: true, message: res.message }
      }
      return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
    } catch (error) {
      return { status: false, message: 'Oops!  Smpmething is wrong' }
    }
  }
}

export async function addProductBooking(params) {
  try {
    const res = await Api.POST('add_bulk_booking', params)
    if (!res.error && res.flag) {
      return { status: true, message: res.message }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}

export async function corporateBookingSetting() {
  try {
    const res = await Api.GET('get_corporate_booking_setting')
    if (!res.error && res.flag) {
      return { status: true, data: res.data }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}

export async function bulkBookingSetting() {
  try {
    const res = await Api.GET('get_bulk_booking_setting')
    if (!res.error && res.flag) {
      return { status: true, data: res.data }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}

export function addCorporateBooking(params) {
  return async (dispatch) => {
    try {
      const res = await Api.POST('add_corporate_booking', params)
      if (!res.error && res.flag) {
        return { status: true, message: res.message }
      }
      return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
    } catch (error) {
      return { status: false, message: 'Oops!  Smpmething is wrong' }
    }
  }
}

export function getWalletTransactions(params) {
  return async (dispatch) => {
    try {
      const res = await Api.POST('get_wallet_transactions', params)
      if (!res.error && res.flag) {
        dispatch({ type: 'WALLET_BALANCE', payload: res.data.wallet })
        return { status: true, data: res.data }
      }
      return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
    } catch (error) {
      return { status: false, message: 'Oops!  Smpmething is wrong' }
    }
  }
}

export function addService(params) {
  return async (dispatch) => {
    try {
      const res = await Api.POST('submit_service_request', params)
      if (!res.error && res.flag) {
        return { status: true, message: res.message }
      }
      return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
    } catch (error) {
      return { status: false, message: 'Oops!  Smpmething is wrong' }
    }
  }
}

export async function getBulkBooking() {
  try {
    const res = await Api.GET('get_bulk_booking_list')
    if (!res.error && res.flag) {
      return { status: true, data: res.data }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log(error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}

export async function customerAannounceVacation(params) {
  try {
    const res = await Api.POST('customer_add_vacation', params)
    if (!res.error && res.flag) {
      return { status: true, message: res.message }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}


export function getCustomerServices() {
  return async (dispatch) => {
    try {
      const res = await Api.GET('get_customer_service_request_list')
      if (!res.error && res.flag) {
        dispatch({ type: 'CUSTOMER_SERVICES_LIST', request: res.data?.request_list, closed: res.data?.close_request_list })
        return { status: true, data: res.data }
      }
      return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
    } catch (error) {
      return { status: false, message: 'Oops!  Smpmething is wrong' }
    }
  }

}

export async function add_subscription(params) {
  try {
    const res = await Api.POST('add_subscription', params)
    if (!res.error && res.flag) {
      return { status: true, data: res.data }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}


export async function postpond_subscription_order_date(params) {
  try {
    const res = await Api.POST('postpond_subscription_order_date', params)
    if (!res.error && res.flag) {
      return { status: true, data: res.data }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}


export async function cancel_subscription(params) {
  try {
    const res = await Api.POST('cancel_subscription', params)
    if (!res.error && res.flag) {
      return { status: true, data: res.data }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}