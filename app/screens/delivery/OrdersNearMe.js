import React from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity, FlatList } from 'react-native'
import colors from '../../constants/colors'
import momen from 'moment'
import { navigateIcon, arrowrightIcon, locationIcon, notificationIcon } from '../../assets'
import env from '../../constants/env'
import Header from '../../components/Header'
import { IconButton } from '../../components/Button'

export default function OrdersNearMe ({ navigation }) {
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('deliveryOrderDetails', { data: item })}
      >

        <Text style={styles.titleText}>Vendor’s name</Text>
        <View style={{ height: 10 }} />
        <View style={styles.row}>
          <Image source={locationIcon} style={styles.itemIcon} />
          <Text numberOfLines={1} style={[styles.otherText, { flex: 1 }]}>Lorem Ipsum is simply dummy text of the printing and typesetting industry</Text>
        </View>
        <View style={{ height: 10 }} />
        <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>

          <Text style={[styles.otherText, { color: colors.blueLight, fontFamily: env.fontSemiBold }]}>12:30pm</Text>
          <View style={styles.row}>
            <Image source={navigateIcon} style={styles.navigateIcon} />
            <Text style={[styles.otherText, { marginHorizontal: 5, color: '#2F2F2F', fontFamily: env.fontSemiBold }]}>Navigation</Text>
            <Image source={arrowrightIcon} style={styles.navigateIcon} />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.root}>
      <Header
        title='Order near me'
        right={
          <IconButton
            icon={notificationIcon}
          />
        }
      />
      <View style={styles.container}>
        <FlatList
          data={[{}, {}]}
          keyExtractor={(it, i) => String(i)}
          renderItem={renderItem}
          contentContainerStyle={{ flexGrow: 1, paddingVertical: 10 }}
        />
      </View>
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
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden'
  },
  navigateIcon: {
    resizeMode: 'contain',
    width: 14,
    height: 14,
    tintColor: '#2F2F2F'
  }
})
