import React from 'react'
import { View, StyleSheet, Text, Image, Dimensions, Switch } from 'react-native'
import { Shadow } from 'react-native-neomorph-shadows'
import { connect } from 'react-redux'
import { notificationIcon, backIcon, bottlePlaceholder } from '../../assets'
import { IconButton } from '../../components/Button'
import colors from '../../constants/colors'
import env from '../../constants/env'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import Header from '../../components/Header'

const { width } = Dimensions.get('screen')

class ProductDetails extends React.Component {
  constructor() {
    super()

    this.state = {
      inStock: true
    }
  }

  _stockUpdate = (action) => {
    this.setState({ inStock: action })
  }

  render() {
    const { inStock } = this.state
    return (
      <View style={styles.root}>
        <Header
          title='Product detail'
          left={
            <IconButton
              icon={backIcon}
              containerStyle={{ marginHorizontal: 5 }}
              onPress={() => this.props.navigation.goBack()}
            />
          }
          right={
            <IconButton
              icon={notificationIcon}
            />
          }
        />
        <View style={styles.container}>
          <KeyboardAwareScrollView>
            <View style={{ height: 30 }} />
            <View style={{ alignSelf: 'center' }}>
              <Shadow
                style={{
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.2,
                  shadowColor: colors.gray,
                  shadowRadius: 10,
                  backgroundColor: colors.white,
                  width: width / 2 - 40,
                  height: width / 2 - 40,
                  borderRadius: 30,
                  marginHorizontal: 20
                }}
              >
                <View
                  style={{ flex: 1, overflow: 'hidden', borderRadius: 30 }}
                >
                  {/* <Image
                            source={{ uri: 'https://i.ibb.co/SQrcD74/kent.png' }}
                            style={{ height: '100%', width: '100%' }}
                        /> */}
                  <Image
                    source={bottlePlaceholder}
                    style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
                  />
                </View>
              </Shadow>
            </View>
            <View margin={20}>
              <Text numberOfLines={1} style={styles.itemTitle}>Product name  |  Weight: 10L</Text>
              <View style={{ height: 5 }} />
              <Text numberOfLines={1} style={[styles.itemTitle, { color: colors.black }]}>Distributor price Rs: 30</Text>
              <Text numberOfLines={1} style={[styles.itemTitle, { color: colors.black }]}>User price Rs: 30</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                <Text numberOfLines={1} style={styles.itemTitle}>In Stock</Text>
                <View margin={5}/>
                <Switch
                  value={inStock}
                  onValueChange={this._stockUpdate}
                  thumbColor={inStock ? colors.blueLight : 'grey'}
                  // trackColor={{true: 'grey', false: 'grey'}}
                />
              </View>
              <View margin={10} />
              <View style={styles.divider} />
              <View margin={10} />
              <Text style={styles.itemDesc}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Text>
            </View>

          </KeyboardAwareScrollView>
        </View>

      </View>
    )
  }
}

export default connect()(ProductDetails)

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
  itemTitle: {
    fontSize: 16,
    fontFamily: env.fontPoppinsRegular,
    color: '#515151',
    textAlign: 'center'
  },
  itemDesc: {
    fontSize: 13,
    fontFamily: env.fontPoppinsRegular,
    color: '#515151',
    textAlign: 'center'
  },
  divider: {
    height: 1,
    backgroundColor: '#515151',
    opacity: 0.3
  }
})
