import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import uuid from "react-uuid";
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from "../../config/colors";
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Swipeable from 'react-native-gesture-handler/Swipeable';

const AdminListOfProducts = () => {

    const route = useRoute();
    const categoryID = route.params.categoryID;
    const [localProducts, setLocalProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [productNameInput, setProductNameInput] = useState('');
    const [productPriceInput, setProductPriceInput] = useState('');
    const [productDescriptionInput, setProductDescriptionInput] = useState('');
    const [addUpdateButton, setAddUpdateButton] = useState("Add");
    const [isLoading, setIsLoading] = useState(false);
    const [emptyProduct, setEmptyProduct] = useState(true);
    const [updateProdutFlag, setUpdateProdutFlag] = useState(false);
    const [updateView, setUpdateView] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState('');

    //console.log(categoryID);
    // let data = [  
    //     {
    //         productID: uuid(),
    //         categoryID: 1,
    //         productName: "ASUS LAPTOP",
    //         productPrice: "1000$"
    //     },
    //     {
    //         productID:uuid(),
    //         categoryID: 1,
    //         productName: "ACER LAPTOP",
    //         productPrice: "1200$"
    //     },
    //     {
    //         productID: uuid(),
    //         categoryID: 2,
    //         productName: "Iphone",
    //         productPrice: "1200$"
    //     },
    //     {
    //         productID:uuid(),
    //         categoryID: 2,
    //         productName: "Samsung",
    //         productPrice: "1000$"
    //     },
    //     {
    //         productID: uuid(),
    //         categoryID: 3,
    //         productName: "IMac",
    //         productPrice: "2000$"
    //     },
    //     {
    //         productID:uuid(),
    //         categoryID: 3,
    //         productName: "DELL DESKTOP",
    //         productPrice: "1300$"
    //     }
    // ];
    // let localData = [];
    // for(let i = 0; i< data.length; i++){
    //     if(data[i].categoryID == categoryID){
    //         localData.push(data[i]);
    //     }   
    // }
    //Database operations
    
    const storeData = async (categoryData) => {
        setIsLoading(true);
        try {  
            const jsonValue = JSON.stringify(categoryData)
            await AsyncStorage.setItem('products', jsonValue)
            //const getData= await AsyncStorage.getItem('categories');
            //console.log(JSON.parse(getData));
            if(updateView){
                setUpdateView(false);
            }else{
                setUpdateView(true);
            }
            setIsLoading(false);
        } catch (e) {
          alert(e);
          setIsLoading(false);
        }
    }

    //Below will fetch the products
    useEffect(() => {
        (async ()=> {
            try{
                await AsyncStorage.getItem('products').then(
                    (data)=> {
                        if(data == null){
                            console.log("data is null");
                        }else{
                            // localProducts = JSON.parse(data);
                            // setViewProduct();
                            //setEmptyProduct(false);
                            //setProducts(JSON.parse(data));
                            let completeData = JSON.parse(data);
                            setLocalProducts(completeData);
                            let viewData = []
                            for(let i = 0; i < completeData.length; i++){
                                //console.log("filtering");
                                if(completeData[i].categoryID == categoryID){
                                    viewData.push(completeData[i]);
                                    //console.log(completeData[i].productName);
                                }
                            }
                            if(viewData.length != 0){
                                setEmptyProduct(false);
                            }else{
                                setEmptyProduct(true);
                            }
                            setProducts(viewData);
                        }
                    });
            } catch(e){ 
                console.log(e);
            }
        })();
    }, [updateView]);

    //this function will make a object of product and send it to store data function 
    //to save it in the local storage
    const addUpdateProduct = () => {
        //console.log(categoryName);
        if(productNameInput.length == 0 || productDescriptionInput.length == 0 || productPriceInput.length == 0){
            alert("Input fields cannot be empty");
        }else{
            let data = localProducts;
            //console.log(data);
            if(updateProdutFlag){
                for(let i = 0; i < data.length; i++){
                    if(data[i].productID == selectedProduct){
                        data[i].productName = productNameInput;
                        data[i].productPrice = productPriceInput;
                        data[i].productDescription = productDescriptionInput;
                    }
                }
            }else{
                let productObj =  { 
                    productID: uuid(), 
                    categoryID: categoryID,
                    productName: productNameInput,
                    productPrice: productPriceInput,
                    productDescription: productDescriptionInput
                    }
                data.push(productObj);
            }
            storeData(data);
        }
        setSelectedProduct('');
        setProductNameInput('');
        setProductDescriptionInput('');
        setProductPriceInput('');
        setAddUpdateButton("Add");
        setUpdateProdutFlag(false);
    }

    //edit product
    const editProduct = (item) => {
        setAddUpdateButton("Update");
        setUpdateProdutFlag(true);
        setSelectedProduct(item.productID);
        setProductNameInput(item.productName);
        setProductDescriptionInput(item.productDescription);
        setProductPriceInput(item.productPrice);
        //setCategoryNameInput(item.categoryName);
    }
    //delete product
    const deleteProduct = (item) => {
        let data=  localProducts;
        data = data.filter((items) => items.productID !== item.productID);
        storeData(data);
    }

    return (
        <View>
            <ActivityIndicator style = {styles.activityIndicator} animating = {isLoading} size="large" color ={ colors.primary }/>
            {/* Add a product input */}
            <View style = {styles.addProductStyle}>
                <TextInput
                    style = {styles.elemetns} 
                    placeholder='Product Name'
                    value = {productNameInput}
                    onChangeText={(value)=> {setProductNameInput(value)}}
                />
                <TextInput
                    style = {styles.elemetns} 
                    placeholder='Product Price'
                    value = {productPriceInput}
                    onChangeText={(value)=> {setProductPriceInput(value)}}
                />
            </View>
            <TextInput 
                style = {styles.descriptionElement}
                placeholder = 'Product Description'
                multiline = {true}
                numberOfLines={2}
                value = {productDescriptionInput}
                onChangeText = {(value) => {setProductDescriptionInput(value)}} 
            />
            <Button color={colors.primary} onPress = {()=>addUpdateProduct()} title={addUpdateButton}/>
            {/* Show no product available text */}
            { emptyProduct && 
                <Text style = {styles.emptyProductStyle}>No Products Available.</Text>
            }
            <FlatList
            data = { products }
            renderItem = {({item}) => 
            <Swipeable renderRightActions={()=>
                <View style={{width: 75, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    {/* Edit Element */}
                    <MaterialCommunityIcons name="square-edit-outline" color={colors.warning} size={30} onPress={()=> {editProduct(item)}}/>
                    {/* Delete Element */}
                    <MaterialCommunityIcons name="trash-can-outline" color={colors.danger} size={30} onPress={()=> {deleteProduct(item)}}/>
                </View>}
                >
                <TouchableOpacity style = {styles.listItem}>
                    <View style = {styles.listItemView}>
                        <Text style = {styles.text}>Name: {item.productName}</Text>
                        <Text style = {styles.text}>Price: {item.productPrice} $</Text>
                        <Text style = {styles.text}>Description: {item.productDescription}</Text>
                    </View>
                </TouchableOpacity>
                </Swipeable>
            }
            /> 
            
        </View>
    )
}

const styles = StyleSheet.create({
    listItem: {
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1,
        borderBottomEndRadius: 15,
        borderTopEndRadius: 15,
        marginLeft: 10
    },
    text: {
        margin: 5,
        fontSize: 16,
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
    elemetns: {
        fontSize: 17,
        textAlign: 'center',
        height: 40,
        margin: 5,
        width: "49%",
        borderWidth: 1,
        // padding: 10,
        borderColor: colors.primaryLight,
        borderRadius: 30
    },   
    descriptionElement:{
        fontSize: 16,
        textAlign: 'center',
        height:50,
        margin: 10,
        width: "95%",
        borderWidth: 1,
        // padding: 10,
        borderColor: colors.primaryLight,
        borderRadius: 30
    },
    addProductStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: "1%",
        marginLeft: "5%",
        marginRight: "5%",
        // height: 50,
    },
})


export default AdminListOfProducts;