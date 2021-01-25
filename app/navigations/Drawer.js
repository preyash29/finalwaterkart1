import {
  createDrawerNavigator,
  DrawerContentScrollView, DrawerItem
} from '@react-navigation/drawer'
import { StackActions } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React, { useState } from 'react'
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { useDispatch, useSelector } from 'react-redux'
import { userLogout } from '../actions'
import {
  accountsIcon,
  announcedIcon, basketIcon, bookingIcon, donationIcon, homeDrawerIc,
  infoIcon, locationIcon,
  passbookIcon, referIcon,
  signoutIcon, subscriptionIcon,
  supportIcon, usernameIcon, walletIcon,
  watergallomIcon
} from '../assets'
import { IconButton } from '../components/Button'
import WarnDialog from '../components/Dialog/WarnDialog'
import colors from '../constants/colors'
import env from '../constants/env'
import ReferEarn from '../screens/comman/ReferEarn'
import AboutUS from '../screens/dashboard/AboutUS'
import AnnouceVacation from '../screens/dashboard/AnnouceVacation'
import Booking from '../screens/dashboard/Booking'
import Donate from '../screens/dashboard/Donate'
import HealthyYou from '../screens/dashboard/HealthyYou'
import MyAddresses from '../screens/dashboard/MyAddresses'
import MyProfile from '../screens/dashboard/MyProfile'
import MyServices from '../screens/dashboard/MyServices'
import MySubcription from '../screens/dashboard/MySubcription'
import Offers from '../screens/dashboard/Offers'
import OrderHistory from '../screens/dashboard/OrderHistory'
import ProductCart from '../screens/dashboard/ProductCart'
import Support from '../screens/dashboard/Support'
import Wallet from '../screens/dashboard/Wallet'
// Delivery Screen
import DeliveryHome from '../screens/delivery/Home'
import DeliveryOrderHistory from '../screens/delivery/OrderHistory'
// Distributor
// import DistributorHome from '../screens/distributor/Home'
import MyVendors from '../screens/distributor/MyVendors'
// import AnnoucedVacation from '../screens/distributor/AnnoucedVacation'
// import MyProducts from '../screens/distributor/AddVendor'
import distributorPassbook from '../screens/distributor/Passbook'
import AssignOrder from '../screens/vendor/AssignOrder'
// Vendor Screen
import VendorHome from '../screens/vendor/Home'
import VendorMyAccount from '../screens/vendor/MyAccount'
import VendorMyProducts from '../screens/vendor/MyProducts'
import Passbook from '../screens/vendor/Passbook'
import BottonTabNavigation from './BottonTabNavigation'

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

export default () => {
  const [progress, setProgress] = React.useState(new Animated.Value(0))
  const scale = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [1, 0.8]
  })
  const borderRadius = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [0, 16]
  })

  const animatedStyle = { borderRadius, transform: [{ scale }] }

  return (
    <View style={{ flex: 1 }}>
      <Drawer.Navigator
        initialRouteName='myAddresses'
        drawerType='slide'
        overlayColor='transparent'
        drawerStyle={styles.drawerStyles}
        contentContainerStyle={{ flex: 1 }}
        sceneContainerStyle={{ backgroundColor: colors.white }}
        drawerContent={(props) => {
          setProgress(props.progress)
          return <DrawerContent {...props} />
        }}
      >
        <Drawer.Screen name='Screens'>
          {props => <DrawerScreenStack {...props} style={animatedStyle} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    </View>
  )
}

// DRAWER SCREEN STACK HERE
const DrawerScreenStack = ({ style }) => {
  const currentUser = useSelector(({ user }) => user.currentUser)

  return (
    <Animated.View style={StyleSheet.flatten([styles.stack, style])}>
      <Stack.Navigator
        screenOptions={{
          headerTitle: null,
          headerShown: false
        }}
      >
        {/* CUSTOMER USER */}
        {
          currentUser?.user_type === 2 && (
            <>
              <Stack.Screen name='home' component={BottonTabNavigation} />
              <Stack.Screen name='wallet' component={Wallet} />
              <Stack.Screen name='orderHistory' component={OrderHistory} />
              <Stack.Screen name='myAddresses' component={MyAddresses} />
              <Stack.Screen name='annouceVacation' component={AnnouceVacation} />
              <Stack.Screen name='donate' component={Donate} />
              <Stack.Screen name='booking' component={Booking} />
              <Stack.Screen name='offers' component={Offers} />
              <Stack.Screen name='healthyYou' component={HealthyYou} />
              <Stack.Screen name='referEarn' component={ReferEarn} />
              <Stack.Screen name='myServices' component={MyServices} />
              <Stack.Screen name='mySubcription' component={MySubcription} />
              <Stack.Screen name='MyProfile' component={MyProfile} />
            </>
          )
        }
        {/* VENDOR USER */}
        {
          currentUser?.user_type === 3 && (
            <>
              <Stack.Screen name='home' component={VendorHome} />
              <Stack.Screen name='myAccount' component={VendorMyAccount} />
              {/* <Stack.Screen name='annoucedVacation' component={VendorAnnoucedVacation} /> */}
              <Stack.Screen name='myProducts' component={VendorMyProducts} />
              <Stack.Screen name='assignOrder' component={AssignOrder} />
              {/* <Stack.Screen name='ordersToDistributor' component={OrdersToDistributor} /> */}
              <Stack.Screen name='passbook' component={Passbook} />
              <Stack.Screen name='referEarn' component={ReferEarn} />
              <Stack.Screen name='cart' component={ProductCart} />
            </>
          )
        }
        {/* DISTRIBUTOR USER */}
        {
          currentUser?.user_type === 4 && (
            <>
              <Stack.Screen name='home' component={MyVendors} />
              {/* <Stack.Screen name='myAccount' component={DistributorMyAccount} /> */}
              {/* <Stack.Screen name='annoucedVacation' component={AnnoucedVacation} /> */}
              {/* <Stack.Screen name='myProducts' component={MyProducts} /> */}
              <Stack.Screen name='passbook' component={distributorPassbook} />
            </>
          )
        }
        {/* DELIVERY MAN */}
        {
          currentUser?.user_type === 5 && (
            <>
              <Stack.Screen name='home' component={DeliveryHome} />
              <Stack.Screen name='deliveryOrderHistory' component={DeliveryOrderHistory} />
              {/* <Stack.Screen name='ordersNearMe' component={OrdersNearMe} /> */}
            </>
          )
        }
        <Stack.Screen name='support' component={Support} />
        <Stack.Screen name='aboutUS' component={AboutUS} />
      </Stack.Navigator>
    </Animated.View>
  )
}

// CUSTOM DRAWER DESIGN
const DrawerContent = props => {
  const dispatch = useDispatch()
  const { currentUser, countryCode } = useSelector(({ user }) => user)
  const [alert, setAlert] = useState()

  const _logOut = async () => {
    setAlert(false)
    dispatch(userLogout())
    return props.navigation.dispatch(StackActions.replace('auth'))
  }

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView />
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E4E4E4'
      }}
      >
        <View style={{
          paddingLeft: 30,

          paddingVertical: 10
        }}
        >
          <Text style={styles.drawerTitle}>{currentUser?.first_name} {currentUser?.last_name}</Text>
          <Text style={styles.drawerTitle}>+{countryCode} {currentUser?.mobile}</Text>
          {currentUser?.user_type === 3 && (<Text style={styles.drawerTitle}>Vendor code: {currentUser?.referral_id}</Text>)}
        </View>
        {/* <IconButton
          icon={notificationIcon}
          iconStyle={{ tintColor: colors.blueLight }}
          onPress={() => props.navigation.navigate('notifications')}
        /> */}
      </View>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ flexGrow: 1, paddingTop: 10, paddingLeft: 10 }}
        showsVerticalScrollIndicator={false}
      >
        <DrawerIt
          label='Home'
          icon={homeDrawerIc}
          onPress={() => props.navigation.navigate(currentUser?.user_type === 2 ? 'hometab' : 'home')}
        />
        {/* CUSTOMER */}
        {
          currentUser?.user_type === 2 && (
            <>
              <DrawerIt
                label='Wallet'
                icon={walletIcon}
                onPress={() => props.navigation.navigate('wallet')}
              />
              <DrawerIt
                label='My Order'
                icon={donationIcon}
                onPress={() => props.navigation.navigate('orderHistory')}
              />
               <DrawerIt
                label='My Services'
                icon={donationIcon}
                onPress={() => props.navigation.navigate('myServices')}
              />
               <DrawerIt
                label='My Subcription'
                icon={donationIcon}
                onPress={() => props.navigation.navigate('mySubcription')}
              />
              <DrawerIt
                label='Delivery address'
                icon={locationIcon}
                onPress={() => props.navigation.navigate('myAddresses')}
              />
              <DrawerIt
                label='Offers'
                icon={subscriptionIcon}
                onPress={() => props.navigation.navigate('offers')}
              />
              <DrawerIt
                label='Annouce vacation'
                icon={announcedIcon}
                onPress={() => props.navigation.navigate('annouceVacation')}
              />
              <DrawerIt
                label='Donate'
                icon={donationIcon}
                onPress={() => props.navigation.navigate('donate')}
              />
              <DrawerIt
                label='Booking'
                icon={bookingIcon}
                onPress={() => props.navigation.navigate('booking')}
              />
              <DrawerIt
                label='My Profile'
                icon={usernameIcon}
                onPress={() => props.navigation.navigate('MyProfile')}
              />
              <DrawerIt
                label='Support'
                icon={supportIcon}
                onPress={() => props.navigation.navigate('support')}
              />
              <DrawerIt
                label='About us'
                icon={infoIcon}
                onPress={() => props.navigation.navigate('aboutUS')}
              />
              <DrawerIt
                label='Refer and Earn'
                icon={referIcon}
                onPress={() => props.navigation.navigate('referEarn')}
              />
            </>
          )
        }

        {/* VENDOR */}
        {
          currentUser?.user_type === 3 && (
            <>
              <DrawerIt
                label='Account'
                icon={accountsIcon}
                onPress={() => props.navigation.navigate('myAccount')}
              />
              <DrawerIt
                label='Cart'
                icon={basketIcon}
                onPress={() => props.navigation.navigate('cart')}
              />
              <DrawerIt
                label='My products'
                icon={watergallomIcon}
                onPress={() => props.navigation.navigate('myProducts')}
              />
              {/* <DrawerIt
                label='Order to distributor'
                icon={subscriptionIcon}
                onPress={() => props.navigation.navigate('ordersToDistributor')}
              /> */}
              <DrawerIt
                label='Passbook'
                icon={passbookIcon}
                onPress={() => props.navigation.navigate('passbook')}
              />
              <DrawerIt
                label='Report a complain'
                icon={supportIcon}
                onPress={() => props.navigation.navigate('support')}
              />
              <DrawerIt
                label='About us'
                icon={infoIcon}
                onPress={() => props.navigation.navigate('aboutUS')}
              />
              <DrawerIt
                label='Refer and Earn'
                icon={referIcon}
                onPress={() => props.navigation.navigate('referEarn')}
              />
            </>
          )
        }

        {/* DISTRIBUTOR USER */}
        {
          currentUser?.user_type === 4 && (
            <>
              {/* <DrawerIt
                label='Account'
                icon={accountsIcon}
                onPress={() => props.navigation.navigate('myAccount')}
              /> */}
              {/* <DrawerIt
                label='Announced vacation'
                icon={announcedIcon}
                onPress={() => props.navigation.navigate('annoucedVacation')}
              /> */}
              {/* <DrawerIt
                label='My products'
                icon={watergallomIcon}
                onPress={() => props.navigation.navigate('myProducts')}
              /> */}
              <DrawerIt
                label='Passbook'
                icon={passbookIcon}
                onPress={() => props.navigation.navigate('passbook')}
              />
              <DrawerIt
                label='Report a complain'
                icon={supportIcon}
                onPress={() => props.navigation.navigate('support')}
              />
              <DrawerIt
                label='About us'
                icon={infoIcon}
                onPress={() => props.navigation.navigate('aboutUS')}
              />
            </>
          )
        }

        {/* Delivery */}
        {
          currentUser?.user_type === 5 && (
            <>
              <DrawerIt
                label='Order History'
                icon={subscriptionIcon}
                onPress={() => props.navigation.navigate('deliveryOrderHistory')}
              />
              <DrawerIt
                label='Report a complain'
                icon={supportIcon}
                onPress={() => props.navigation.navigate('support')}
              />
              {/* <DrawerIt
                label='Orders near me'
                icon={locationIcon}
                onPress={() => props.navigation.navigate('ordersNearMe')}
              /> */}
              <DrawerIt
                label='About us'
                icon={infoIcon}
                onPress={() => props.navigation.navigate('aboutUS')}
              />
            </>
          )
        }

        <DrawerIt
          label='Sign Out'
          icon={signoutIcon}
          onPress={() => setAlert(true)}
        />
      </DrawerContentScrollView>
      <View style={styles.footer}>
        <Text style={styles.appVersionText}>App version</Text>
        <Text style={styles.appVersionText}>v.0</Text>
      </View>

      {/* Hidden components */}
      <WarnDialog
        isVisible={alert}
        rightText='LOGOUT'
        leftText='CANCEL'
        message='Are You Sure you want to logout?'
        leftAction={() => setAlert(false)}
        rightAction={_logOut}
      />

    </View>
  )
}

// DRAWER ITEM
function DrawerIt ({ icon, label, ...other }) {
  return (
    <DrawerItem
      label={label}
      icon={() => (
        <Image
          source={icon}
          style={{ width: 16, height: 16 }}
          resizeMode='contain'
        />
      )}
      labelStyle={styles.drawerLabel}
      style={{ marginBottom: 0 }}
      {...other}
    />
  )
}

const styles = StyleSheet.create({
  stack: {
    flex: 1,
    shadowColor: '#FFF',
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 5,
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative'
  },
  drawerStyles: { flex: 1 },
  drawerLabel: {
    marginLeft: -10,
    fontFamily: env.fontPoppinsRegular,
    color: '#575757',
    fontSize: 15
  },
  drawerTitle: {
    fontFamily: env.fontPoppinsRegular, fontSize: 14, color: colors.blueLight
  },
  footer: {
    paddingHorizontal: 30, paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#E4E4E4', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
  },
  appVersionText: {
    fontFamily: env.fontPoppinsRegular, fontSize: 14, color: '#676767'
  }
})
