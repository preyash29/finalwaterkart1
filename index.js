/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native'
import App from './app/index'
import { name as appName } from './app.json'
import 'react-native-gesture-handler'
LogBox.ignoreAllLogs()

AppRegistry.registerComponent(appName, () => App)
