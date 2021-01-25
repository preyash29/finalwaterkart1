const initialState = {
  cardItems: []
}

export default function cart (state = initialState, arg) {
  switch (arg.type) {
    case 'CARD_ITEMS':
      return { ...state, cardItems: arg.payload || [] }

    case 'USER_LOGOUT':
      return initialState

    default:
      break
  }
  return state
}
