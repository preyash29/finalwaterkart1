import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity, FlatList, Platform, Linking, RefreshControl } from 'react-native'
import colors from '../../../constants/colors'
import { navigateIcon, arrowrightIcon, locationIcon } from '../../../assets'
import env from '../../../constants/env'
import SaleClosure from '../../../components/Dialog/SaleClosure'
import { useDispatch, useSelector } from 'react-redux'
import { getDeliverymanHome } from '../../../actions'

export default function Closed ({ navigation }) {
  const dispatch = useDispatch()
  const homeData = useSelector(({ comman }) => comman.homeData)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {

  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    await dispatch(getDeliverymanHome())
    setRefreshing(false)
  }

  const openLocation = (latitude, longitude) => {
    const location = `${latitude},${longitude}`
    const url = Platform.select({
      ios: `maps:${location}`,
      android: `geo:${location}?center=${location}&q=${location}&z=16`
    })
    Linking.openURL(url)
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.item}
        activeOpacity={1}
      onPress={() => navigation.navigate('orderDetails', { data: item })}
      >

        <Text style={styles.titleText}>{item?.customer.first_name} {item?.customer.last_name}</Text>

        <View style={{ height: 10 }} />
        <View style={styles.row}>
          <Image source={locationIcon} style={styles.itemIcon} />
          <Text style={[styles.otherText, { flex: 1 }]}>{item?.delivery_address?.floor_info} {item?.delivery_address?.address}</Text>
        </View>
        <View style={{ height: 10 }} />
        <View style={[styles.row, { justifyContent: 'space-between' }]}>
          <View />
          {/* <TouchableOpacity
            style={styles.btn}
          >
            <Text style={[styles.otherText, { color: colors.white }]}>Delivery</Text>
          </TouchableOpacity>
          <Text style={[styles.otherText, { color: '#ff0000' }]}>Cancel</Text> */}
          {/* <View style={{ width: 2, backgroundColor: colors.gray, height: '50%', marginHorizontal: 20 }} />
          <Text style={styles.otherText}>Close</Text> */}

          <TouchableOpacity
            onPress={() => openLocation(item?.delivery_address?.latitude, item?.delivery_address?.longitude)}
            style={styles.row}

          >
            <Image source={navigateIcon} style={styles.navigateIcon} />
            <Text style={[styles.otherText, { marginHorizontal: 5, color: '#2F2F2F', fontFamily: env.fontSemiBold }]}>Navigation</Text>
            <Image source={arrowrightIcon} style={styles.navigateIcon} />
          </TouchableOpacity>
        </View>
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
        data={homeData?.cancel_orders}
        keyExtractor={(it, i) => String(i)}
        renderItem={renderItem}
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 10 }}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#018CFF']} />
        }
      />

      <SaleClosure />
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
    marginHorizontal: 15,
    marginTop: 10,
    borderBottomWidth: 4,
    borderBottomColor: '#ECECEC'
  },
  titleText: {
    fontFamily: env.fontSemiBold,
    fontSize: 16,
    color: colors.black
  },
  otherText: {
    fontFamily: env.fontMedium,
    fontSize: 14,
    color: '#616161',
    marginTop: -3
  },
  itemIcon: {
    resizeMode: 'contain',
    width: 14,
    height: 14,
    marginRight: 10,
    tintColor: '#616161'
  },
  navigateIcon: {
    resizeMode: 'contain',
    width: 14,
    height: 14,
    tintColor: '#2F2F2F'
  },
  btn: {
    backgroundColor: colors.blueLight,
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
    paddingHorizontal: 20
  }
})
