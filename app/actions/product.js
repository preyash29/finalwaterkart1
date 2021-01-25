import Api from '../utils/Api'

export async function getProductDetails (id) {
  try {
    const res = await Api.GET('get_product_details/' + id)
    if (!res.error && res.flag) {
      return { status: true, data: res.data }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log('getProductDetails/' + id, error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}

export async function getProduct (params) {
  try {
    const res = await Api.POST('get_products', params)
    if (!res.error && res.flag) {
      return { status: true, data: res.data }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log('getProduct', error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}

export async function getVendorProducts (params) {
  try {
    const res = await Api.POST('get_vendor_products', params)
    if (!res.error && res.flag) {
      return { status: true, data: res.data }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log('get_vendor_products', error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}

export async function submitOrder (params) {
  try {
    const res = await Api.POST('submit_customer_order', params)
    if (!res.error && res.flag) {
      return { status: true, data: res.data }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log('submitOrder', error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}

export async function checkOffercode (params) {
  try {
    const res = await Api.POST('check_offer_for_customer_order', params)
    if (!res.error && res.flag) {
      return { status: true, data: res.data }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log('checkOffercode', error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}

export async function checkSubOffercode (params) {
  try {
    const res = await Api.POST('check_offer_for_subscription', params)
    if (!res.error && res.flag) {
      return { status: true, data: res.data }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log('checkSubOffercode', error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}


export async function orderPayment (params) {
  try {
    const res = await Api.POST('customer_order_payment', params)
    if (!res.error && res.flag) {
      return { status: true, data: res.data, message: res.message }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log('orderPayment', error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}

export async function subscription_payment (params) {
  try {
    const res = await Api.POST('subscription_payment', params)
    if (!res.error && res.flag) {
      return { status: true, data: res.data, message: res.message }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log('subscription_payment', error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}


export async function vendorOrderPayment (params) {
  try {
    const res = await Api.POST('vendor_order_payment', params)
    if (!res.error && res.flag) {
      return { status: true, data: res.data, message: res.message }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log('orderPayment', error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}

export async function cancelCustomerOrder (id) {
  try {
    const res = await Api.POST('cancel_customer_order', { order_id: id })
    if (!res.error && res.flag) {
      return { status: true, message: res.message }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log('cancel_customer_order', error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}

export async function repeatCustomerOrder (id) {
  try {
    const res = await Api.POST('repeat_customer_order', { order_id: id })
    if (!res.error && res.flag) {
      return { status: true, message: res.message }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log('repeat_customer_order', error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}
