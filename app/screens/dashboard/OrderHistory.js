import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import React, { Component } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { rootLoader, getCustomerOrders } from '../../actions'
import Header from '../../components/Header'
import colors from '../../constants/colors'
import env from '../../constants/env'
import Orders from './OrderTabs/Orders'
import Cancelled from './OrderTabs/Cancelled'


const Tab = createMaterialTopTabNavigator()

const { width } = Dimensions.get('screen')

class OrderHistory extends Component {

    constructor() {
        super()

        this.state = {
            data: null,
            refreshing: false
        }
    }

    componentDidMount() {
        // this.props.rootLoader(true)
        this.initData()
        // this.focusNavigation = this.props.navigation.addListener('focus', this.initData);
    }

    // componentWillUnmount() {
    //     this.focusNavigation()
    // }

    initData = async () => {
        let res = await this.props.getCustomerOrders()
        this.props.rootLoader(false)
        // if (res.status) {
        //     this.setState({ data: res.data, refreshing: false })
        // } else {
        //     this.setState({ refreshing: false })
        // }
    }

    // onRefresh = () => {
    //     this.setState({ refreshing: true })
    //     this.initData()
    // }

    // _orderAction = async (request) => {
    //     if (request.order_status === 4) {
    //         await repeatCustomerOrder(request.id)
    //     } else {
    //         await cancelCustomerOrder(request.id)
    //     }
    //     this.initData()
    // }

    render() {
        return (
            <View style={styles.root}>
                <Header
                    title='My Order'
                />
                <View style={styles.container}>

                    <Tab.Navigator
                        tabBarOptions={{
                            showIcon: false,
                            activeTintColor: colors.blueLight,
                            inactiveTintColor: '#707070',
                            labelStyle: {
                                fontFamily: env.fontOSBold,
                                textTransform: 'capitalize'
                            },
                            indicatorStyle: {
                                borderBottomColor: colors.blueLight,
                                borderBottomWidth: 1
                            },
                            style: {
                                borderBottomWidth: 0,
                                elevation: 0
                            }
                        }}
                    >
                        <Tab.Screen name='Orders' component={Orders} />
                        <Tab.Screen name='Cancelled' component={Cancelled} />
                    </Tab.Navigator>

                </View>

            </View>
        )
    }



}

export default connect(null, {
    getCustomerOrders,
    rootLoader
})(OrderHistory)

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
