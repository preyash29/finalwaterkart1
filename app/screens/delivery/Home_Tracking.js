import React from 'react'
import { View, StyleSheet, Text, Image } from 'react-native'
import { connect } from 'react-redux'
import { clockIcon, markerpinIcon, notificationIcon } from '../../assets'
import { IconButton } from '../../components/Button'
import Header from '../../components/Header'
import colors from '../../constants/colors'
import env from '../../constants/env'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import locationService from '../../utils/locationService'

class DeliveryHome extends React.Component {
    constructor() {
        super()

        this.state = {
            delivery: null
        }
    }

    componentDidMount() {
        this.initData()
    }

    initData = async () => {
        try {
            let res = await locationService()
            this.setState({ delivery: res })
        } catch (error) {
            console.log(error)
        }
    }

    render() {

        const { delivery } = this.state

        return (
            <View style={styles.root}>
                <Header
                    title='Home'
                    right={
                        <IconButton
                            icon={notificationIcon}
                        />
                    }
                />

                <View style={styles.container} >
                <View style={{ padding: 20, backgroundColor: 'rgba(1, 140, 255, 0.07)', flexDirection: 'row', justifyContent: 'center' }}>
                    <Image
                        source={clockIcon}
                        style={{ height: 17, width: 17, resizeMode: 'contain', marginTop: 3, marginRight: 10 }}
                    />
                    <View>
                        <Text style={styles.topText}>Your upcoming task at</Text>
                        <Text style={[styles.topText, { fontFamily: env.fontPoppinsMedium }]}>3:00pm</Text>
                    </View>
                </View>

                <MapView
                    style={styles.container}
                    // provider={PROVIDER_GOOGLE}
                    region={{
                        latitude: 37.4219983, longitude: -122.084, latitudeDelta: .1, longitudeDelta: 1
                    }}
                >
                    {delivery && (
                        <>
                            <Marker coordinate={delivery}>
                                <Image
                                    source={markerpinIcon}
                                    style={{ height: 40, width: 40, resizeMode: 'contain' }}
                                />
                            </Marker>
                            <MapView.Circle
                                center={delivery}
                                radius={10000}
                                strokeWidth={0}
                                fillColor='rgba(6, 107, 154, 0.18)'
                            />
                        </>
                    )}
                </MapView>
            </View>
            </View>
        )
    }
}

export default DeliveryHome

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
    topText: {
        fontFamily: env.fontPoppinsRegular,
        fontSize: 15,
        color: colors.blueLight,
        textAlign: 'center'
    },
})
