/**
 * Auther: Akshay Italiya
 *
 * @format JavaScript Standard Style(standardJS)
 * @flow https://github.com/AvitaliyaORG
 */
import React from 'react'
import MainStack from './navigations/MainStack'
import configureStore from './utils/store'
import { Provider } from 'react-redux'
import SettingsProvider from './utils/SettingsProvider'

const store = configureStore()

function MainApp () {
  return (
    <Provider store={store}>
      <SettingsProvider>
        <MainStack />
      </SettingsProvider>
    </Provider>
  )
}

export default MainApp
