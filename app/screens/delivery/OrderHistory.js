import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import colors from '../../constants/colors'
import env from '../../constants/env'
import Header from '../../components/Header'
import { getDeliverymanOrderHistory, rootLoader } from '../../actions'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import ThisWeek from './tabs/ThisWeek'
import PastWeek from './tabs/PastWeek'
import LastMonth from './tabs/LastMonth'

const Tab = createMaterialTopTabNavigator()

class OrderHistory extends Component {
  async componentDidMount () {
    this.props.rootLoader(true)
    await this.props.getDeliverymanOrderHistory()
    this.props.rootLoader(false)
  }

  render () {
    return (
      <View style={styles.root}>
        <Header
          title='Order History'
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
                opacity: 0
              },
              style: {
                elevation: 0,
                borderBottomWidth: 0.5,
                borderBottomColor: 'rgba(1, 140, 255, 0.33)'
              }
            }}
          >
            <Tab.Screen name='This week' component={ThisWeek} />
            <Tab.Screen name='Past week' component={PastWeek} />
            <Tab.Screen name='Last Month' component={LastMonth} />
          </Tab.Navigator>

        </View>

      </View>
    )
  }
}

export default connect(null, {
  rootLoader,
  getDeliverymanOrderHistory
})(OrderHistory)

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
