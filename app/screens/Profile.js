import React from 'react'
import { StyleSheet, View, FlatList, Text, Image } from 'react-native'
import { connect } from 'react-redux'
import { backIcon, usernameIcon, callIcon, accountsIcon } from '../assets'
import { IconButton } from '../components/Button'
import Header from '../components/Header'
import colors from '../constants/colors'
import env from '../constants/env'

class Profile extends React.Component {
  render () {
    return (
      <View style={styles.root}>
        <Header
          title='Profile'

        />
        <View style={styles.container}>

          <Text style={styles.title}>Name</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <Image source={usernameIcon} style={styles.iconStyle} />
            <Text style={styles.value}>Debu Jadeja</Text>
          </View>
          <View margin={5} />
          <Text style={styles.title}>Number</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <Image source={callIcon} style={styles.iconStyle} />
            <Text style={styles.value}>+91 1234567890</Text>
          </View>
          <View margin={5} />
          <Text style={styles.title}>Vendor ID</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <Image source={accountsIcon} style={styles.iconStyle} />
            <Text style={styles.value}>JGK9089</Text>
          </View>
          <View margin={10} />
          <Text style={[styles.title, { fontFamily: env.fontSemiBold, color: colors.black }]}>Basic Information</Text>
          <View margin={10} />
          <Text style={[styles.desc, { color: colors.blueLight }]}>Working time</Text>
          <Text style={styles.desc}>10:00am to 5:00am</Text>
          <View margin={10} />
          <Text style={[styles.desc, { color: colors.blueLight }]}>Areas covered</Text>
          <Text style={styles.desc}>Bapu nagar -360001</Text>
          <View margin={10} />
          <Text style={[styles.desc, { color: colors.blueLight }]}>Products working on</Text>
          <Text style={styles.desc}>Dispensers, bulk booking, RO unit services</Text>
          <View margin={10} />
          <Text style={[styles.desc, { color: colors.blueLight }]}>Distributor working on</Text>
          <Text style={styles.desc}>Lorem Ipsum is simply dummy text of the printing and typesetting industry</Text>
          <View margin={10} />
          <Text style={[styles.value, { color: colors.black, marginLeft: 0 }]}>Order</Text>
          <Text style={[styles.value, { marginLeft: 0 }]}>Instant order, Preorder</Text>
        </View>

      </View>
    )
  }
}

export default connect()(Profile)

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden',
    padding: 20,
    paddingTop: 30
  },

  iconStyle: {
    resizeMode: 'contain',
    height: 14,
    width: 14
  },

  title: {
    fontFamily: env.fontMedium,
    fontSize: 15,
    color: colors.lightBlack
  },
  value: {
    fontFamily: env.fontMedium,
    fontSize: 14,
    color: colors.lightBlack,
    marginLeft: 15
  },

  desc: {
    fontFamily: env.fontRegular,
    fontSize: 14,
    color: colors.lightBlack
  }
})
