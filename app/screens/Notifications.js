import React from 'react'
import { StyleSheet, View, FlatList, Text } from 'react-native'
import { connect } from 'react-redux'
import { backIcon } from '../assets'
import { IconButton } from '../components/Button'
import Header from '../components/Header'
import colors from '../constants/colors'
import env from '../constants/env'

class Notifications extends React.Component {
    render() {
        return (
            <View style={styles.root}>
                <Header
                    title='Notification'
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
                        data={[{}, {}]}
                        keyExtractor={(it, i) => String(i)}
                        renderItem={this.renderItem}
                        contentContainerStyle={{ flexGrow: 1, padding: 20 }}
                    />

                </View>

            </View>
        )
    }

    renderItem = ({ item }) => {
        return (
            <View style={styles.item}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.title}>Notification Item</Text>
                    <Text style={styles.time}>2 min ago</Text>
                </View>
                <View style={{ height: 5 }} />
                <Text style={styles.desc}>Lorem Ipsum is simply dummy text of the printing and typesetting industry</Text>
            </View>
        )
    }

}

export default connect()(Notifications)

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
    title: {
        fontFamily: env.fontPoppinsMedium,
        fontSize: 16,
        color: colors.lightBlack,
    },
    time: {
        fontFamily: env.fontPoppinsMedium,
        fontSize: 13,
        color: colors.blueLight,
    },
    desc: {
        fontFamily: env.fontPoppinsRegular,
        fontSize: 13,
        color: colors.lightBlack,
    },
    item: {
        backgroundColor: 'rgba(75, 75, 75, 0.14)',
        marginTop: 10,
        padding: 15,
        borderRadius: 5
    }
})
