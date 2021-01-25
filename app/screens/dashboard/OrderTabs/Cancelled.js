import moment from 'moment'
import React, { Component } from 'react'
import { Dimensions, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { cancelCustomerOrder, getCustomerOrders, repeatCustomerOrder, rootLoader } from '../../../actions'
import Header from '../../../components/Header'
import colors from '../../../constants/colors'
import env from '../../../constants/env'

const { width } = Dimensions.get('screen')

class Cancelled extends Component {

    state = {
        refreshing: false
    }

    initData = async () => {
        let res = await this.props.getCustomerOrders()
        this.props.rootLoader(false)
        this.setState({ refreshing: false })
    }

    onRefresh = () => {
        this.setState({ refreshing: true })
        this.initData()
    }

    _orderAction = async (request) => {
        if (request.order_status === 4) {
            await repeatCustomerOrder(request.id)
        } else {
            await cancelCustomerOrder(request.id)
        }
        this.initData()
    }

    render() {
        return (
            <View style={styles.root}>
                <FlatList
                    data={this.props.canceledOrders}
                    keyExtractor={(it, i) => String(i)}
                    renderItem={this.renderItem}
                    contentContainerStyle={{ flexGrow: 1, paddingTop: 10 }}
                    ListEmptyComponent={this.renderEmpty}
                    refreshControl={
                        <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} colors={['#018CFF']} />
                    }
                />

            </View>
        )
    }

    renderItem = ({ item }) => {

        let status = ''
        if (item.order_status === 0) status = 'pending'
        else if (item.order_status === 1) status = 'accepted'
        else if (item.order_status === 3) status = 'Assigned'
        else if (item.order_status === 4) status = 'completed'
        else if (item.order_status === 5) status = 'canceled'

        return (
            <TouchableOpacity
                style={{ borderBottomWidth: 0.5, padding: 20, borderBottomColor: 'rgba(130, 130, 130, 0.3)' }}
                onPress={() => this.props.navigation.navigate('orderDetails', { data: item })}
                activeOpacity={1}
            >
                <Text numberOfLines={1} style={styles.itemTitle}>Order ID: {item?.id}   |   Rs {item?.total_amount} ({item.payment_method === 1 ? 'COD' : 'Prepaid'})</Text>
                <View style={{ justifyContent: 'space-between', flex: 1, marginTop: 5 }}>
                    <Text style={{ fontFamily: env.fontMedium, color: '#474747', fontSize: 13 }}>Delivery on : {moment(new Date(item.delivery_date)).format('Do MMMM, YYYY')}</Text>
                    <Text numberOfLines={1} style={[styles.itemTitle, { fontSize: 13 }]}>Booking : {item.order_type === 1 ? 'Instant' : 'Schedule'} order</Text>
                    <View style={styles.row}>
                        <TouchableOpacity>
                            <Text style={styles.btnText}>{status}</Text>
                        </TouchableOpacity>
                        {
                            item.order_status !== 5 && (
                                <>
                                    <View style={{ width: 2, backgroundColor: colors.blueLight, height: '80%', marginHorizontal: 15 }} />
                                    <TouchableOpacity
                                        onPress={() => this._orderAction(item)}
                                    >
                                        <Text style={styles.btnText}>
                                            {item.order_status === 4 ? 'Repeat' : 'Cancel'}
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            )
                        }

                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    renderEmpty = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: env.fontRegular, color: colors.gray }}>{this.state.errorMessage || 'No order found.'}</Text>
            </View>
        )
    }

}

function mapStateToProps({ user }) {
    return {
        orderHistories: user.orderHistories,
        canceledOrders: user.canceledOrders
    }
}

export default connect(mapStateToProps, {
    getCustomerOrders,
    rootLoader
})(Cancelled)

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
        fontFamily: env.fontMedium,
        color: '#3F3F3F',
        marginBottom: 5
    },
    btnText: {
        fontSize: 14,
        fontFamily: env.fontMedium,
        color: colors.blueLight
    }
})
