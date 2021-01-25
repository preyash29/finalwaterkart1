import React from 'react'
import { StyleSheet, View, Text, Clipboard, Platform, ToastAndroid, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { Button } from '../../components/Button'
import Header from '../../components/Header'
import colors from '../../constants/colors'
import env from '../../constants/env'
import Share from "react-native-share"


class ReferEarn extends React.Component {

  _copyToClipboard = () => {
    Clipboard.setString(this.props.user?.referral_id)
    if (Platform.OS === 'android') ToastAndroid.show('Refer code to clipboard.', ToastAndroid.SHORT)
  }

  _share = () => {
    Share.open({
      title: 'Refer and earn',
      message: `I'm inviting you to use Waterkart, Enter my code ${this.props.user?.referral_id} - just before your your first waterkart order.`
    })
  }

  render() {
    return (
      <View style={styles.root}>
        <Header
          title='Refer and Earn'
        />
        <View style={styles.container}>
          <View style={{ height: 20 }} />
          <Text style={styles.titleText}>Invite your friends, Earn a rewards</Text>
          <View style={{ height: 30 }} />
          <TouchableOpacity
            onPress={this._copyToClipboard}
            activeOpacity={1}
            style={styles.referView}
          >
            <Text style={[styles.titleText, { fontSize: 17, fontFamily: env.fontPoppinsMedium, color: colors.blueLight }]}>{this.props.user?.referral_id}</Text>
            <Text style={[styles.titleText, { fontSize: 12, fontFamily: env.fontPoppinsRegular }]}>Share your referral Code</Text>
          </TouchableOpacity>

          <View style={{ width: '70%', alignSelf: 'center', marginTop: 30 }}>
            <Button
              title='Share with friends'
              onPress={this._share}
            />
          </View>


        </View>

      </View>
    )
  }
}

function mapStateToProps({ user }) {
  return({
    user: user.currentUser
  })
}

export default connect(mapStateToProps)(ReferEarn)

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden',
    padding: 30
  },
  titleText: {
    fontSize: 14,
    fontFamily: env.fontPoppinsMedium,
    color: colors.lightBlack
  },
  referView: {
    padding: 20,
    paddingHorizontal: 30,
    elevation: 5,
    alignItems: 'center',
    backgroundColor: colors.white
  }
})
