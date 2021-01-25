import Api from '../utils/Api'

export async function getFAQs () {
  try {
    const res = await Api.GET('get_faqs')
    if (!res.error && res.flag) {
      return { status: true, data: res.data }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log(error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}

export async function getDonations () {
  try {
    const res = await Api.GET('get_donations')
    if (!res.error && res.flag) {
      return { status: true, data: res.data }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log(error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}

export async function getReason () {
  try {
    const res = await Api.GET('get_reason')
    if (!res.error && res.flag) {
      return { status: true, data: res.data }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log(error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}

export async function razorpayOrderVerified (params) {
  try {
    const res = await Api.POST('submit_razorpay_payout_response', params)
    if (!res.error && res.flag) {
      return { status: true, message: res.message }
    }
    return { status: false, message: res.message || 'Oops!  Smpmething is wrong' }
  } catch (error) {
    console.log(error)
    return { status: false, message: 'Oops!  Smpmething is wrong' }
  }
}
