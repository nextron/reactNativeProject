import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../../config/colors';
import topBarStyles from '../../config/topBarStyles';
import { useIsFocused } from '@react-navigation/native';


const AdminOrders = () => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [orderDetails, setOrderDetails] = useState('');
    const isFocused = useIsFocused();
    const [userNameInput, setUserNameInput] = useState('');
    const [approveShipDeliverTitle, setApproveShipDeliverTitle] = useState('Ship');
    const [showCancel, setShowCancel] = useState(false);
    const [showShipDeliver, setShowShipDeliver] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState('');

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
                            // let userViewOrders = [];
                            // for(let i = 0; i < orderData.length; i++){
                            //     if(orderData[i].userId == loggedInUser.userId){
                            //         userViewOrders.push(orderData[i]);
                            //     }
                            // }
                            setOrders(orderData);
                            setAllOrders(orderData);
                        }
                    });
            } catch(e){ 
                console.log(e);
            }
        })();
    }, [isFocused, isLoading]);


    //Below will be used to store cart items
    const storeOrder = async (orderData) => {
        setIsLoading(true);
        try {  
            const jsonValue = JSON.stringify(orderData)
            await AsyncStorage.setItem('orders', jsonValue)
            setIsLoading(false);
        } catch (e) {
            alert(e);
            setIsLoading(false);
            //setIsLoading(false);
        }
    }

    //Will help to show the order details
    const viewOrderDetails = (item) => {
        let data = item.orderDetails;
        setSelectedOrder(item);
        setShowCancel(true);
        setShowShipDeliver(true);
        if(selectedOrder.orderStatus == "Cancelled" || selectedOrder.orderStatus == "Delivered"){
            setShowCancel(false);
            setShowShipDeliver(false);
        }
        if(selectedOrder.orderStatus == "Shipped"){
            setShowCancel(false);
        }

        let viewData = '';
        for(let i = 0; i < data.length; i++){
            viewData+= "\n"+data[i].productName + " * " + data[i].productPrice + "$ * " + data[i].productQuanity + "\n" + "_____________________________"+ "\n";
        }
        // "productName": "Testing ",
        // "productPrice": "13",
        // "productQuanity": 12,
        setOrderDetails(viewData);
        setModalVisible(true);
        //console.log(viewData);
    }

    //Below will search with user Name
    const searchUser = ()=>{
        console.log(orders[0]);
        if(userNameInput.length>1){
            setOrders(allOrders);
            setOrders(items => {
                return items.filter(i => String(i.orderPlacedBy).includes(userNameInput) ? i : null)
            })
        }else{
            setOrders(allOrders);
        }
    }

    //Below will change the status to Shipped
    const shipOrder = (item) => {
        let data = item;
        let completeData = allOrders;
        console.log(data.orderId);
        for(let i = 0; i < completeData.length; i++){
            if(completeData[i].orderId == data.orderId){
                completeData[i].orderStatus = "Shipped";
            }
        }
        //console.log("Cancelled");
        storeOrder(completeData);   
    }
    //Below will change the status to delivered
    const deliverOrder = (item) => {
        let data = item;
        let completeData = allOrders;
        console.log(data.orderId);
        for(let i = 0; i < completeData.length; i++){
            if(completeData[i].orderId == data.orderId){
                completeData[i].orderStatus = "Delivered";
            }
        }
        //console.log("Cancelled");
        storeOrder(completeData);   
    } 
    //Below will cancel the order
    const cancelOrder = (item) => {
        let data = item;
        let completeData = allOrders;
        console.log(data.orderId);
        for(let i = 0; i < completeData.length; i++){
            if(completeData[i].orderId == data.orderId){
                completeData[i].orderStatus = "Placed";
            }
        }
        //console.log("Cancelled");
        storeOrder(completeData);   
    }

    //Logout 
    const logout = () => {
        navigation.replace('WelcomeScreen');
    }

    return (
        <View>
            <ActivityIndicator style = {styles.activityIndicator} animating = {isLoading} size="large" color ={ colors.primary }/>
            {/* <View style = {topBarStyles.topBar}>
                <MaterialCommunityIcons style= {topBarStyles.logOutButton} name="power-standby" color={'red'} size={33} onPress={()=> {logout()}}/>
                <Text style = {topBarStyles.userNameStyle}>Welcome, {loggedInUser.userFullName}</Text>
                <MaterialCommunityIcons style= {topBarStyles.cartIcon} name="cart-outline" color={colors.primary} size={33} onPress={()=> {goToCart()}}/>
            </View> */}
            <View style = {topBarStyles.topBar}>
                <Text style = {topBarStyles.userNameStyle}>Welcome, Admin</Text>
                <MaterialCommunityIcons style= {topBarStyles.cartIcon} name="power-standby" color={'red'} size={30} onPress={()=> {logout()}}/>               
                {/* <MaterialCommunityIcons style= {topBarStyles.cartIcon} name="cart-outline" color={colors.primary} size={33} onPress={()=> {goToCart()}}/> */}
            </View>
            <View style = {styles.inLineSearchInputs}>
                <TextInput
                    style = {styles.elemetns} 
                    placeholder='Search By User Name'
                    value = {userNameInput}
                    autoCapitalize='none'
                    autoComplete='none'
                    onChangeText={(value)=> {setUserNameInput(value);searchUser();}}
                />
            </View>
            { orders.length == 0 && 
                <Text style = {styles.emptyOrderStyle} onPress={()=>refreshData()}>No Orders available.</Text>
            }
            <FlatList style={{marginTop: 14}}
            data = { orders }
            renderItem = {({item}) => 
                <TouchableOpacity onPress={()=> {viewOrderDetails(item);}}>
                    <View style = {styles.listItem}>
                        <View style = {styles.listItemView}>
                            <Text style = {styles.text}>Order ID: {item.orderId}</Text>
                            <Text style = {styles.text}>Order Placed By: {item.orderPlacedBy}</Text>
                            <Text style = {styles.text}>Order Value: {item.orderValue} $</Text>
                            <Text style = {[styles.text, {color: item.orderStatus == "Placed" ? colors.warning : item.orderStatus == "Cancelled" ? colors.primary : item.orderStatus == "Shipped" ? colors.secondary : colors.sucess}]}>Order Status: {item.orderStatus}</Text>
                        </View>
                    </View>
                    <View style = {styles.itemsToUpdateQuantity}>
                        <View>
                            {
                                item.orderStatus == "Placed" ? (<Button color={colors.secondary} onPress = {()=>shipOrder(item)} title={"Ship"}/>):null
                            }    
                            {
                                item.orderStatus == "Shipped" ? (<Button color={colors.secondary} onPress = {()=>deliverOrder(item)} title={"Deliver"}/>):null
                            }   
                            {
                                item.orderStatus == "Placed"  ? (<Button color={"red"} onPress = {()=>cancelOrder(item)} title="Cancel"/>):null
                                
                            }
                            {/* <MaterialCommunityIcons name="minus" color={colors.primary} size={20} onPress={()=> {deleteProductQuantiy(item)}}/> */}
                            {/* <MaterialCommunityIcons name="plus" color={colors.primary} size={20} onPress={()=> {addProducQuantity(item)}}/> */}
                        </View>
                        {/* <Button onPress={()=> addToCart(item)} color={colors.primary} title = "Add"></Button> */}
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
                    <MaterialCommunityIcons name="window-close" color={"red"} size={20} onPress={()=> {setModalVisible(!modalVisible)}}/>
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
        width: "60%",
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
    itemsToUpdateQuantity: {
        position: 'absolute',
        top: "40%",
        left: "75%",
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    }
})

export default AdminOrders;