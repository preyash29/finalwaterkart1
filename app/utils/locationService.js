import Geolocation from 'react-native-geolocation-service'
import { Platform, PermissionsAndroid } from 'react-native'

export default function locationService () {
  return new Promise(async (resolve, reject) => {
    let status
    if (Platform.OS === 'ios') {
      status = await Geolocation.requestAuthorization('always')
    } else {
      status = await await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    }
    if (status === 'granted') {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          reject(error.message)
          console.log(error.code, error.message)
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      )
    } else {
      reject('Permission denied')
    }
  })
}
