import React,{useEffect, useState} from 'react'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import messaging from '@react-native-firebase/messaging';
import ProductDetails from '../screens/dashboard/ProductDetails'
import BulkProductDetails from '../screens/dashboard/BulkProductDetails'
import VendorProductDetails from '../screens/vendor/ProductDetails'
import AddAddress from '../screens/dashboard/AddAddress'
import ServiceBooking from '../screens/dashboard/ServiceBooking'
import customerPayment from '../screens/dashboard/Payment'
import Drawer from './Drawer'

// Delivery screen
import DeliveryOrderDetails from '../screens/delivery/OrderDetails'

// distributor
import VendorDetails from '../screens/distributor/VendorDetails'
import AddVendor from '../screens/distributor/AddVendor'
import Notifications from '../screens/Notifications'
import AssignOrder from '../screens/vendor/AssignOrder'
import Payment from '../screens/Payment'
import Profile from '../screens/Profile'
import Subscription from '../screens/dashboard/Subscription'
import AssignDistOrder from '../screens/vendor/AssignDistOrder'
import CheckOut from '../screens/dashboard/CheckOut'
import OrderDetails from '../screens/dashboard/OrderDetails'
import DonationDetails from '../screens/dashboard/DonationDetails'
import SubcriptionDetails from '../screens/dashboard/SubcriptionDetails';

const Stack = createStackNavigator()

export default function DashboardStack ({navigation}) {

  const [initialRoute, setInitialRoute] = useState('dashboard');

  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      notificationAction(remoteMessage)
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          setInitialRoute('dashboard');
        }
        setLoading(false);
      });
      messaging().onMessage(onMessage)
  }, []);

  const onMessage = (remoteMessage) => {
    console.log(
      'Notification Received on Forground:',
      remoteMessage.notification,
    );
  }

  const notificationAction = (remoteMessage) => {
    navigation.navigate('notifications')
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        gestureEnabled: false
      }}
    >
      <Stack.Screen name='dashboard' component={Drawer} options={{ headerShown: false }} />
      <Stack.Screen name='productDetails' component={ProductDetails} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
      <Stack.Screen name='serviceBooking' component={ServiceBooking} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
      <Stack.Screen name='bulkProductDetails' component={BulkProductDetails} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
      <Stack.Screen name='deliveryOrderDetails' component={DeliveryOrderDetails} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
      <Stack.Screen name='vendorProductDetails' component={VendorProductDetails} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
      {/* <Stack.Screen name='distributorProductDetails' component={DistributorProductDetails} options={{ headerShown: false }} /> */}
      <Stack.Screen name='addAddress' component={AddAddress} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
      <Stack.Screen name='notifications' component={Notifications} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
      <Stack.Screen name='assignOrder' component={AssignOrder} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
      <Stack.Screen name='assignDistOrder' component={AssignDistOrder} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
      <Stack.Screen name='profile' component={Profile} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
      <Stack.Screen name='vendorDetails' component={VendorDetails} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
      <Stack.Screen name='addVendor' component={AddVendor} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
      <Stack.Screen name='subscription' component={Subscription} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
      <Stack.Screen name='customerPayment' component={customerPayment} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
      <Stack.Screen name='payment' component={Payment} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
      <Stack.Screen name='checkOut' component={CheckOut} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
      <Stack.Screen name='orderDetails' component={OrderDetails} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
      <Stack.Screen name='donationDetails' component={DonationDetails} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
      <Stack.Screen name='subcriptionDetails' component={SubcriptionDetails} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
    </Stack.Navigator>
  )
}
