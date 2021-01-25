import moment from 'moment'
import React from 'react'
import { View, StyleSheet, Text, FlatList, Clipboard, TouchableOpacity, Platform, ToastAndroid, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import Header from '../../components/Header'
import colors from '../../constants/colors'
import env from '../../constants/env'
import { getOffers, rootLoader } from '../../actions'
import OfferDetails from '../../components/Dialog/OfferDetails'

class Offers extends React.Component {

  constructor() {
    super()
    this.state = {
      data: null,
      errorMessage: '',
      offerDialog: false,
      htmlData: '',
      refreshing: false,
      offerTitle: ''
    }
  }


  componentDidMount() {
    this.props.rootLoader(true)
    this.initData()
  }

  initData = async () => {
    let res = await getOffers()
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

  _copyToClipboard = (data) => {
    Clipboard.setString(data)
    if (Platform.OS === 'android') ToastAndroid.show('Offer code to clipboard.', ToastAndroid.SHORT)
  }

  render() {
    return (
      <View style={styles.root}>
        <Header
          title='Offers'
        />

        <View style={styles.container}>
          <FlatList
            data={this.state.data}
            keyExtractor={(it, index) => String(index)}
            renderItem={this.renderItem}
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={this.renderEmpty}
            refreshControl={
              <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} colors={['#018CFF']} />
            }
          />
        </View>

        <OfferDetails
          isVisible={this.state.offerDialog}
          onClose={() => this.setState({ offerDialog: false })}
          data={this.state.htmlData}
          title={this.state.offerTitle}
        />

      </View>
    )
  }

  renderItem = ({ item }) => {

    let title = ''
    if(item?.discount_type === 1) title = `Flat Rs. ${item.discount_rate} Discount`
    else  title = `Get ${item.discount_rate}% discount up to ${item.max_discount_amount}*`

    return (
      <TouchableOpacity
        style={styles.item}
        activeOpacity={1}
        onPress={() => this.setState({ offerDialog: true, htmlData: item.description, offerTitle: title })}
      >
        <Text style={styles.titleText}>{title}</Text>

        {/* <Text style={[styles.titleText, { opacity: 0.5, marginTop: 10 }]}>{item.description}</Text> */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
          <TouchableOpacity
            style={{ backgroundColor: colors.blueLight, padding: 10, borderRadius: 3 }}
            onPress={() => this._copyToClipboard(item.offer_code)}
          >
            <Text style={styles.buttonText}>Use code : {item.offer_code}</Text>
          </TouchableOpacity>
          <Text style={styles.validText}>Valid till {moment(new Date(item.end_date)).format('Do MMM, YYYY')}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderEmpty = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontFamily: env.fontRegular, color: colors.gray }}>{this.state.errorMessage || 'No offers available'}</Text>
      </View>
    )
  }
}

export default connect(null, {
  rootLoader
})(Offers)

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
