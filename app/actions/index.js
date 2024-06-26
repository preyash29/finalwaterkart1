export * from './user'
export * from './customer'
export * from './comman'
export * from './product'
export * from './vendor'
export * from './delivery'
export * from './distributor'
export * from './cart'

export const SHOW_ACTIVITY_INDICATOR_ROOT = 'SHOW_ACTIVITY_INDICATOR_ROOT'
export const HIDE_ACTIVITY_INDICATOR_ROOT = 'HIDE_ACTIVITY_INDICATOR_ROOT'

export function rootLoader (request, text) {
  return (dispatch) => {
    if (request) {
      return dispatch({ type: SHOW_ACTIVITY_INDICATOR_ROOT, text: text || '' })
    } else {
      return dispatch({ type: HIDE_ACTIVITY_INDICATOR_ROOT })
    }
  }
}
