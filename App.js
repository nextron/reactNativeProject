import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import AdminHome from './Screens/Admin/AdminHome';
import AdminOrders from './Screens/Admin/AdminOrders';
import AdminProfile from './Screens/Admin/AdminProfile';
import AdminListOfProducts from './Screens/Admin/AdminListOfProducts';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import navigationTheme from './config/navigationTheme';
import WelcomeScreen from './Screens/WelcomScreen';
import RegisterScreen from './Screens/RegisterScreen';
import Corders from './Screens/Customer/Corders';
import Cart from './Screens/Customer/Cart';
import Chome from './Screens/Customer/Chome';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import CHome from './Screens/Customer/CHome';

function AdminTabs() {
  //const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
      name="Home" 
      component={AdminHome} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home" color={color} size={size} />
        ),
      }}
      />
      <Tab.Screen 
      name="Orders" 
      component={AdminOrders} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="reorder-horizontal" color={color} size={size} />
        ),
      }}
      />
      <Tab.Screen 
      name="Profile" 
      component={AdminProfile} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="account" color={color} size={size} />
        ),
      }}
      />
    </Tab.Navigator>
  );
}


function CustomerTab(){
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
      name="Products" 
      component={Chome} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="alpha-p-box" color={color} size={size} />
        ),
      }}
      />
      <Tab.Screen 
      name="Orders" 
      component={Corders} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="reorder-horizontal" color={color} size={size} />
        ),
      }}
      />
      {/* <Tab.Screen 
      name="Profile" 
      component={Cprofile} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="account" color={color} size={size} />
        ),
      }}
      /> */}
    </Tab.Navigator>
  );
}

export default function app(){
  

  const Stack = createNativeStackNavigator();

  //Logout 
  // const logout = () => {
  //   navigation.replace('WelcomeScreen');
  // }

  return(
    <NavigationContainer theme={navigationTheme} >
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options = {{ headerShown: false }}/>
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options = {{ title: "Register" }}/>
        <Stack.Screen name="Admin" component={AdminTabs}  
        options = {{
          headerShown: false 
          // headerRight: () => (
          //   <MaterialCommunityIcons 
          //   name="power-standby" color={'red'} size={25} 
          //   onPress={()=> {logout()}}/>
          // ),
        }}/>
        <Stack.Screen name="Customer" component={CustomerTab} options = {{ headerShown: false }}/>
        <Stack.Screen name="Cart" component={Cart} options = {{title: "Cart"}}/>
        <Stack.Screen name="AdminListOfProducts" component = { AdminListOfProducts } options = {{title: "Products"}}/>
      </Stack.Group>
    </Stack.Navigator>
  </NavigationContainer>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
