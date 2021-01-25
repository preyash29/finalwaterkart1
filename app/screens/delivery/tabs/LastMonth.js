import React, { useState } from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity, FlatList, RefreshControl } from 'react-native'
import colors from '../../../constants/colors'
import momen from 'moment'
import { localIcon } from '../../../assets'
import env from '../../../constants/env'
import { useDispatch, useSelector } from 'react-redux'
import { getDeliverymanOrderHistory } from '../../../actions'

export default function LastMonth ({ navigation }) {
  const dispatch = useDispatch()
  const [refreshing, setRefreshing] = useState(false)
  const orderHistory = useSelector(({ comman }) => comman.orderHistory)

  const onRefresh = async () => {
    setRefreshing(true)
    await dispatch(getDeliverymanOrderHistory())
    setRefreshing(false)
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('deliveryOrderDetails', { data: item })}
      >

        <View style={[styles.row, { justifyContent: 'space-between' }]}>
          <Text style={styles.titleText}>{momen(new Date(item.delivery_date)).format('Do MMM,YYYY')}</Text>
          <Text style={[styles.titleText, { color: colors.blueLight }]}>Rs. {item.total_amount}</Text>
        </View>
        <View style={{ height: 5 }} />
        <View style={styles.row}>
          <Image source={localIcon} style={styles.itemIcon} />
          <Text style={styles.otherText}>{item?.delivery_address?.floor_info} {item?.delivery_address?.landmark}</Text>
        </View>
        <View style={{ height: 8 }} />
      </TouchableOpacity>
    )
  }

  const renderEmpty = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontFamily: env.fontRegular, color: colors.gray }}>No result found.</Text>
      </View>
    )
  }

  return (
    <View style={styles.root}>

      <FlatList
        data={orderHistory?.last_month}
        keyExtractor={(it, i) => String(i)}
        renderItem={renderItem}
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 10 }}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#018CFF']} />
        }
      />

    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white
  },
  row: {
    flexDirection: 'row'
  },
  item: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 10
  },
  titleText: {
    fontFamily: env.fontPoppinsMedium,
    fontSize: 16,
    color: '#565656'
  },
  otherText: {
    fontFamily: env.fontPoppinsRegular,
    fontSize: 12,
    color: '#565656'
  },
  itemIcon: {
    resizeMode: 'contain',
    width: 14,
    height: 14,
    marginRight: 10,
    tintColor: '#565656',
    marginTop: 2
  }
})
