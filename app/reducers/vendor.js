const initialState = {
  vendorsData: null,
  homeData: null
}

export default function vendor (state = initialState, arg) {
  switch (arg.type) {
    case 'VENDORS_LIST':
      return { ...state, vendorsData: arg.payload }
    case 'VENDORS_HOME_DATA':
      return { ...state, homeData: arg.payload }

    case 'USER_LOGOUT':
      return initialState

    default:
      break
  }
  return state
}
