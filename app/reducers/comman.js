const initialState = {
  homeData: null,
  orderHistory: null
}

export default function comman (state = initialState, arg) {
  switch (arg.type) {
    case 'HOME_DATA':
      return { ...state, homeData: arg.payload }
    case 'ORDER_HISTORY':
      return { ...state, orderHistory: arg.payload }

    case 'USER_LOGOUT':
      return initialState

    default:
      break
  }
  return state
}
