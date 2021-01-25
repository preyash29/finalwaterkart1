import React, { Component } from 'react'
import { Dimensions, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { getCustomerServices, rootLoader } from '../../../actions'
import colors from '../../../constants/colors'
import env from '../../../constants/env'
import moment from 'moment'

const { width } = Dimensions.get('screen')

class Request extends Component {

    state = {
        refreshing: false
    }

    initData = async () => {
        let res = await this.props.getCustomerServices()
        this.props.rootLoader(false)
        this.setState({ refreshing: false })
    }

    onRefresh = () => {
        this.setState({ refreshing: true })
        this.initData()
    }



    render() {
        return (
            <View style={styles.root}>
                <FlatList
                    data={this.props.requestServices}
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
        if (item?.status === 0) status = 'Pedding'
        else if (item?.status === 1) status = 'Accepted'
        else if (item?.status === 2) status = 'Reject'

        return (
            <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, padding: 20, borderBottomColor: 'rgba(130, 130, 130, 0.3)' }}
                activeOpacity={1}
            // onPress={() => this.props.navigation.navigate('serviceBooking', { data: item })}
            >
                <View style={{ borderRadius: 20, overflow: 'hidden', zIndex: 1, }}>
                    <Image
                        source={{ uri: item?.service?.image }}
                        style={{ width: 80, height: 80, backgroundColor: '#f7f7f7' }}
                    />
                </View>
                <View style={{ flex: 1, marginLeft: 20 }}>
                    <Text style={styles.serviceTitle}>{item?.service?.name}</Text>
                    <Text style={styles.serviceTitle}>Visit Date: {moment(new Date(item?.visit_date)).format('DD MMMM YYYY')}</Text>
                    <Text style={styles.serviceTitle}>service charge: Rs. {item?.service?.charge}</Text>
                    <Text style={styles.serviceTitle}>Status : <Text style={{ color: item?.status === 2 ? colors.red : item?.status === 1 ? 'green' : colors.primary }}>{status}</Text></Text>
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
        requestServices: user.requestServices
    }
}

export default connect(mapStateToProps, {
    getCustomerServices,
    rootLoader
})(Request)

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
