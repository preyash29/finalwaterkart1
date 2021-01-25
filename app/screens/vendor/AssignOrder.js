import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, FlatList } from 'react-native'
import { Shadow } from 'react-native-neomorph-shadows'
import { connect } from 'react-redux'
import { notificationIcon, backIcon, bottlePlaceholder } from '../../assets'
import { IconButton } from '../../components/Button'
import colors from '../../constants/colors'
import env from '../../constants/env'
import Header from '../../components/Header'
import { vendormyDeliverymans, vendorAssignCustomerDevlieryman } from '../../actions'

const { width } = Dimensions.get('screen')

class AssignOrder extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            preData: props.route.params?.data,
            data: null
        }
    }

    async componentDidMount() {
        let res = await vendormyDeliverymans()
        if (res.status) {
            this.setState({ data: res.data })
        }
    }

    _assign = async (data) => {
        let res = await this.props.vendorAssignCustomerDevlieryman({
            order_id: this.state.preData.id,
            assign_user_id: data.deliveryman_id
        })
        if (res.status) {
            return this.props.navigation.navigate('home')
        }
    }


    render() {
        return (
            <View style={styles.root}>
                <Header
                    title='Assign Order'
                    left={
                        <IconButton
                            icon={backIcon}
                            containerStyle={{ marginHorizontal: 5 }}
                            onPress={() => this.props.navigation.goBack()}
                        />
                    }
                />
                <View style={styles.container}>
                    <FlatList
                        data={this.state.data}
                        keyExtractor={(it, i) => String(i)}
                        renderItem={this.renderItem}
                        contentContainerStyle={{ flexGrow: 1, paddingVertical: 20 }}
                        ListEmptyComponent={this.renderEmpty}
                    />
                </View>

            </View>
        )
    }

    renderItem = ({ item }) => {
        const data = this.state.preData
        const status = data?.delivery_man?.id === item.deliveryman_id
        return (
            <View style={styles.item}>
                <View>
                    <Text style={styles.itemTitle}>{item?.deliveryman.first_name} {item?.deliveryman.last_name}</Text>
                    <Text style={styles.mobileText}>+91 {item?.deliveryman.mobile}</Text>
                </View>
                {
                    status ? (
                        <View
                            style={{ backgroundColor: colors.blueLight, borderRadius: 20, padding: 5 }}
                        >
                            <Text style={[styles.assignText, { color: colors.white, marginRight: 10, marginBottom: 2 }]}>Assigned</Text>
                        </View>
                    ) : (
                            <TouchableOpacity
                                onPress={() => this._assign(item)}
                            >
                                <Text style={[styles.assignText, { marginRight: 10, marginBottom: 2 }]}>Assign</Text>
                            </TouchableOpacity>
                        )
                }
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
}

export default connect(null, {
    vendorAssignCustomerDevlieryman
})(AssignOrder)

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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingVertical: 20,
        paddingRight: 20,
        marginLeft: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#CDCDCD'
    },
    itemTitle: {
        fontSize: 16,
        fontFamily: env.fontSemiBold,
        color: colors.black
    },
    mobileText: {
        fontSize: 14,
        fontFamily: env.fontRegular,
        color: colors.blueLight,
        marginTop: 5
    },
    assignText: {
        fontSize: 15,
        fontFamily: env.fontMedium,
        color: colors.black,
        marginRight: 20,
        marginLeft: 10
    }
})
