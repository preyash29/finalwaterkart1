import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import React, { Component } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { rootLoader, getCustomerServices } from '../../actions'
import Header from '../../components/Header'
import colors from '../../constants/colors'
import env from '../../constants/env'
import Request from './ServiceTab/Request'
import Closed from './ServiceTab/Closed'


const Tab = createMaterialTopTabNavigator()

const { width } = Dimensions.get('screen')

class MyServices extends Component {

    constructor() {
        super()

        this.state = {
            data: null,
            refreshing: false
        }
    }

    componentDidMount() {
        this.props.rootLoader(true)
        this.initData()
    }


    initData = async () => {
        let res = await this.props.getCustomerServices()
        this.props.rootLoader(false)
    }


    render() {
        return (
            <View style={styles.root}>
                <Header
                    title='My Services'
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
                        <Tab.Screen name='Request' component={Request} />
                        <Tab.Screen name='Closed' component={Closed} />
                    </Tab.Navigator>

                </View>

            </View>
        )
    }



}

export default connect(null, {
    getCustomerServices,
    rootLoader
})(MyServices)

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
