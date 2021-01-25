import React from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    StatusBar,
    FlatList,
    SafeAreaView,
    Platform,
    Dimensions,
    TextInput,
    Image,
    Keyboard
} from 'react-native'
import { connect } from 'react-redux'
import colors from '../../constants/colors'
import env from '../../constants/env'
import { filterIcon, notificationIcon, searchIcon, bottlePlaceholder, hambargIcon, closeCircleIcon } from '../../assets'
import { IconButton } from '../../components/Button'
import { Shadow } from 'react-native-neomorph-shadows'
import Header from '../../components/Header'
import { SearchInputField } from '../../components/InputField'
import { getVendorProducts } from '../../actions'

const { width } = Dimensions.get('screen')

class MyProducts extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            searchText: '',
            isSearch: false
        }
    }

    componentDidMount() {
        this.initData()
    }

    initData = async () => {
        let res = await getVendorProducts()
        if (res.status) {
            this.data = res.data
            this.setState({ data: res.data })
        }
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
            const searchData = await getVendorProducts({ query: searchText })
            if (this.state.searchText && searchData.status) this.setState({ data: searchData.data })
            this.searchTimeout = null
        }, 300)
    }

    render() {
        const { data, isSearch } = this.state
        return (
            <View style={styles.root}>


                <StatusBar backgroundColor={colors.blueLight} barStyle='light-content' />
                <View style={{ backgroundColor: colors.blueLight, paddingBottom: 60, marginBottom: -40 }}>
                    <SafeAreaView />
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: 5
                    }}
                    >
                        <View style={[styles.row, { flex: 1 }]}>
                            <IconButton
                                icon={hambargIcon}
                                containerStyle={{ marginHorizontal: 5 }}
                                onPress={() => this.props.navigation.openDrawer()}
                            />
                            <View style={{ flex: 1 }}>

                                {
                                    isSearch ? (
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                flex: 1,
                                                height: 40,
                                                backgroundColor: colors.white,
                                                paddingHorizontal: 10,
                                                borderRadius: 50,
                                                marginRight: 15
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    flex: 1
                                                }}
                                            >
                                                <Image
                                                    source={searchIcon}
                                                    style={{ tintColor: '#707070', width: 18, height: 18, marginRight: 10 }}
                                                    resizeMode='contain'
                                                />
                                                <TextInput
                                                    placeholder='Search'
                                                    placeholderTextColor='#858585'
                                                    style={{ flex: 1, fontFamily: env.fontRegular }}
                                                    value={this.state.searchText}
                                                    onChangeText={this._search}
                                                    onSubmitEditing={() => {
                                                        Keyboard.dismiss()
                                                    }}
                                                />
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    if (this.state.searchText) this.setState({ searchText: '' })
                                                    else this.setState({ isSearch: false }, () => { this.initData() })
                                                }}
                                            >
                                                <Image
                                                    source={closeCircleIcon}
                                                    style={{ tintColor: '#707070', width: 18, height: 18, marginTop: -3 }}
                                                    resizeMode='contain'
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                            <Text style={styles.headerTitle}>Home</Text>
                                        )
                                }

                            </View>
                        </View>
                        {
                            !isSearch ? (
                                <IconButton
                                    icon={isSearch ? closeIcon : searchIcon}
                                    onPress={() => this.setState({ isSearch: !isSearch })}
                                    iconStyle={{ tintColor: colors.white }}
                                />
                            ) : null
                        }

                    </View>
                </View>

                {/* <StatusBar backgroundColor={colors.blueLight} barStyle='light-content' />
                <Header
                    title='My products'
                /> */}
                <View style={styles.container}>
                    <FlatList
                        data={data}
                        keyExtractor={(it, i) => String(i)}
                        renderItem={this.renderItem}
                        numColumns={2}
                        contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 10, flexGrow: 1 }}
                        ListEmptyComponent={this.renderEmpty}
                        // ListHeaderComponent={this.renderHeader}
                    />
                </View>
                <SafeAreaView />
            </View>
        )
    }

    // renderHeader = () => {
    //     return (
    //         <SearchInputField
    //             value={this.state.searchText}
    //             onChangeText={this._search}
    //             onSubmitEditing={() => {
    //                 Keyboard.dismiss()
    //             }}
    //         />
    //     )
    // }

    renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.item}
                onPress={() => this.props.navigation.navigate('vendorProductDetails', { data: item })}
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
                <View style={{ marginTop: 10, marginHorizontal: 20, flex: 1 }}>
                    <Text numberOfLines={1} style={styles.itemTitle}>{item.name}</Text>
                    <Text numberOfLines={1} style={styles.itemDesc}><Text style={{ color: colors.black }}>Rs: {item.sell_price}</Text>  |  Weight: {item.measurement_value}</Text>
                </View>
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

export default connect()(MyProducts)

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
    verticalDivider: {
        backgroundColor: colors.blueLight,
        width: 6,
        height: '100%',
        marginRight: 10
    },
    listTitle: {
        fontFamily: env.fontPoppinsSemiBold,
        fontSize: 16,
        color: colors.lightBlack,
        marginTop: 3
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
    },
    itemDesc: {
        fontSize: 13,
        fontFamily: env.fontPoppinsRegular,
        color: '#515151',
    },
    serviceTitle: {
        fontSize: 14,
        fontFamily: env.fontPoppinsRegular,
        color: colors.lightBlack,
        paddingLeft: 5,
        marginTop: 5
    },
    stockText: {
        fontSize: 13,
        fontFamily: env.fontPoppinsRegular,
        color: '#515151',
    },
    headerTitle: {
        fontSize: 19,
        fontFamily: env.fontOSSemiBold,
        color: colors.white
    }
})