import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  FlatList,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import colors from '../../constants/colors';
import env from '../../constants/env';
import {Shadow} from 'react-native-neomorph-shadows';
import moment from 'moment';
import Header from '../../components/Header';
import {
  getCustomerOrders,
  rootLoader,
  removeToCard,
  cartProductQTYUpdate,
  updateCardItems,
} from '../../actions';
import {BoxInputField} from '../../components/InputField';
import {trashIcon} from '../../assets';
import {Button} from '../../components/Button';

const {width} = Dimensions.get('screen');

class ProductCart extends Component {
  constructor() {
    super();

    this.state = {
      data: null,
      refreshing: false,
    };
  }

  componentDidMount() {
    this.props.updateCardItems();
    // this.props.rootLoader(true)
    // this.focusNavigation = this.props.navigation.addListener('focus', this.initData);
  }

  // componentWillUnmount() {
  //     this.focusNavigation()
  // }

  _removeItem = (data) => {
    this.props.removeToCard(data);
  };

  _increaseQty = (item) => {
    try {
      let qty = item.quantity || 0;
      if (!Number(qty)) qty = 0;
      qty += 1;
      this.props.cartProductQTYUpdate(item, qty);
    } catch (error) {}
  };

  _decreaseQty = (item) => {
    try {
      let qty = item.quantity || 0;
      if (!Number(qty)) qty = 0;
      qty -= 1;
      if (qty <= 0) qty = 1;
      this.props.cartProductQTYUpdate(item, qty);
    } catch (error) {}
  };
  

  _checkOut = () => {
    this.props.navigation.navigate('checkOut');
  };

  render() {
    return (
      <View style={styles.root}>
        <Header title="Cart" />
        <View style={styles.container}>
          <FlatList
            data={this.props.cardItems}
            keyExtractor={(it, i) => String(i)}
            renderItem={this.renderItem}
            contentContainerStyle={{flexGrow: 1, paddingTop: 10}}
            ListEmptyComponent={this.renderEmpty}
            ListFooterComponent={() => (
              <View style={{margin: 40, alignSelf: 'center'}}>
                {this.props.cardItems?.length > 0 ? (
                  <Button
                    title="Checkout"
                    containerStyle={{paddingHorizontal: 30, height: 45}}
                    onPress={this._checkOut}
                  />
                ) : null}
              </View>
            )}
          />
        </View>
      </View>
    );
  }

  renderItem = ({item}, index) => {
    return (
      <View
        style={{
          borderBottomWidth: 0.5,
          padding: 20,
          borderBottomColor: 'rgba(130, 130, 130, 0.3)',
        }}>
        <View style={[styles.row, {flex: 1, marginTop: 15}]}>
          <Shadow
            style={{
              shadowOffset: {width: 0, height: 0},
              shadowOpacity: 0.2,
              shadowColor: colors.gray,
              shadowRadius: 10,
              backgroundColor: colors.white,
              width: width * 0.2,
              height: width * 0.2,
              borderRadius: 20,
              marginRight: 20,
            }}>
            <View style={{flex: 1, overflow: 'hidden', borderRadius: 30}}>
              <Image
                source={{uri: item?.product?.image}}
                style={{height: '100%', width: '100%'}}
              />
            </View>
          </Shadow>
          <View style={{flex: 1}}>
            <Text numberOfLines={1} style={styles.itemTitle}>
              {item?.product?.name}
            </Text>
            <Text numberOfLines={1} style={styles.priceLabel}>
              Rs. {item?.product?.sell_price}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 8,
              }}>
              <TouchableOpacity
                style={[styles.qtyBtn, {backgroundColor: colors.red}]}
                onPress={() => this._decreaseQty(item)}>
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <BoxInputField
                customStyle={{
                  height: undefined,
                  marginHorizontal: 10,
                  width: 60,
                  paddingHorizontal: 10,
                  fontSize: 13,
                  paddingVertical: 0,
                  textAlign: 'center',
                }}
                keyboardType="number-pad"
                value={item?.quantity?.toString()}
                editable={false}
                // onChangeText={(text) => this._changeQty(item, text)}
              />
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => this._increaseQty(item)}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
              
            </View>
          </View>
          <TouchableOpacity
            style={{padding: 10, paddingRight: 0}}
            onPress={() => this._removeItem(item)}>
            <Image
              source={trashIcon}
              style={{resizeMode: 'contain', height: 20, width: 20, tintColor: colors.red}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderEmpty = () => {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontFamily: env.fontRegular, color: colors.gray}}>
          {this.state.errorMessage || 'No product found.'}
        </Text>
      </View>
    );
  };
}

function mapStateToProps({cart}) {
  return {
    cardItems: cart.cardItems,
  };
}

export default connect(mapStateToProps, {
  getCustomerOrders,
  rootLoader,
  removeToCard,
  cartProductQTYUpdate,
  updateCardItems,
})(ProductCart);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden',
  },
  itemTitle: {
    fontSize: 14,
    fontFamily: env.fontSemiBold,
    color: colors.black,
    marginBottom: 2,
  },
  priceLabel: {
    fontSize: 14,
    fontFamily: env.fontMedium,
    color: colors.lightBlack,
  },
  qtyBtn: {
    height: 24,
    width: 24,
    backgroundColor: colors.blueLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  qtyBtnText: {
    fontSize: 16,
    fontFamily: env.fontSemiBold,
    color: colors.white,
  },
});
