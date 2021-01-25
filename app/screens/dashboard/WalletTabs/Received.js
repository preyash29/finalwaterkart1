import React from 'react'
import { View, StyleSheet, RefreshControl, Text, SectionList } from 'react-native'
import { connect } from 'react-redux'
import colors from '../../../constants/colors'
import moment from "moment";
import env from '../../../constants/env';
import { getWalletTransactions } from '../../../actions';


class Recieved extends React.Component {

    state = {
        data: null,
        balance: 0,
        refreshing: false
    }
    componentDidMount() {
        this.initData()
    }

    initData = async () => {
        let res = await this.props.getWalletTransactions({ type: 2 })
        if (res.status) {
            let data = []
            Object.keys(res.data.wallet_transactions).map((key) => {
                data.push({
                    title: key,
                    data: res.data.wallet_transactions[key]
                })
            })
            this.setState({ data, balance: res.data.wallet, refreshing: false })
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
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                    refreshControl={
                        <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} colors={['#018CFF']} />
                    }
                />

            </View>
        )
    }

    renderItem = ({ item }) => {
        return (
            <View style={styles.item}>
                <View>
                    <Text style={styles.orderText}>{item.title}</Text>
                    <Text style={styles.orderTimeText}>{moment(Date(item.created_at)).format('hh:mm A')}, Debit</Text>
                </View>
                <Text style={styles.orderText}>+ Rs. {item.amount}</Text>
            </View>
        )
    }
}



export default connect(null, {
    getWalletTransactions
})(Recieved)

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.white
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#D7D7D7',
        paddingVertical: 15
    },
    sectionHeader: {
        fontFamily: env.fontBold,
        fontSize: 18,
        color: colors.black,
        marginBottom: 10,
        marginTop: 25
    },
    orderText: {
        fontFamily: env.fontSemiBold,
        fontSize: 15,
        color: '#525252',
    },
    orderTimeText: {
        fontFamily: env.fontMedium,
        fontSize: 13,
        color: '#525252',
        marginTop: 5
    }

})
