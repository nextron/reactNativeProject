import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, LogBox, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../../config/colors';
import topBarStyles from '../../config/topBarStyles';
import SelectDropdown from 'react-native-select-dropdown'
import { useIsFocused } from '@react-navigation/native';

const Chome = () => {
    const navigation = useNavigation();
    const [loggedInUser, setLoggedInUser] = useState('');
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [productNameInput, setProductNameInput] = useState('');
    const [listOfCategories, setListOfCategories] = useState([]);
    const [categoriesData, setCategoryData] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const isFocused = useIsFocused();
    LogBox.ignoreAllLogs()
    //navigation.setOptions({title: loggedInUser.userName});
    //navigation.setOptions({ title: {loggedInUser.}}})
    //console.log(loggedInUser);
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

    //Below will fetch the logged in cartItems.
    useEffect(() => {
        (async ()=> {
            try{
                await AsyncStorage.getItem('cartItems').then(
                    (data)=> {
                        if(data == null){
                            console.log("data is null");
                        }else{
                            setCartItems(JSON.parse(data));
                            //console.log(cartItems);
                            //console.log(data);
                        }
                    });
            } catch(e){ 
                console.log(e);
            }
        })();
    }, [isLoading,isFocused]);

    //Below will fetch the products
    useEffect(() => {
        (async ()=> {
            try{
                await AsyncStorage.getItem('products').then(
                    (data)=> {
                        if(data == null){
                            console.log("data is null");
                        }else{
                            let completeData = [];
                            completeData = JSON.parse(data);
                            //setAllProducts(completeData);
                            setViewProduct(completeData);
                        }
                    });
            } catch(e){ 
                console.log(e);
            }
        })();
    }, [isFocused]);

    //Below will fetch the list of categories
    useEffect(() => {
        (async ()=> {
            try{
                await AsyncStorage.getItem('categories').then(
                    (data)=> {
                        if(data == null){
                            console.log("category data is null");
                        }else{
                            let categories = JSON.parse(data);
                            setCategoryData(categories);
                            let localCategories = ["All"];
                            for(let i = 0; i<categories.length; i++){
                                localCategories.push(categories[i].categoryName)
                            }
                            setListOfCategories(localCategories);
                            //setCategories(JSON.parse(data));
                            //console.log(data);
                        }
                    });
            } catch(e){ 
                console.log(e);
            }
        })();
    }, [isFocused]);
    
    //Below will be used to store cart items
    const storeCartItems = async (cartData) => {
        setIsLoading(true);
        try {  
            const jsonValue = JSON.stringify(cartData)
            await AsyncStorage.setItem('cartItems', jsonValue)
            //const getData= await AsyncStorage.getItem('categories');
            //console.log(JSON.parse(getData));
            setIsLoading(false);
        } catch (e) {
          alert(e);
          setIsLoading(false);
        }
    }

    //Viewing Data on Screen
    const setViewProduct = (completeData) =>{
        let data = completeData;
        for(let i = 0; i < data.length; i++){
            data[i].productQuanity = 1;
            //console.log(i);
        }
        setAllProducts(data);
        setProducts(data);
    }

    //update quantiy of a product
    const addProducQuantity = (item) => {
        if(item.productQuanity < 10){
            setProducts(items => {
                return items.filter(i => i.productID == item.productID ? i.productQuanity+=1 : i)
            })
        }
    }
    const deleteProductQuantiy = (item) => {
        if(item.productQuanity > 1){
            setProducts(items => {
                return items.filter(i => i.productID == item.productID ? i.productQuanity-=1 : i)
            })
        }
    }

    //function to add product to the cart
    const addToCart = (item) => {
        if(isLoading){
            setIsLoading(false);
        }else{
            setIsLoading(true);
        }
        let data = cartItems;
        //console.log(item);
        let cartObj = {
            productID: item.productID,
            userId: loggedInUser.userId,
            productQuanity: item.productQuanity,
            productPrice: item.productPrice,
            productName: item.productName
        }
        if(data.length == 0){
            data.push(cartObj);
        }else{
            let addCartItem = true;
            for(let i=0; i< data.length; i++){
                if(data[i].userId == cartObj.userId){
                    if(data[i].productID == cartObj.productID){
                        addCartItem = false;
                        data[i].productQuanity += item.productQuanity;
                    }
                }
            }
            if(addCartItem){
                data.push(cartObj);
            }  
        }
        //console.log(data);
        storeCartItems(data);
        // setCartItems(items => {
        //     return items.filter(
        //         i => (i.productID == item.productID && i.customerID == customerID) ? i.productQuanity+=1 : i)
        // })
        //console.log(item.productID + item.productQuanity);
    }

    //function to search prodcut
    const searchProduct = () => {
        if(productNameInput.length>1){
            setProducts(allProducts);
            setProducts(items => {
                return items.filter(i => String(i.productName).includes(productNameInput) ? i : null)
            })
        }else{
            setProducts(allProducts);
        }
    }

    //function to filter product by category
    const filterProduct = (selectedItem, index) => {
        //fetching categoryid
        setProducts(allProducts);
        if(index == 0){
            return;
        }
        let categoryId = categoriesData[index-1].categoryID;
        setProducts(items => {
            return items.filter(i => i.categoryID === categoryId)
        })
    }

    const goToCart = () => {
        navigation.navigate("Cart", {uId: loggedInUser.userId});
    }
    //Logout 
    const logout = () => {
        navigation.replace('WelcomeScreen');
    }
    //Ref oBj
    // "categoryID": "3e00cec-da0d-2a7a-5634-bb0b4e13618e",
    // "productDescription": "File",
    // "productID": "cee1b1e-16cf-8405-0bf8-d7258d8fbe8f",
    // "productName": "Testing ",
    // "productPrice": "12312",
    // "productQuanity": 1,
    return (
        <View >
            <ActivityIndicator style = {styles.activityIndicator} animating = {isLoading} size="large" color ={ colors.primary }/>
            <View style = {topBarStyles.topBar}>
                <MaterialCommunityIcons style= {topBarStyles.logOutButton} name="power-standby" color={'red'} size={33} onPress={()=> {logout()}}/>
                <Text style = {topBarStyles.userNameStyle}>Welcome, {loggedInUser.userFullName}</Text>
                <MaterialCommunityIcons style= {topBarStyles.cartIcon} name="cart-outline" color={colors.primary} size={33} onPress={()=> {goToCart()}}/>
            </View>
            {/* <ModalDropdown options={['option 1', 'option 2']}/> */}
            <View style = {styles.inLineSearchInputs}>
                <TextInput
                    style = {styles.elemetns} 
                    placeholder='Product Name'
                    value = {productNameInput}
                    autoCapitalize='none'
                    autoComplete='none'
                    onChangeText={(value)=> {setProductNameInput(value);searchProduct();}}
                />
                {/* <MaterialCommunityIcons name="arrow-right-bold-outline" color={colors.primary} size={33} onPress={()=> {goToUser()}}/> */}
            
                <SelectDropdown
                    defaultButtonText='Select Category'
                    buttonStyle = {styles.listCategoryButton}
                    // style = {styles.listCategoryStyle}
                    buttonTextStyle = {{color: colors.medium}}
                    dropdownStyle = {{borderRadius: 30, borderWidth:1, borderColor:colors.primaryLight}}
                    data={listOfCategories}
                    onSelect={(selectedItem, index) => {
                        filterProduct(selectedItem, index);
                    }}
                />
            </View>
            { products.length == 0 && 
                <Text style = {styles.emptyProductStyle}>No product is available in this Category.</Text>
            }
            <View>
            <FlatList
            data = { products }
            renderItem = {({item}) => 
                <View style = {styles.listItem}>
                    <View style = {styles.listItemView}>
                        <Text style = {styles.text}>Name: {item.productName}</Text>
                        <Text style = {styles.text}>Price: {item.productPrice} $</Text>
                        <Text style = {styles.text}>Description: {item.productDescription}</Text>
                    </View>
                    <View style = {styles.itemsToUpdateQuantity}>
                        <View style = {{flexDirection: 'row'}}>
                            <MaterialCommunityIcons name="minus" color={colors.primary} size={20} onPress={()=> {deleteProductQuantiy(item)}}/>
                            <Text style = {{marginLeft: 8, marginRight: 8, fontSize: 17, color: colors.medium}}>{item.productQuanity}</Text>
                            <MaterialCommunityIcons name="plus" color={colors.primary} size={20} onPress={()=> {addProducQuantity(item)}}/>
                        </View>
                        <Button onPress={()=> addToCart(item)} color={colors.primary} title = "Add"></Button>
                    </View>
                </View>
                }
                />
            </View>
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
    text: {
        margin: 5,
        fontSize: 16,
        color: colors.medium
    },
    emptyProductStyle: {
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

export default Chome;