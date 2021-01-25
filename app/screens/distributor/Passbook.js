import React, { Component } from 'react'
import { View, StyleSheet, Text, SectionList, Image, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import { emailIcon, locationIcon } from '../../assets'
import { distributorPassbook, rootLoader } from '../../actions'
import { IconButton } from '../../components/Button'
import colors from '../../constants/colors'
import env from '../../constants/env'
import Header from '../../components/Header'
import moment from "moment";
import PassbookStatement from '../../components/Dialog/PassbookStatement'
import AlertDialog from '../../components/Dialog/AlertDialog'

class Passbook extends Component {

  state = {
    data: null,
    refreshing: false,
    emailDialog: false,
  }

  componentDidMount() {
    this.props.rootLoader(true)
    this.initData()
  }

  initData = async () => {
    let res = await distributorPassbook()
    this.props.rootLoader(false)
    if (res.status) {
      let data = []

      Object.keys(res.data).map((key) => {
        data.push({
          title: key,
          data: res.data[key]
        })
      })
      this.setState({ data, refreshing: false })
    } else {
      this.setState({ refreshing: false })
    }
  }

  onRefresh = () => {
    this.setState({ refreshing: true })
    this.initData()
  }

  _emailStatement = (dates) => {
    this.setState({ emailDialog: false })
    const requestParams = {
      start_date: dates.startDate,
      end_date: dates.endDate,
    }
    this.showAlert('Passbook statement sent to your email address.')
  }

  showAlert = (message) => {
    this.setState({ alert: true, alertMessage: message })
  }



  render() {
    return (
      <View style={styles.root}>
        <Header
          title='Passbook'
          right={
            <IconButton
              icon={emailIcon}
              iconStyle={{ tintColor: colors.white }}
              onPress={() => this.setState({ emailDialog: true })}
            />
          }
        />
        <View style={styles.container}>
          <SectionList
            sections={this.state.data}
            keyExtractor={(it, index) => String(index)}
            renderItem={this.renderItem}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.sectionHeader}>{title}</Text>
            )}
            contentContainerStyle={{ marginLeft: 20, flexGrow: 1 }}
            ListEmptyComponent={this.renderEmpty}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
                colors={['#018CFF']}
              />
            }
          />

        </View>
        {/* Hidden Components */}
        <PassbookStatement
          isVisible={this.state.emailDialog}
          onClose={() => this.setState({ emailDialog: false })}
          onSubmit={this._emailStatement}
        />
        <AlertDialog
          isVisible={this.state.alert}
          message={this.state.alertMessage}
          onAction={() => this.setState({ alert: false })}
        />
      </View>
    )
  }

  renderEmpty = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontFamily: env.fontRegular, color: colors.gray }}>No result found.</Text>
      </View>
    )
  }

  renderItem = ({ item }) => {
    return (
      <View style={styles.item}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.userName}>{item.vendor?.first_name} {item.vendor?.last_name}</Text>
        </View>
        <View margin={5} />
        <View style={styles.row}>
          <Image source={locationIcon} style={styles.itemIcon} />
          <Text numberOfLines={1} style={[styles.otherText, { flex: 1 }]}>{item.vendor?.address}</Text>
        </View>
        <View margin={8} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text numberOfLines={1} style={[styles.otherText, { flex: 1, flexWrap: 'wrap' }]}>Total amount Rs. {item.total_amount}</Text>
          <Text numberOfLines={1} style={[styles.otherText, { flex: 1, flexWrap: 'wrap' }]}>Commision amount Rs. {item.commission_amount}</Text>
        </View>
        <View margin={8} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={[styles.otherText, { color: colors.blueLight }]}>Delivery at {moment(new Date(item.updated_at)).format('hh:mm a')}</Text>
          <Text style={[styles.otherText, { color: '#2E2E2E' }]}>{item.unique_id}</Text>
        </View>
      </View>
    )
  }

}

export default connect(null, {
  rootLoader
})(Passbook)

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
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#D7D7D7',
    paddingVertical: 15,
    paddingRight: 20
  },
  sectionHeader: {
    fontFamily: env.fontSemiBold,
    fontSize: 16,
    color: colors.black,
    marginTop: 20
  },

  userName: {
    fontFamily: env.fontMedium,
    fontSize: 15,
    color: '#333639'
  },
  row: {
    flexDirection: 'row'
  },
  itemIcon: {
    resizeMode: 'contain',
    width: 14,
    height: 14,
    marginRight: 10,
    tintColor: '#616161'
  },
  otherText: {
    fontFamily: env.fontMedium,
    fontSize: 13,
    color: '#616161',
    marginTop: -3
  }
})
