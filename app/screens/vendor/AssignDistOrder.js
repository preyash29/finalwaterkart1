import React from 'react'
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { assignToDistributorList, assignToDistributor } from '../../actions'
import { backIcon } from '../../assets'
import { IconButton } from '../../components/Button'
import Header from '../../components/Header'
import colors from '../../constants/colors'
import env from '../../constants/env'

const { width } = Dimensions.get('screen')

class AssignDistOrder extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            preData: props.route.params?.data,
            data: null
        }
    }

    async componentDidMount() {
        let res = await assignToDistributorList()
        if (res.status) {
            this.setState({ data: res.data })
        }
    }

    _assign = async (data) => {
        if(this.props.route.params?.callback){
            this.props.route.params?.callback(data?.distributor)
            return this.props.navigation.goBack()
        }
        let res = await this.props.assignToDistributor({
            order_id: this.state.preData.id,
            distributor_id: data.distributor_id
        })
        if (res.status) {
            return this.props.navigation.navigate('home')
        }
    }


    render() {
        return (
            <View style={styles.root}>
                <Header
                    title='Assign order to Distributor'
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
      
        return (
            <View style={styles.item}>
                <View>
                    <Text style={styles.itemTitle}>{item?.distributor.first_name} {item?.distributor.last_name}</Text>
                    <Text style={styles.mobileText}>+91 {item?.distributor.mobile}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => this._assign(item)}
                >
                    <Text style={[styles.assignText, { marginRight: 10, marginBottom: 2 }]}>Assign</Text>
                </TouchableOpacity>
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
    assignToDistributor
})(AssignDistOrder)

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
