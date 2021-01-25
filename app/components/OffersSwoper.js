import React, { useEffect } from 'react'
import { View, Text, Image, Dimensions } from 'react-native'
import colors from '../constants/colors'
import env from '../constants/env'
import { arrowrightIcon } from '../assets'
import Swiper from 'react-native-swiper'

const { width } = Dimensions.get('screen')
const itemWidth = width / 3 - 20

export default function OffersSwoper({ data }) {
  if (data) {
    data = splitArrayIntoChunksOfLen(data, 3)
  } else {
    return null
  }

  const renderItem = (item, i) => {

    return (
      <View key={String(i)}>
        <View
          style={{
            width: itemWidth,
            backgroundColor: '#DDF0FF',
            borderRadius: 15,
            padding: 15,
            height: 100
          }}
        >
          {
            item?.discount_type === 1 ? (
              <Text style={{ color: colors.black, fontFamily: env.fontPoppinsRegular, fontSize: 13 }}>Flat Rs. {item.discount_rate} Discount</Text>
            ) : (
              <Text style={{ color: colors.black, fontFamily: env.fontPoppinsRegular, fontSize: 13 }}>Get {item.discount_rate}% discount up to {item.max_discount_amount}*</Text>
            )
          }

          {/* <Text style={{ color: colors.blueLight, fontFamily: env.fontPoppinsMedium, fontSize: 17 }}>{item.max_discount_amount}%off</Text>
          <Text style={{ color: colors.black, fontFamily: env.fontPoppinsRegular, fontSize: 13 }}>on</Text>
          <Text style={{ color: colors.black, fontFamily: env.fontPoppinsRegular, fontSize: 13 }}>{item.title} </Text> */}
        </View>
        <View
          style={{
            backgroundColor: '#CBE7FF',
            opacity: 0.26,
            height: 20,
            borderRadius: 15,
            marginHorizontal: 10,
            marginTop: -15
          }}
        />
      </View>
    )
  }

  return (
    <Swiper
      loop
      autoplay
      autoplayTimeout={5}
      height='100%'
      paginationStyle={{ marginBottom: -50 }}
    >

      {
        data && data.map((item, i) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: 20
            }}
            key={String(i)}
          >
            {
              item.map(renderItem)
            }

          </View>
        ))
      }
    </Swiper>
  )
}

const splitArrayIntoChunksOfLen = (arr, len) => {
  var chunks = []; var i = 0; var n = arr.length
  while (i < n) {
    chunks.push(arr.slice(i, i += len))
  }
  return chunks
}
