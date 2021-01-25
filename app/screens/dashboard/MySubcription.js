import moment from 'moment'
import React from 'react'
import { FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { getMySub, rootLoader } from '../../actions'
import OfferDetails from '../../components/Dialog/OfferDetails'
import Header from '../../components/Header'
import colors from '../../constants/colors'
import env from '../../constants/env'

class MySubcription extends React.Component {

  constructor() {
    super()
    this.state = {
      data: null,
      refreshing: false,
      errorMessage: ''
    }
  }


  componentDidMount() {
    this.props.rootLoader(true)
    this.initData()
  }

  initData = async () => {
    let res = await getMySub()
    this.props.rootLoader(false)
    if (res.status) {
      this.setState({ data: res.data, isLoading: false, refreshing: false })
    } else {
      this.setState({ errorMessage: res.message, refreshing: false })
    }
  }

  onRefresh = () => {
    this.setState({ refreshing: true })
    this.initData()
  }


  render() {
    return (
      <View style={styles.root}>
        <Header
          title='My Subcription'
        />
        <View style={styles.container}>
          <FlatList
            data={this.state.data}
            keyExtractor={(it, index) => String(index)}
            renderItem={this.renderItem}
            contentContainerStyle={{ flexGrow: 1, paddingVertical: 20 }}
            ListEmptyComponent={this.renderEmpty}
            refreshControl={
              <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} colors={['#018CFF']} />
            }
          />
        </View>
      </View>
    )
  }

  renderItem = ({ item }) => {


    return (
      <View>
        <Text style={{ fontFamily: env.fontMedium, color: '#000', fontSize: 14, marginTop: 10, paddingHorizontal: 20 }}>
          subcription's Date: {moment(item?.start_date).format('Do MMM, YYYY')} - {moment(item?.end_date).format('Do MMM, YYYY')}
        </Text>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, paddingVertical: 10, paddingHorizontal: 20, borderBottomColor: 'rgba(130, 130, 130, 0.3)' }}
          activeOpacity={1}
        onPress={() => this.props.navigation.navigate('subcriptionDetails', { data: item })}
        >
          <View style={{ borderRadius: 20, overflow: 'hidden', zIndex: 1, }}>
            <Image
              source={{ uri: item?.product?.image }}
              style={{ width: 80, height: 80, backgroundColor: '#f7f7f7' }}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 20 }}>
            <Text style={styles.serviceTitle}>{item?.product?.name}</Text>
            <Text style={styles.serviceTitle}>Amount : Rs. {item?.total_amount}  |  Qty:  {item?.quantity}</Text>
            <Text style={styles.serviceTitle}>Total order: {item?.total_orders || 0}</Text>
            <Text style={styles.serviceTitle}>Remaining order: {(item?.total_orders - item?.completed_orders) || 0}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderEmpty = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontFamily: env.fontRegular, color: colors.gray }}>{this.state.errorMessage || 'No subcription'}</Text>
      </View>
    )
  }
}

export default connect(null, {
  rootLoader
})(MySubcription)

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
    overflow: 'hidden'
  },
  item: {
    borderBottomWidth: 3,
    borderBottomColor: '#F6F6F6',
    padding: 20
  },
  buttonText: {
    fontFamily: env.fontSemiBold,
    fontSize: 14,
    color: colors.white,
  },
  titleText: {
    fontFamily: env.fontSemiBold,
    fontSize: 15,
    color: colors.black,
  },
  validText: {
    fontFamily: env.fontMedium,
    fontSize: 14,
    color: colors.black,
  }
})
