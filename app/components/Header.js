import React from 'react'
import { View, StyleSheet, Text, SafeAreaView, StatusBar } from 'react-native'
import { hambargIcon } from '../assets'
import { IconButton } from '../components/Button'
import colors from '../constants/colors'
import env from '../constants/env'
import { useNavigation } from '@react-navigation/native'

export default function Header ({ title, left, right }) {
  const navigation = useNavigation()

  return (
    <View style={{ backgroundColor: colors.blueLight, paddingBottom: 60, marginBottom: -40 }}>
      <StatusBar backgroundColor={colors.blueLight} barStyle='light-content' />
      <SafeAreaView />
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 5
      }}
      >
        <View style={styles.row}>
          {
            left || (
              <IconButton
                icon={hambargIcon}
                containerStyle={{ marginHorizontal: 5 }}
                onPress={() => navigation.openDrawer()}
              />
            )
          }
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        {right}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 19,
    fontFamily: env.fontOSSemiBold,
    color: colors.white
  }
})
