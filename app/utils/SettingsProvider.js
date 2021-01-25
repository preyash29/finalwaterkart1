import React, { Component } from 'react'
import { connect } from 'react-redux'
import LoadingDialog from '../components/Dialog/LoadingDialog'
import messaging from '@react-native-firebase/messaging';
import FlashMessage from "react-native-flash-message";

class SettingsProvider extends Component {

  componentDidMount() {
    this.initPushNotification()
  }

  initPushNotification = async () => {
    try {
      const enabled = await messaging().hasPermission();
      if (!enabled) await messaging().requestPermission();
      const fcmToken = await messaging().getToken();
      console.log('Notification token: ', fcmToken)
      this.props.setNotificationToken(fcmToken)
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <>
        {this.props.children}
        <LoadingDialog />
        <FlashMessage position="top" />
      </>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setNotificationToken: (request) => dispatch({ type: 'USER_NOTIFICATION_TOKEN', payload: request })
  }
}

export default connect(null, mapDispatchToProps)(SettingsProvider)
