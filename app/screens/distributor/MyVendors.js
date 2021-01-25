import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { connect } from 'react-redux'
import { plusIcon } from '../../assets'
import { IconButton } from '../../components/Button'
import colors from '../../constants/colors'
import env from '../../constants/env'
import Header from '../../components/Header'
import { distributorMyvendors, rootLoader } from '../../actions'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import vendors from './tabs/vendors'
import request from './tabs/request'
const Tab = createMaterialTopTabNavigator()

class MyVendors extends Component {
  async componentDidMount () {
    this.props.rootLoader(true)
    await this.props.distributorMyvendors()
    this.props.rootLoader(false)
  }

  render () {
    return (
      <View style={styles.root}>
        <Header
          title='Home'
          right={
            <IconButton
              icon={plusIcon}
              iconStyle={{ tintColor: colors.white }}
              containerStyle={{ marginHorizontal: 5 }}
              onPress={() => this.props.navigation.navigate('addVendor')}
            />
          }
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
            <Tab.Screen name='My vendors' component={vendors} />
            <Tab.Screen name='Requested to add' component={request} />
          </Tab.Navigator>

        </View>

      </View>
    )
  }
}

export default connect(null, {
  distributorMyvendors, rootLoader
})(MyVendors)

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
  },
  widgetTitle: {
    fontFamily: env.fontSemiBold,
    fontSize: 14,
    color: colors.blueLight
  },
  cardDetailText: {
    fontFamily: env.fontMedium,
    fontSize: 13,
    color: '#6B6B6B',
    marginTop: 5
  }
})
