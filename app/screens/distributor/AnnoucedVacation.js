import React, { Component } from 'react'
import { View, StyleSheet, Text, Image, SafeAreaView, FlatList, Dimensions, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { bottlePlaceholder, hambargIcon, locationIcon, notificationIcon } from '../../assets'
import { IconButton } from '../../components/Button'
import colors from '../../constants/colors'
import env from '../../constants/env'
import { Shadow } from 'react-native-neomorph-shadows'
import moment from 'moment'
import Header from '../../components/Header'
import Avatar from '../../components/Avatar'

const { width } = Dimensions.get('screen')

class AnnoucedVacation extends Component {
  render() {
    return (
      <View style={styles.root}>
        <Header
          title='Annouced vacation'
          right={
            <IconButton
              icon={notificationIcon}
            />
          }
        />
        <View style={styles.container}>

          <FlatList
            data={[{}, {}, {}, {}, {}]}
            keyExtractor={(it, i) => String(i)}
            renderItem={this.renderItem}
            contentContainerStyle={{ flexGrow: 1 }}
          />

        </View>

      </View>
    )
  }

  renderItem = () => {
    return (
      <View
        style={{ borderBottomWidth: 1, 
          paddingVertical: 10, 
          borderBottomColor: '#CDCDCD',
          marginLeft: 20,
          marginTop: 10
        }}
      >
        <View style={styles.row}>
          <Avatar
            size={60}
          />
          <View style={{ justifyContent: 'space-between', flex: 1, marginLeft: 15 }}>
            <Text numberOfLines={2} style={styles.itemTitle}>User’s name</Text>
            <Text numberOfLines={3} style={styles.itemTitle}>Vacation Date : 14 & 15th july,</Text>
          </View>
        </View>
        <View style={[styles.row, { marginVertical: 10 }]}>
          <Image source={locationIcon} style={styles.itemIcon} />
          <Text numberOfLines={1} style={[styles.otherText, { flex: 1 }]}>Lorem Ipsum is simply dummy text of the printing and typesetting industry</Text>
        </View>
      </View>
    )
  }
}

export default connect()(AnnoucedVacation)

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
    color: '#323232',
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
  },
})
