const initialState = {
  currentUser: null,
  locationCoords: null,
  countryCode: 91,
  addressList: null,
  supplierList: null,
  walletBalance: 0,
  orderHistories: [],
  canceledOrders: [],
  requestServices: [],
  closedServices: [],
  notificationToken: 'push_token'
}

export default function user(state = initialState, arg) {
  switch (arg.type) {
    case 'USER_LOGIN':
      return { ...state, currentUser: arg.payload }
    case 'USER_CURRENT_LOCATION':
      return { ...state, locationCoords: arg.payload }
    case 'USER_ADDRESS_LIST':
      return { ...state, addressList: arg.payload }
    case 'SUPPLIER_LIST':
      return { ...state, supplierList: arg.payload }
    case 'WALLET_BALANCE':
      return { ...state, walletBalance: arg.payload }
    case 'ORDER_HISTORY_DATA':
      return { ...state, orderHistories: arg.orders, canceledOrders: arg.canceled }
    case 'CUSTOMER_SERVICES_LIST':
      return { ...state, requestServices: arg.request, closedServices: arg.closed }

      case 'USER_NOTIFICATION_TOKEN':
      return { ...state, notificationToken: arg.payload }

    case 'USER_LOGOUT':
      return { ...initialState, locationCoords: state.locationCoords }

    default:
      break
  }
  return state
}
