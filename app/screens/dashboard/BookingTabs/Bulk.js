import React from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    FlatList,
    SafeAreaView,
    Dimensions,
    Image,
    Keyboard,
    RefreshControl
} from 'react-native'
import { connect } from 'react-redux'
import colors from '../../../constants/colors'
import env from '../../../constants/env'
import { Shadow } from 'react-native-neomorph-shadows'
import { SearchInputField } from '../../../components/InputField'
import { getProduct } from '../../../actions'

const { width } = Dimensions.get('screen')

class Bulk extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            searchText: '',
            refreshing: false
        }
    }

    componentDidMount() {
        this.initData()
    }

    initData = async () => {
        let res = await getProduct()
        if (res.status) {
            this.data = res.data
            this.setState({ data: res.data, refreshing: false })
        } else {
            this.setState({ refreshing: false })
        }
    }

    onRefresh = () => {
        this.setState({ refreshing: true })
        this.initData()
    }

    _search = (searchText) => {
        this.setState({ searchText })
        searchText = searchText.trim();
        if (searchText === '') return this.setState({ data: this.data })
        if (searchText.length < 3) {
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout)
                this.searchTimeout = null
            }
            return null
        }
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout)
            this.searchTimeout = null
        }
        this.searchTimeout = setTimeout(async () => {
            const searchData = await getProduct({ query: searchText })
            if (this.state.searchText && searchData.status) this.setState({ data: searchData.data })
            this.searchTimeout = null
        }, 300)
    }

    render() {
        const { data } = this.state
        return (
            <View style={styles.root}>
                <FlatList
                    data={data}
                    keyExtractor={(it, i) => String(i)}
                    renderItem={this.renderItem}
                    ListHeaderComponent={this.renderHeader}
                    numColumns={2}
                    contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 10, flexGrow: 1 }}
                    ListEmptyComponent={this.renderEmpty}
                    refreshControl={
                        <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} colors={['#018CFF']} />
                    }
                />
                <SafeAreaView />
            </View>
        )
    }

    renderHeader = () => {
        return (
            <SearchInputField
                value={this.state.searchText}
                onChangeText={this._search}
                onSubmitEditing={() => {
                    Keyboard.dismiss()
                }}
            />
        )
    }

    renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.item}
                onPress={() => this.props.navigation.navigate('bulkProductDetails', { data: item })}
            >
                <Shadow
                    style={{
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.2,
                        shadowColor: colors.gray,
                        shadowRadius: 10,
                        backgroundColor: colors.white,
                        width: width / 2 - 50,
                        height: width / 2 - 50,
                        borderRadius: 20
                    }}
                >
                    <View
                        style={{ flex: 1, overflow: 'hidden', borderRadius: 30 }}
                    >
                        <Image
                            source={{ uri: item.image }}
                            style={{ height: '100%', width: '100%' }}
                        />
                    </View>
                </Shadow>
                <View style={{ height: 10 }} />
                <Text numberOfLines={1} style={styles.itemTitle}>{item.name}</Text>
                <Text numberOfLines={1} style={styles.itemTitle}>{item.supplier?.name}</Text>
                <Text numberOfLines={1} style={styles.itemDesc}><Text style={{ color: colors.black }}>Rs: {item.sell_price}</Text>  |  Weight: {item.measurement_value}</Text>
            </TouchableOpacity>
        )
    }

    renderEmpty = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: env.fontRegular, color: colors.gray }}>{this.state.errorMessage || 'No product found.'}</Text>
            </View>
        )
    }
}

export default connect()(Bulk)

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
        width: width / 2 - 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    itemTitle: {
        fontSize: 15,
        fontFamily: env.fontPoppinsRegular,
        color: '#515151',
        textAlign: 'center'
    },
    itemDesc: {
        fontSize: 13,
        fontFamily: env.fontPoppinsRegular,
        color: '#515151',
        textAlign: 'center'
    }
})
