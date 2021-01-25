import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { connect } from 'react-redux'
import { notificationIcon, backIcon } from '../../assets'
import { IconButton } from '../../components/Button'
import colors from '../../constants/colors'
import env from '../../constants/env'
import Header from '../../components/Header'

class OrdersToDistributor extends React.Component {
  constructor () {
    super()

    this.state = {

    }
  }

  render () {
    return (
      <View style={styles.root}>
        <Header
          title='Orders to distributor'

        />
        <View style={styles.container}>
          <View margin={20}>
            <Text style={styles.itemTitle}>Driver Name</Text>
            <View margin={10} />
            <Text style={styles.otherText}>Areas covered</Text>
            <Text style={[styles.otherText, { color: '#606060' }]}>Bapu nagar-360001, Gandhi Road - 340008</Text>
            <View margin={10} />
            <Text style={styles.otherText}>Ordered for 100 cans</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.otherText}>Cans retured 180</Text>
              <Text style={[styles.otherText, { color: '#BE000D' }]}>20 Remaining</Text>
            </View>

          </View>
        </View>

      </View>
    )
  }
}

export default connect()(OrdersToDistributor)

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
    paddingTop: 20
  },

  itemTitle: {
    fontSize: 16,
    fontFamily: env.fontSemiBold,
    color: '#1E2123'
  },
  otherText: {
    fontSize: 14,
    fontFamily: env.fontMedium,
    color: colors.blueLight,
    marginTop: 5
  }
})
