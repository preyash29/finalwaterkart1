import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { notificationIcon } from '../../assets'
import { IconButton } from '../../components/Button'
import colors from '../../constants/colors'
import env from '../../constants/env'
import Header from '../../components/Header'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Bulk from './BookingTabs/Bulk'
import Community from './BookingTabs/Community'
import Corporate from './BookingTabs/Corporate'

const Tab = createMaterialTopTabNavigator()

class Booking extends Component {
  render () {
    return (
      <View style={styles.root}>
        <Header
          title='Booking'
        />
        <View style={styles.container}>
          <Tab.Navigator
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
            <Tab.Screen name='Bulk' component={Bulk} />
            <Tab.Screen name='Community' component={Community} />
            <Tab.Screen name='Corporate' component={Corporate} />
          </Tab.Navigator>

        </View>

      </View>
    )
  }
}

export default connect()(Booking)

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
