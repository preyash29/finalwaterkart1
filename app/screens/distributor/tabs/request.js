import React, { useState } from 'react'
import { FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { distributorMyvendors } from '../../../actions'
import { arrowrightIcon, locationIcon } from '../../../assets'
import Avatar from '../../../components/Avatar'
import colors from '../../../constants/colors'
import env from '../../../constants/env'

export default function vendors ({ navigation }) {
  const dispatch = useDispatch()
  const [refreshing, setRefreshing] = useState(false)
  const homeData = useSelector(({ comman }) => comman.homeData)

  const onRefresh = async () => {
    setRefreshing(true)
    await dispatch(distributorMyvendors())
    setRefreshing(false)
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          borderBottomWidth: 1,
          paddingVertical: 10,
          borderBottomColor: '#CDCDCD',
          marginLeft: 20,
          marginTop: 10
        }}
        onPress={() => navigation.navigate('vendorDetails', { data: item })}
      >
        <View style={styles.row}>
          <Avatar
            size={60}
            source={{ uri: item?.vendor?.profile_pic }}
          />
          <View style={{ justifyContent: 'space-between', flex: 1, marginLeft: 15 }}>
            <Text numberOfLines={2} style={[styles.itemTitle, { textTransform: 'uppercase' }]}>{item?.vendor?.first_name} {item?.vendor?.last_name}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text numberOfLines={3} style={styles.itemTitle}>Vendor Code: {item?.vendor?.referral_id}</Text>
              <Image source={arrowrightIcon} style={styles.itemIcon} />
            </View>
          </View>
        </View>
        <View style={[styles.row, { marginVertical: 10 }]}>
          <Image source={locationIcon} style={styles.itemIcon} />
          <Text numberOfLines={1} style={[styles.otherText, { flex: 1 }]}>{item?.vendor?.address}</Text>
        </View>
        <Text style={[styles.otherText, { color: '#ff0000', textAlign: 'right', marginRight: 10 }]}>
          {item.status === 2 && 'Rejected'}
          {item.status === 0 && 'Pendding'}
        </Text>
      </TouchableOpacity>
    )
  }

  const renderEmpty = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontFamily: env.fontRegular, color: colors.gray }}>No vendor found.</Text>
      </View>
    )
  }

  return (
    <View style={styles.root}>
      <FlatList
        data={homeData?.requested_vendors}
        keyExtractor={(it, i) => String(i)}
        renderItem={renderItem}
        contentContainerStyle={{ flexGrow: 1 }}
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
  itemTitle: {
    fontSize: 14,
    fontFamily: env.fontPoppinsMedium,
    color: '#323232'
    // marginBottom: 5
  },
  otherText: {
    fontFamily: env.fontPoppinsRegular,
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
  }
})
