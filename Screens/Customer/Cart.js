import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../../config/colors';
import uuid from "react-uuid";

const Cart = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [loggedInUser, setLoggedInUser] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userCartItems, setUserCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [orders, setOrders] = useState([]);
    const [checkoutFlag, setCheckoutFlag] = useState(false);
    //setRefreshData(true);
    //console.log(route.params.displayData);
    
    let uID =  route.params.uId;

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
    }, []);

    //Below will fetch the cartItems.
    useEffect(() => {
        (async ()=> {
            try{
                await AsyncStorage.getItem('cartItems').then(
                    (data)=> {
                        if(data == null){
                            console.log("data is null");
                        }else{
                            //setCartItems([]);
                            let completeData = JSON.parse(data);
                            setCartItems(JSON.parse(data));
                            let userViewData = [];
                            //console.log(uID);
                            let total = 0;
                            for(let i = 0; i < completeData.length; i++){
                                if(completeData[i].userId == uID){
                                    userViewData.push(completeData[i]);
                                    total += (completeData[i].productQuanity * completeData[i].productPrice)
                                }
                            }
                            setUserCartItems(userViewData);
                            setTotalAmount(total);
                        }
                    });
            } catch(e){ 
                console.log(e);
            }
        })();
    }, [isLoading]);

    //Below will fetch the orderss.
    useEffect(() => {
        (async ()=> {
            try{
                await AsyncStorage.getItem('orders').then(
                    (data)=> {
                        if(data == null){
                            console.log("orders data is null");
                        }else{
                            setOrders(JSON.parse(data));
                            //console.log(data);
                            //console.log(JSON.parse(data));
                        }
                    });
            } catch(e){ 
                console.log(e);
            }
        })();
    }, []);

    //Below will be used to store cart items
    const storeCartItems = async (cartData) => {
        try {  
            const jsonValue = JSON.stringify(cartData)
            await AsyncStorage.setItem('cartItems', jsonValue)
            //const getData= await AsyncStorage.getItem('categories');
            //console.log(JSON.parse(getData));
            if(!checkoutFlag){
                if(isLoading){
                    setIsLoading(false);
                }else{
                    setIsLoading(true);
                }
            }       
        } catch (e) {
            alert(e);
            //setIsLoading(false);
        }
    }

    //Below will be used to store cart items
    const storeOrder = async (orderData) => {
        try {  
            const jsonValue = JSON.stringify(orderData)
            await AsyncStorage.setItem('orders', jsonValue)
            let cartItemsUpdate = cartItems;
            let updatedCartItems = [];
            for(let i =0 ; i< cartItemsUpdate.length; i++){
                if(cartItemsUpdate[i].userId != loggedInUser.userId){
                    updatedCartItems.push(cartItemsUpdate[i]);
                }
            }
            storeCartItems(updatedCartItems);
            navigation.pop();
            //console.log(cartItemsUpdate + "udpating cart");
        } catch (e) {
            alert(e);
            //setIsLoading(false);
        }
    }


    const deleteItemFromCart = (item) => {
        setUserCartItems(items => {
            return items.filter(i => i.productID != item.productID)
        })
        let data = cartItems;
        for(let i= 0; i < data.length; i++){
            if(data[i].userId == loggedInUser.userId && data[i].productID == item.productID){
                data.pop(data[i]);
            }
        }
        //console.log(data);
        storeCartItems(data);
    }

    //placing an order
    const placeOrder = () => {
        let orderData = orders;
        let data = userCartItems;
        let orderObj = {
            orderId: uuid(),
            orderValue: totalAmount,
            userId: loggedInUser.userId,
            orderPlacedBy: loggedInUser.userFullName,
            orderStatus: "Placed",
            orderDetails: data
        }
        orderData.push(orderObj);
        storeOrder(orderData);
        //console.log(orderObj);
        //console.log("Placing");
    }

    return (
        <View>
            { userCartItems.length == 0 && 
                <Text style = {styles.emptyCartStyle}>Cart is Empty.</Text>
            }
            <FlatList
                data = { userCartItems }
                    renderItem = {({item}) => 
                        <View style = {styles.listItem}>
                            <View style = {styles.listItemView}>
                                <Text style = {styles.text}>Name: {item.productName}</Text>
                                <Text style = {styles.text}>Price: {item.productPrice} $</Text>
                                <Text style = {styles.text}>Quantiy: {item.productQuanity}</Text>
                            </View>
                            <View style = {styles.itemsToUpdateQuantity}>
                                {/* <View style = {{flexDirection: 'row'}}>
                                    <MaterialCommunityIcons name="minus" color={colors.primary} size={20} onPress={()=> {deleteProductQuantiy(item)}}/>
                                    <Text style = {{marginLeft: 8, marginRight: 8, fontSize: 17, color: colors.medium}}>{item.productQuanity}</Text>
                                    <MaterialCommunityIcons name="plus" color={colors.primary} size={20} onPress={()=> {addProducQuantity(item)}}/>
                                </View> */}
                                <MaterialCommunityIcons name="trash-can-outline" color={colors.primary} size={35} onPress={()=> {deleteItemFromCart(item)}}/>
                            </View>
                        </View>
                    }
                />
            {userCartItems != 0 &&
            <View style={styles.totalAndButton}>
                <Text style= {styles.text}>Total: $ {totalAmount}</Text>
                <TouchableOpacity
                    style = {styles.button}
                    onPress={()=> placeOrder()}
                    >
                    <Text style={styles.buttonText}>Checkout</Text>
                </TouchableOpacity>
            </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    listItem: {
        borderBottomColor: colors.primaryLight,
        borderBottomWidth: 1,
        borderBottomEndRadius: 15,
        borderTopEndRadius: 15,
        marginLeft: 10,
        flexDirection: 'row'
    },
    emptyCartStyle: {
        fontSize: 18,
        color: colors.danger,
        textAlign: "center", 
        marginTop: "10%"
    },    
    itemsToUpdateQuantity: {
        position: 'absolute',
        top: 0,
        left: "75%",
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },    
    text: {
        margin: 5,
        fontSize: 16,
        color: colors.medium
    },
    totalAndButton:{
        marginTop: "5%",
        marginLeft: "5%",
        marginRight: "5%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    button: {
        // position: 'absolute',
        backgroundColor: colors.primary,
        // alignContent: "center",
        // justifyContent: "center",
        alignItems: "center",
        padding: 15,
        width: "50%", 
        borderRadius: 25
        // justifyContent: "flex-end",
    },
    buttonText: {
        color: colors.white,
        fontSize: 17,
        marginRight: 15,
        textTransform: "uppercase",
        fontWeight: "bold",
      },
})

export default Cart;