import React from 'react'
import { TextInput, StyleSheet, View, ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'
import { notificationIcon } from '../../assets'
import { Button, IconButton } from '../../components/Button'
import Header from '../../components/Header'
import colors from '../../constants/colors'
import env from '../../constants/env'

class HealthyYou extends React.Component {
  render () {
    return (
      <View style={styles.root}>
        <Header
          title='Healthy You'
          right={
            <IconButton
              icon={notificationIcon}
            />
          }
        />
        <View style={styles.container}>

          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingVertical: 20 }}
          >
            <View margin={20}>
              <Text style={styles.inputTitle}>Benefits of community booking</Text>
              <View style={{ height: 20 }} />
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.dot} />
                <Text style={styles.descText}>Lorem Ipsum is simply dummy text of the printing and typesetting industry , Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</Text>
              </View>
              <View style={{ height: 10 }} />
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.dot} />
                <Text style={styles.descText}>Lorem Ipsum is simply dummy text of the printing and typesetting industry</Text>
              </View>
              <View style={{ height: 25 }} />
              <Text style={styles.inputTitle}>Water Intake</Text>
              <View style={{ height: 10 }} />
              <Text style={styles.descText}>Lorem Ipsum is simply dummy text of the printing and typesetting industry , Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</Text>
            </View>
            <View style={{ height: 4, backgroundColor: '#D7D7D7', opacity: 0.5, marginVertical: 20 }} />

            <View style={{ marginHorizontal: 40, marginTop: 20 }}>
              <Text style={styles.reminderTitle}>Set reminder according to your water intake</Text>
              <View style={{ height: 10 }} />
              <View style={{ width: '60%', alignSelf: 'center' }}>
                <TextInput
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#D7D7D7',
                    fontFamily: env.fontMedium,
                    textAlign: 'center'
                  }}
                  placeholder='water intake a day'
                  placeholderTextColor='#747474'
                  keyboardType='numeric'
                />
              </View>

              <View style={{ marginVertical: 50, width: '70%', alignSelf: 'center' }}>
                <Button
                  title='Set reminder'
                />
              </View>

            </View>

          </ScrollView>

        </View>

      </View>
    )
  }
}

export default connect()(HealthyYou)

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
  inputTitle: {
    fontFamily: env.fontMedium,
    color: colors.black,
    fontSize: 16
  },
  descText: {
    fontFamily: env.fontSemiBold,
    fontSize: 14,
    color: '#747474',
    flex: 1
  },
  dot: {
    width: 8, height: 8, borderRadius: 10, backgroundColor: colors.blueLight, marginRight: 15, marginTop: 6
  },
  reminderTitle: {
    fontFamily: env.fontMedium,
    fontSize: 14,
    color: '#747474',
    textAlign: 'center'
  }
})
