import React, { Component } from 'react'
import { Dimensions, FlatList, Image, Keyboard, PermissionsAndroid, Platform, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { distributorHome } from '../../actions'
import { arrowrightIcon, locationIcon } from '../../assets'
import Avatar from '../../components/Avatar'
import Header from '../../components/Header'
import { SearchInputField } from '../../components/InputField'
import colors from '../../constants/colors'
import env from '../../constants/env'

const { width } = Dimensions.get('screen')

class Home extends Component {

    constructor() {
        super()

        this.state = {
            searchText: '',
            data: null
        }
    }

    componentDidMount() {
        if(Platform.OS === 'android'){
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
        }
        this.initData()
    }

    initData = async () => {
        let res = await distributorHome()
        if (res.status) {
            this.data = res.data
            this.setState({ data: res.data?.vendors })
        }
    }


    // _search = (searchText) => {
    //     this.setState({ searchText })
    //     searchText = searchText.trim();
    //     if (searchText === '') {
    //         this.setState({ products: this.data?.products, services: this.data?.services, offers: this.data?.offers })
    //     }
    //     if (searchText.length < 3) {
    //         if (this.searchTimeout) {
    //             clearTimeout(this.searchTimeout)
    //             this.searchTimeout = null
    //         }
    //         return null
    //     }
    //     if (this.searchTimeout) {
    //         clearTimeout(this.searchTimeout)
    //         this.searchTimeout = null
    //     }
    //     this.searchTimeout = setTimeout(async () => {
    //         const searchData = await this.props.getCustomerHome({ query: searchText })
    //         if (this.state.searchText && searchData.status) {
    //             this.setState({ products: searchData.data?.products, services: searchData.data?.services, offers: searchData.data?.offers })
    //         }
    //         this.searchTimeout = null
    //     }, 300)
    // }

    render() {
        const { data } = this.state
        return (
            <View style={styles.root}>
                <Header
                    title='My Vendors'
                    
                />
                <View style={styles.container}>

                    <View style={{ alignSelf: 'center', marginTop: 5 }}>
                        <SearchInputField
                            value={this.state.searchText}
                            onChangeText={this._search}
                            onSubmitEditing={() => {
                                Keyboard.dismiss()
                            }}
                            costomStyle={{ width: width - 80, marginBottom: 10 }}
                        />
                    </View>
                    <FlatList
                        data={data}
                        keyExtractor={(it, i) => String(i)}
                        renderItem={this.renderItem}
                        contentContainerStyle={{ flexGrow: 1 }}
                        ListEmptyComponent={this.renderEmpty}
                    />

                </View>

            </View>
        )
    }

    renderItem = () => {
        return (
            <View
                style={{
                    borderBottomWidth: 1,
                    paddingVertical: 10,
                    borderBottomColor: '#CDCDCD',
                    marginLeft: 20,
                    marginTop: 10
                }}
            >
                <View style={styles.row}>
                    <Avatar
                        size={60}
                    />
                    <View style={{ justifyContent: 'space-between', flex: 1, marginLeft: 15 }}>
                        <Text numberOfLines={2} style={styles.itemTitle}>User’s name</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text numberOfLines={3} style={styles.itemTitle}>Vacation Date : 14 & 15th july,</Text>
                            <Image source={arrowrightIcon} style={styles.itemIcon}/>
                        </View>
                    </View>
                </View>
                <View style={[styles.row, { marginVertical: 10 }]}>
                    <Image source={locationIcon} style={styles.itemIcon} />
                    <Text numberOfLines={1} style={[styles.otherText, { flex: 1 }]}>Lorem Ipsum is simply dummy text of the printing and typesetting industry</Text>
                </View>
            </View>
        )
    }

    renderEmpty = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: env.fontRegular, color: colors.gray }}>{this.state.errorMessage || 'No vendor found.'}</Text>
            </View>
        )
    }

}

export default connect()(Home)

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
        fontFamily: env.fontPoppinsMedium,
        color: '#323232',
        // marginBottom: 5
    },
    otherText: {
        fontFamily: env.fontPoppinsRegular,
        fontSize: 14,
        color: '#616161',
        marginTop: -3
    },
    itemIcon: {
        resizeMode: 'contain',
        width: 14,
        height: 14,
        marginRight: 10,
        tintColor: '#616161'
    },
})
