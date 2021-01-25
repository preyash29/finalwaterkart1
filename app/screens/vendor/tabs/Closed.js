import React from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity, FlatList, RefreshControl, Linking } from 'react-native'
import colors from '../../../constants/colors'
import { locationIcon } from '../../../assets'
import env from '../../../constants/env'
import { useDispatch, useSelector } from 'react-redux'
import { vendorHome } from '../../../actions'

export default function Closed ({ navigation, onRefresh }) {
  const dispatch = useDispatch()
  const homeData = useSelector(({ vendor }) => vendor.homeData)
  const [refreshing, setRefreshing] = React.useState(false)

  const _refresh = async () => {
    setRefreshing(true)
    await dispatch(vendorHome())
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

        <Text style={styles.titleText}>{item?.customer?.first_name} {item?.customer?.last_name}</Text>
        <View style={{ height: 10 }} />
        <TouchableOpacity
          style={styles.row}
          onPress={() => openLocation(item?.delivery_address?.latitude, item?.delivery_address?.longitude)}
        >
          <Image source={locationIcon} style={styles.itemIcon} />
          <Text style={[styles.otherText, { flex: 1, color: colors.blueLight }]}>{item?.delivery_address?.floor_info} {item?.delivery_address?.address}</Text>
        </TouchableOpacity>
        <View style={{ height: 15 }} />
        <Text style={styles.otherText}>Delivered at {item.delivery_date}</Text>
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
        data={homeData?.closed_orders}
        keyExtractor={(it, i) => String(i)}
        renderItem={renderItem}
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 10 }}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={_refresh} colors={['#018CFF']} />
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
