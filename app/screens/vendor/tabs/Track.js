import React from 'react'
import { FlatList, Image, Linking, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { vendorHome } from '../../../actions'
import { arrowrightIcon, locationIcon, navigateIcon } from '../../../assets'
import colors from '../../../constants/colors'
import env from '../../../constants/env'

export default function Track({ navigation }) {
  const homeData = useSelector(({ vendor }) => vendor.homeData)
  const dispatch = useDispatch()
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
        <View style={{ height: 10 }} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('assignOrder', { data: item })}
            >
              <Text style={[styles.otherText, { color: colors.blueLight }]}>
                {
                  item.delivery_man ? item.delivery_man?.first_name + ' ' + item.delivery_man?.last_name : 'Assign Deliveryman'
                }
              </Text>
            </TouchableOpacity>
            {
              !item?.distributor_id ? (
                <TouchableOpacity
                  onPress={() => navigation.navigate('assignDistOrder', { data: item })}
                  style={{ marginLeft: 15 }}
                >
                  <Text style={[styles.otherText, { color: colors.red }]}>
                    Assign Distibuter
                  </Text>
                </TouchableOpacity>
              ) : null
            }

          </View>

          {/* <TouchableOpacity
            style={styles.row}
            onPress={() => openLocation(item?.delivery_address?.latitude, item?.delivery_address?.longitude)}
          >
            <Image source={navigateIcon} style={styles.navigateIcon} />
            <Text style={[styles.otherText, { marginHorizontal: 5, color: '#2F2F2F', fontFamily: env.fontSemiBold }]}>Navigation</Text>
            <Image source={arrowrightIcon} style={styles.navigateIcon} />
          </TouchableOpacity> */}
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.root}>
      <FlatList
        data={homeData?.track_orders}
        keyExtractor={(it, i) => String(i)}
        renderItem={renderItem}
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 10 }}
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
