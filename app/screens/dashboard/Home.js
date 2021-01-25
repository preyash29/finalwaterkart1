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
    ScrollView,
    Image,
    Keyboard,
    RefreshControl,
    TextInput
} from 'react-native'
import { connect } from 'react-redux'
import colors from '../../constants/colors'
import env from '../../constants/env'
import { closeCircleIcon, closeIcon, filterIcon, hambargIcon, searchIcon } from '../../assets'
import { IconButton } from '../../components/Button'
import { Shadow } from 'react-native-neomorph-shadows'
import OffersSwoper from '../../components/OffersSwoper'
import Header from '../../components/Header'
import { getCustomerHome, rootLoader, getSuppliers, getAddressList, getWalletTransactions, updateCardItems } from '../../actions'
import FliterDialog from '../../components/Dialog/FliterDialog'
import { SearchInputField } from '../../components/InputField'

const { width } = Dimensions.get('screen')

class Home extends React.Component {
    constructor() {
        super()
        this.data = []
        this.state = {
            products: null,
            services: null,
            offers: null,
            filterVisible: false,
            isSearch: false,
            searchText: '',
            refreshing: false,
        }
    }

    componentDidMount() {
        if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor = colors.blueLight
            StatusBar.setBarStyle = 'light-content'
        }

        this.initData()
        this.props.getSuppliers()
        this.props.getAddressList()
        this.props.getWalletTransactions()
        this.props.updateCardItems()
    }

    initData = async () => {
        this.props.rootLoader(true)
        let res = await this.props.getCustomerHome()
        this.props.rootLoader(false)
        if (res.status) {
            this.data = res.data
            this.setState({ products: res.data?.products, services: res.data?.services, offers: res.data?.offers, refreshing: false })
        } else {
            this.setState({ refreshing: false })
        }
    }

    onRefresh = () => {
        this.setState({ refreshing: true })
        this.initData()
    }

    _filterData = async (data) => {
        this.setState({ filterVisible: false })
        this.props.rootLoader(true)
        let res = await this.props.getCustomerHome({
            supplier_id: data.supplier,
            min_price: data.min,
            max_price: data.max
        })
        this.props.rootLoader(false)
        if (res.status) {
            this.data = res.data
            this.setState({ products: res.data?.products, services: res.data?.services, offers: res.data?.offers })
        }
    }

    _resetFilter = () => {
        this.initData()
        this.setState({ filterVisible: false })
    }

    _search = (searchText) => {
        this.setState({ searchText })
        searchText = searchText.trim();
        if (searchText === '') {
            this.setState({ products: this.data?.products, services: this.data?.services, offers: this.data?.offers })
        }
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
            const searchData = await this.props.getCustomerHome({ query: searchText })
            if (this.state.searchText && searchData.status) {
                this.setState({ products: searchData.data?.products, services: searchData.data?.services, offers: searchData.data?.offers })
            }
            this.searchTimeout = null
        }, 300)
    }

    render() {
        const { products, offers, services, filterVisible, isSearch } = this.state
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
                                                    else this.setState({ isSearch: false }, () => {this.initData()})
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
                                <View style={styles.row}>
                                    <IconButton
                                        icon={filterIcon}
                                        onPress={() => this.setState({ filterVisible: true })}
                                    />
                                    <IconButton
                                        icon={isSearch ? closeIcon : searchIcon}
                                        onPress={() => this.setState({ isSearch: !isSearch })}
                                        iconStyle={{ tintColor: colors.white }}
                                    />
                                </View>
                            ) : null
                        }

                    </View>
                </View>

                {/* {
                    isSearch ? (
                        <SearchInputField
                            value={this.state.searchText}
                            onChangeText={this._search}
                            onSubmitEditing={() => {
                                Keyboard.dismiss()
                            }}
                        />
                    ) : (
                            <Header
                                title='Home'
                                right={
                                    <View style={styles.row}>
                                        <IconButton
                                            icon={filterIcon}
                                            onPress={() => this.setState({ filterVisible: true })}
                                        />
                                        <IconButton
                                            icon={searchIcon}
                                            onPress={() => this.setState({ isSearch: !isSearch })}
                                        />
                                    </View>
                                }
                            />
                        )
                } */}

                <View style={styles.container}>
                    <ScrollView
                        refreshControl={
                            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} colors={['#018CFF']} />
                        }
                    >

                        {/* OFFER SWIPER */}
                        {
                            offers && !isSearch ? (
                                <>
                                    <View style={{ padding: 20, flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                        <View style={styles.row}>
                                            <View style={styles.verticalDivider} />
                                            <Text style={styles.listTitle}>Offers</Text>
                                        </View>
                                        <TouchableOpacity
                                            style={{ paddingHorizontal: 10, marginTop: 5 }}
                                            onPress={() => this.props.navigation.navigate('offers')}
                                        >
                                            <Text style={{ fontFamily: env.fontPoppinsSemiBold, fontSize: 14, color: colors.lightBlack }}>View All</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <OffersSwoper data={offers} />
                                    <View style={{ height: 50 }} />
                                </>
                            ) : null
                        }

                        <FlatList
                            data={products}
                            keyExtractor={(it, i) => String(i)}
                            renderItem={this.renderItem}
                            numColumns={2}
                            contentContainerStyle={{ paddingVertical: 10 }}
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                        />
                        {
                            services && services?.length > 0 && (
                                <>
                                    <View style={[styles.row, { marginHorizontal: 20, marginBottom: 30 }]}>
                                        <View style={styles.verticalDivider} />
                                        <Text style={styles.listTitle}>Ro Units services</Text>
                                    </View>
                                    <FlatList
                                        data={services}
                                        keyExtractor={(it, i) => String(i)}
                                        renderItem={this.renderServiceItem}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{ paddingVertical: 10, paddingRight: 20 }}
                                    />
                                </>
                            )
                        }

                    </ScrollView>
                </View>
                <SafeAreaView />

                {/* Hidden Components */}

                <FliterDialog
                    isVisible={filterVisible}
                    onClose={() => this.setState({ filterVisible: false })}
                    onFliter={this._filterData}
                    onReset={this._resetFilter}
                />

            </View>
        )
    }

    renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.item}
                onPress={() => this.props.navigation.navigate('productDetails', { data: item })}
            >
                <Shadow
                    style={{
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.2,
                        shadowColor: colors.gray,
                        shadowRadius: 10,
                        backgroundColor: colors.white,
                        width: width / 2 - 40,
                        height: width / 2 - 40,
                        borderRadius: 30,
                        marginHorizontal: 20
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

    renderServiceItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={{ marginLeft: 20 }}
                onPress={() => this.props.navigation.navigate('serviceBooking', { data: item })}
            >
                <View style={{ borderRadius: 20, overflow: 'hidden', zIndex: 1 }}>
                    <Image
                        source={{ uri: item.image }}
                        style={{ width: width / 3, height: width / 3, backgroundColor: '#f7f7f7' }}
                    />
                </View>
                <Text style={styles.serviceTitle}>Request{'\n'} for service</Text>
            </TouchableOpacity>
        )
    }
}

export default connect(null, {
    getCustomerHome,
    rootLoader,
    getSuppliers,
    getAddressList,
    getWalletTransactions,
    updateCardItems
})(Home)

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
        width: width / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40
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
    },
    serviceTitle: {
        fontSize: 14,
        fontFamily: env.fontPoppinsRegular,
        color: colors.lightBlack,
        paddingLeft: 5,
        marginTop: 5
    },
    headerTitle: {
        fontSize: 19,
        fontFamily: env.fontOSSemiBold,
        color: colors.white
    }
})
