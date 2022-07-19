import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, LogBox, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../../config/colors';
import topBarStyles from '../../config/topBarStyles';
import { useIsFocused } from '@react-navigation/native';

function Corders() {
    const navigation = useNavigation();
    const [loggedInUser, setLoggedInUser] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [orderDetails, setOrderDetails] = useState('');
    const [refreshDataFlag, setRefreshDataFLag] = useState(0);
    const isFocused = useIsFocused();
    LogBox.ignoreAllLogs()
    //console.log(isFocused);
    //const [userOrders, setUserOrders] = useState([]);
    //console.log("IN ORDERS");
    //Below will fetch the logged in User.
    useEffect(() => {
        (async ()=> {
            try{
                await AsyncStorage.getItem('loggedInUser').then(
                    (data)=> {
                        if(data == null){
                            console.log("data is null");
                        }else{
                            setLoggedInUser(JSON.parse(data));
                            //console.log(data);
                        }
                    });
            } catch(e){ 
                console.log(e);
            }
        })();
    }, [isFocused]);

    //Below will fetch the orderss.
    useEffect(() => {
        (async ()=> {
            try{
                await AsyncStorage.getItem('orders').then(
                    (data)=> {
                        if(data == null){
                            console.log("orders data is null");
                        }else{
                            let orderData = JSON.parse(data);
                            
                            let userViewOrders = [];
                            for(let i = 0; i < orderData.length; i++){
                                if(orderData[i].userId == loggedInUser.userId){
                                    userViewOrders.push(orderData[i]);
                                }
                            }
                            setOrders(userViewOrders);
                        }
                    });
            } catch(e){ 
                console.log(e);
            }
        })();
    }, [isFocused, isLoading, orders]);

    //Go to Cart
    const goToCart = () =>{
        navigation.navigate("Cart", {uId: loggedInUser.userId});
    }
    //Will help to show the order details
    const viewOrderDetails = (item) => {
        let data = item.orderDetails;
        let viewData = '';
        for(let i = 0; i < data.length; i++){
            viewData+= "\n"+data[i].productName + " * " + data[i].productPrice + "$ * " + data[i].productQuanity + "\n" + "_________________________"+ "\n";
        }
        // "productName": "Testing ",
        // "productPrice": "13",
        // "productQuanity": 12,
        setOrderDetails(viewData);
        //console.log(viewData);
    }
    //Logout 
    const logout = () => {
        navigation.replace('WelcomeScreen');
    }

    const refreshData=() => {
        setRefreshDataFLag(prev => prev + 1);
    }

    return (
        <View>
            <ActivityIndicator style = {styles.activityIndicator} animating = {isLoading} size="large" color ={ colors.primary }/>
            <View style = {topBarStyles.topBar}>
                <MaterialCommunityIcons style= {topBarStyles.logOutButton} name="power-standby" color={'red'} size={33} onPress={()=> {logout()}}/>
                <Text style = {topBarStyles.userNameStyle}>Welcome, {loggedInUser.userFullName}</Text>
                <MaterialCommunityIcons style= {topBarStyles.cartIcon} name="cart-outline" color={colors.primary} size={33} onPress={()=> {goToCart()}}/>
            </View>
            { orders.length == 0 && 
                <Text style = {styles.emptyOrderStyle} onPress={()=>refreshData()}>No Orders available.</Text>
            }
            <FlatList style={{marginTop: 14, marginBottom: 90}}
            data = { orders }
            renderItem = {({item}) => 
                <TouchableOpacity onPress={()=> {viewOrderDetails(item); setModalVisible(true);}}>
                    <View style = {styles.listItem}>
                        <View style = {styles.listItemView}>
                            <Text style = {styles.text}>Order ID: {item.orderId}</Text>
                            <Text style = {styles.text}>Order Value: {item.orderValue} $</Text>
                            <Text style = {[styles.text, {color: item.orderStatus == "Placed" ? colors.warning : item.orderStatus == "Cancelled" ? colors.primary : item.orderStatus == "Shipped" ? colors.secondary : colors.sucess}]}>Order Status: {item.orderStatus}</Text>
                            {/* <Text style = {styles.text}>Order Status: {item.orderStatus}</Text> */}
                        </View>
                    </View>
                </TouchableOpacity>
                }
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.text}>{orderDetails}</Text>
                    <MaterialCommunityIcons name="window-close" color={colors.primary} size={20} onPress={()=> {setModalVisible(!modalVisible)}}/>
                </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 15,
        padding: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
    listItem: {
        borderBottomColor: colors.primaryLight,
        borderBottomWidth: 1,
        borderBottomEndRadius: 15,
        borderTopEndRadius: 15,
        marginLeft: 10,
        flexDirection: 'row'
    },
    text: {
        margin: 5,
        fontSize: 16,
        color: colors.medium
    },
    emptyOrderStyle: {
        fontSize: 18,
        color: colors.danger,
        textAlign: "center", 
        marginTop: "10%"
    },elemetns: {
        fontSize: 15,
        textAlign: 'center',
        height: 38,
        margin: 12,
        borderWidth: 1,
        width: "45%",
        padding: 10,
        borderColor: colors.primaryLight,
        borderRadius: 30
    },inLineSearchInputs:{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginLeft: "5%",
        marginRight: "5%",
    },listCategoryButton:{
        fontSize: 15,
        // font: color.medium,
        backgroundColor: colors.white, 
        borderWidth: 1, 
        borderRadius: 30,
        borderColor: colors.primaryLight, 
        height: 38, 
    },
    emptyProductStyle: {
        fontSize: 18,
        color: colors.danger,
        textAlign: "center", 
        marginTop: "10%"
    },
    activityIndicator: {
        alignItems: "center", 
        justifyContent: "center", 
        position:"absolute", 
        left: 0, 
        right: 0, 
        top: 0, 
        bottom: 0
    },
})


export default Corders;