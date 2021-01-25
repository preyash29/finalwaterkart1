import Api from '../utils/Api'

export function getSuppliers () {
  return async (dispatch, getState) => {
    try {
      const { supplierList } = getState().user
      if (supplierList) {
        return { status: true, data: supplierList }
      }
      const res = await Api.POST('get_suppliers')
      if (!res.error && res.flag) {
        dispatch({ type: 'SUPPLIER_LIST', payload: res.data })
        return { status: true, data: res.data }
      }
      return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
    } catch (error) {
      console.log('getVendors', error)
      return { status: false, message: 'Oops!  Smpmething is wrong' }
    }
  }
}

export function vendorHome (params) {
  return async (dispatch) => {
    try {
      const res = await Api.GET('vendor_home', params)
      if (!res.error && res.flag) {
        dispatch({ type: 'VENDORS_HOME_DATA', payload: res.data })
        return { status: true, data: res.data }
      }
      return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
    } catch (error) {
      console.log('vendorHome', error)
      return { status: false, message: 'Oops!  Smpmething is wrong' }
    }
  }
}

export function acceptOrder (params) {
  return async (dispatch) => {
    try {
      const res = await Api.POST('vendor_accept_customer_order', params)
      if (!res.error && res.flag) {
        dispatch(vendorHome())
        return { status: true, data: res.data }
      }
      return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
    } catch (error) {
      console.log('vendor_accept_customer_order', error)
      return { status: false, message: 'Oops!  Smpmething is wrong' }
    }
  }
}

export function rejectOrder (params) {
  return async (dispatch) => {
    try {
      const res = await Api.POST('vendor_reject_customer_order', params)
      if (!res.error && res.flag) {
        dispatch(vendorHome())
        return { status: true, data: res.data }
      }
      return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
    } catch (error) {
      console.log('vendor_reject_customer_order', error)
      return { status: false, message: 'Oops!  Smpmething is wrong' }
    }
  }
}

export async function getDeliverymans (params) {
  try {
    const res = await Api.POST('get_deliverymans', params)
    if (!res.error && res.flag) {
      return { status: true, data: res.data }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log('get_deliverymans', error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}

export async function vendormyDeliverymans () {
  try {
    const res = await Api.GET('vendor_my_deliverymans')
    if (!res.error && res.flag) {
      return { status: true, data: res.data }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log('vendor_my_deliverymans', error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}

export async function assignToDistributorList () {
  try {
    const res = await Api.GET('vendor_my_distributors')
    if (!res.error && res.flag) {
      return { status: true, data: res.data }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log('vendor_my_distributors', error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}

export function assignToDistributor (params) {
  return async (dispatch) => {
    try {
      const res = await Api.POST('vendor_assign_customer_order_to_distributor', params)
      if (!res.error && res.flag) {
        dispatch(vendorHome())
        return { status: true, data: res.data }
      }
      return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
    } catch (error) {
      console.log('vendor_assign_customer_order_to_distributor', error)
      return { status: false, message: 'Oops!  Smpmething is wrong' }
    }
  }
}

export function vendorAssignCustomerDevlieryman (params) {
  return async (dispatch) => {
    try {
      const res = await Api.POST('vendor_assign_customer_order_to_devlieryman', params)
      if (!res.error && res.flag) {
        dispatch(vendorHome())
        return { status: true, data: res.data }
      }
      return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
    } catch (error) {
      console.log('vendor_assign_customer_order_to_devlieryman', error)
      return { status: false, message: 'Oops!  Smpmething is wrong' }
    }
  }
}
export async function submitVendorOrder (params) {
  try {
    const res = await Api.POST('submit_vendor_order', params)
    if (!res.error && res.flag) {
      return { status: true, data: res.data }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log('submit_vendor_order', error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}

export async function getVendorCustomerOrders (params) {
  try {
    const res = await Api.GET('get_vendor_customer_orders', params)
    if (!res.error && res.flag) {
      return { status: true, data: res.data }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log('get_vendor_orders', error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}

export function getVendor (params) {
  return async (dispatch) => {
    try {
      const res = await Api.GET('vendor_home', params)
      if (!res.error && res.flag) {
        dispatch({ type: 'VENDORS_HOME_DATA', payload: res.data })
        return { status: true, data: res.data }
      }
      return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
    } catch (error) {
      console.log('vendorHome', error)
      return { status: false, message: 'Oops!  Smpmething is wrong' }
    }
  }
}
