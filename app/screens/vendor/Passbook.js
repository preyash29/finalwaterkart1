import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { filterIcon, notificationIcon } from '../../assets'
import { IconButton } from '../../components/Button'
import colors from '../../constants/colors'
import env from '../../constants/env'
import Header from '../../components/Header'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import PassbookAll from './tabs/PassbookAll'
// import Community from './BookingTabs/Community'
// import Corporate from './BookingTabs/Corporate'

const Tab = createMaterialTopTabNavigator()

class Passbook extends Component {
  render () {
    return (
      <View style={styles.root}>
        <Header
          title='Passbook'

        />
        <View style={styles.container}>
          <PassbookAll />
          {/* <Tab.Navigator
            tabBarOptions={{
              showIcon: false,
              activeTintColor: colors.blueLight,
              inactiveTintColor: '#707070',
              labelStyle: {
                fontFamily: env.fontOSSemiBold,
                textTransform: 'capitalize'
              },
              indicatorStyle: {
                borderBottomColor: colors.blueLight,
                borderBottomWidth: 1
              }
            }}
          >
            <Tab.Screen name='All' component={PassbookAll} />
            <Tab.Screen name='Commision' component={PassbookAll} />
          </Tab.Navigator> */}

        </View>

      </View>
    )
  }
}

export default connect()(Passbook)

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden'
  }
})
