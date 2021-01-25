import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import colors from '../../constants/colors'
import env from '../../constants/env'
import Header from '../../components/Header'
import { vendorHome } from '../../actions'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Padding from './tabs/Padding'
import Track from './tabs/Track'
import Closed from './tabs/Closed'

const Tab = createMaterialTopTabNavigator()

class Home extends Component {
  constructor () {
    super()

    this.state = {
      reasonDialog: false
    }
  }

  componentDidMount () {
    this.props.vendorHome()
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
            <Tab.Screen name='Padding' component={Padding} />
            <Tab.Screen name='Track' component={Track} />
            <Tab.Screen name='Closed' component={Closed} />
          </Tab.Navigator>

        </View>

      </View>
    )
  }
}

export default connect(null, {
  vendorHome
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
