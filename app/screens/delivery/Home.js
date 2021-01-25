import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { filterIcon, notificationIcon } from '../../assets'
import { IconButton } from '../../components/Button'
import colors from '../../constants/colors'
import env from '../../constants/env'
import Header from '../../components/Header'
import { getDeliverymanHome, rootLoader } from '../../actions'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
// import Padding from './tabs/UpcomingOrder'
import Upcomming from './tabs/Upcomming'
import Closed from './tabs/Closed'

const Tab = createMaterialTopTabNavigator()

class Home extends Component {
  async componentDidMount () {
    this.props.rootLoader(true)
    await this.props.getDeliverymanHome()
    this.props.rootLoader(false)
  }

  render () {
    return (
      <View style={styles.root}>
        <Header
          title='Home'
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
            <Tab.Screen name='Upcomming' component={Upcomming} />
            <Tab.Screen name='Closed' component={Closed} />
          </Tab.Navigator>

        </View>

      </View>
    )
  }
}

export default connect(null, {
  getDeliverymanHome,
  rootLoader
})(Home)

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
