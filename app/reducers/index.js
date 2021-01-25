import { combineReducers } from 'redux'
import user from './user'
import activityIndicator from './activityIndicator'
import vendor from './vendor'
import comman from './comman'
import cart from './cart'

const rootReducer = combineReducers({
  user,
  activityIndicator,
  vendor,
  comman,
  cart
})

export default rootReducer
