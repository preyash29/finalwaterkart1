import React from 'react'
import { View, StyleSheet, Text, SectionList, Image, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import colors from '../../../constants/colors'
import env from '../../../constants/env';
import { locationIcon } from '../../../assets';
import { getVendorCustomerOrders, rootLoader } from '../../../actions';

class PassbookAll extends React.Component {

    state = {
        data: null,
        refreshing: false
    }

    componentDidMount() {
        this.props.rootLoader(true)
        this.initData()
    }

    initData = async () => {
        let res = await getVendorCustomerOrders()
        this.props.rootLoader(false)
        if (res.status) {
            let data = []

            Object.keys(res.data).map((key) => {
                data.push({
                    title: key,
                    data: res.data[key]
                })
            })
            this.setState({ data, refreshing: false })
        } else {
            this.setState({ refreshing: false })
        }
    }

    onRefresh = () => {
        this.setState({ refreshing: true })
        this.initData()
    }

    render() {
        return (
            <View style={styles.root}>
                <SectionList
                    sections={this.state.data}
                    keyExtractor={(it, index) => String(index)}
                    renderItem={this.renderItem}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={styles.sectionHeader}>{title}</Text>
                    )}
                    contentContainerStyle={{ marginLeft: 20, flexGrow: 1 }}
                    ListEmptyComponent={this.renderEmpty}
                    refreshControl={
                        <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} colors={['#018CFF']} />
                      }
                />


            </View>
        )
    }

    renderEmpty = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: env.fontRegular, color: colors.gray }}>No result found.</Text>
            </View>
        )
    }

    renderItem = ({ item }) => {
        return (
            <View style={styles.item}>
                <Text style={styles.userName}>{item.customer?.first_name} {item.customer?.last_name}</Text>
                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.userName}>User’s name</Text>
                    <Image source={arrowrightIcon} style={{ resizeMode: 'contain', width: 15, height: 15 }} />
                </View> */}
                {/* <View margin={5} />
                <View style={styles.row}>
                    <Image source={locationIcon} style={styles.itemIcon} />
                    <Text numberOfLines={1} style={[styles.otherText, { flex: 1 }]}>{item.delivery_address?.floor_info}, {item.delivery_address?.landmark}</Text>
                </View> */}
                <View margin={5} />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text numberOfLines={1} style={[styles.otherText, { flex: 1, flexWrap: 'wrap' }]}>Total amount Rs. {item.total_amount}</Text>
                    <Text numberOfLines={1} style={[styles.otherText, { flex: 1, flexWrap: 'wrap' }]}>Commision amount Rs. {item.commission_amount}</Text>
                </View>
                <View margin={5} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[styles.otherText, { color: colors.blueLight }]}>Delivery at {item.delivery_date}</Text>
                    <Text style={[styles.otherText, { color: '#2E2E2E' }]}>{item.unique_id}</Text>
                </View>
            </View>
        )
    }
}

export default connect(null, {
    rootLoader
})(PassbookAll)

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
    item: {
        justifyContent: 'space-between',
        borderBottomWidth: 2,
        borderBottomColor: '#D7D7D7',
        paddingVertical: 15,
        paddingRight: 20
    },
    sectionHeader: {
        fontFamily: env.fontSemiBold,
        fontSize: 16,
        color: colors.black,
        marginTop: 20
    },

    userName: {
        fontFamily: env.fontMedium,
        fontSize: 15,
        color: '#333639',
    },
    row: {
        flexDirection: 'row'
    },
    itemIcon: {
        resizeMode: 'contain',
        width: 14,
        height: 14,
        marginRight: 10,
        tintColor: '#616161'
    },
    otherText: {
        fontFamily: env.fontMedium,
        fontSize: 13,
        color: '#616161',
        marginTop: -3
    },

})
