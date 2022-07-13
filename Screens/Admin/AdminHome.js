import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator,Button, FlatList, StyleSheet, Text, TouchableOpacity, View, TextInput } from "react-native";
import uuid from "react-uuid";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from "../../config/colors";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import topBarStyles from "../../config/topBarStyles";


const AdminHome = ({navigation}) => {
    //Test Data
    //categories
    // let demoCategories = [
    //         {
    //             categoryID: uuid(), 
    //             categoryName: "Laptop"
    //         },            
    //         {
    //             categoryID: uuid(), 
    //             categoryName: "Mobile"
    //         },
    //         {
    //             categoryID: uuid(), 
    //             categoryName: "Computer"
    //         }
    //     ]
    // ;
    // const navigation = useNavigation();
    //console.log("adminhome");
    //Categories state
    const [categories, setCategories] = useState([]);
    const [categoryNameInput, setCategoryNameInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [addUpdateButton, setAddUpdateButton] = useState("Add");
    const [updateCategoryFlag, setUpdateCategoryFlag] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [updateView, setUpdateView] = useState('');

    const goToCategory = (categoryID) => {
        //console.log(productID);
        navigation.navigate("AdminListOfProducts", {categoryID});
    }

    //store data in local storage
    const storeData = async (categoryData) => {
        setIsLoading(true);
        try {  
            const jsonValue = JSON.stringify(categoryData)
            await AsyncStorage.setItem('categories', jsonValue)
            if(updateView) {
                setUpdateView(false);
            }else{
                setUpdateView(true);
            }
            //const getData= await AsyncStorage.getItem('categories');
            //console.log(JSON.parse(getData));
            setIsLoading(false);
        } catch (e) {
          alert(e);
          setIsLoading(false);
        }
    }

    //storeData(demoCategories);
    //getting categories
    // const getCategories = async() => {
    //     try{
    //         await AsyncStorage.getItem('categories').then(
    //             (data)=> {
    //                 if(data == null){
    //                     console.log("data is null");
    //                 }else{
    //                     setCategories(JSON.parse(data));
    //                     //console.log(data);
    //                 }
    //             });
    //     } catch(e){ 
    //         console.log(e);
    //     }
    // }

    //Below will fetch the categories.
    useEffect(() => {
        (async ()=> {
            try{
                await AsyncStorage.getItem('categories').then(
                    (data)=> {
                        if(data == null){
                            console.log("data is null");
                        }else{
                            setCategories(JSON.parse(data));
                            //console.log(data);
                        }
                    });
            } catch(e){ 
                console.log(e);
            }
        })();
    }, [updateView]);
    //to get the inital categories
    //getCategories();

    //this function will make a object of category and send it to store data function 
    //to save it in the local storage
    const addUpdateCategory = () => {
        //console.log(categoryName);
        if(categoryNameInput.length == 0){
            alert("Category Name cannot be empty");
        }else{
            let data = categories;
            if(updateCategoryFlag){
                for(let i = 0; i < data.length; i++){
                    if(data[i].categoryID == selectedCategory){
                        data[i].categoryName = categoryNameInput;
                    }
                }
            }else{
                let categoryObj =  { 
                    categoryID: uuid(), 
                    categoryName: categoryNameInput
                    }
                data.push(categoryObj);
            }
            storeData(data);
        }
        setCategoryNameInput("");
        setAddUpdateButton("Add");
        setUpdateCategoryFlag(false);
    }

    //edit category
    const editCategory = (item) => {
        setAddUpdateButton("Update");
        setUpdateCategoryFlag(true);
        setSelectedCategory(item.categoryID);
        setCategoryNameInput(item.categoryName);
    }
    //delete category
    const deleteCategory = (item) => {
        let data=  categories;
        data = data.filter((items) => items.categoryID !== item.categoryID);
        storeData(data);
    }

    //Logout 
    const logout = () => {
        navigation.replace('WelcomeScreen');
    }

    return (
        <View>
            <ActivityIndicator style = {styles.activityIndicator} animating = {isLoading} size="large" color ={ colors.primary }/>
            <View style = {topBarStyles.topBar}>
                <Text style = {topBarStyles.userNameStyle}>Welcome, Admin</Text>
                <MaterialCommunityIcons style= {topBarStyles.cartIcon} name="power-standby" color={'red'} size={30} onPress={()=> {logout()}}/>               
                {/* <MaterialCommunityIcons style= {topBarStyles.cartIcon} name="cart-outline" color={colors.primary} size={33} onPress={()=> {goToCart()}}/> */}
            </View>
            <View style = {styles.addCategoryItems}>
                <TextInput 
                    style = {styles.elemetns} 
                    placeholder='Category Name'
                    value = {categoryNameInput}
                    onChangeText={(value)=> {setCategoryNameInput(value)}}
                />
                <Button color={colors.primary} onPress = {()=>addUpdateCategory()} title={addUpdateButton}/>
            </View>
            
            <FlatList
                data = { categories }
                renderItem = {({item}) => 
                    <Swipeable renderRightActions={()=>
                        <View style={{width: 75, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            {/* Edit Element */}
                            <MaterialCommunityIcons name="square-edit-outline" color={colors.warning} size={30} onPress={()=> {editCategory(item)}}/>
                            {/* Delete Element */}
                            <MaterialCommunityIcons name="trash-can-outline" color={colors.danger} size={30} onPress={()=> {deleteCategory(item)}}/>
                        </View>}
                        >
                        <TouchableOpacity style = {styles.listItem} onPress ={ () => goToCategory(item.categoryID)}>
                            <View style = {styles.listItemView}>
                                <Text style = {styles.text}>{item.categoryName}</Text>
                            </View>
                        </TouchableOpacity>
                    </Swipeable>
                }
            />  
        </View>
    )
}

const styles = StyleSheet.create({
    elemetns: {
        fontSize: 17,
        textAlign: 'center',
        height: 40,
        margin: 12,
        width: "70%",
        borderWidth: 1,
        borderColor: colors.primaryLight,
        padding: 10,
        borderRadius: 30
    },
    listItem: {
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1,
        borderBottomEndRadius: 15,
        borderTopEndRadius: 15,
        alignItems:"center"
    },
    text: {
        margin: 10,
        fontSize: 18,
    },   
    addCategoryItems: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginLeft: "5%",
        marginRight: "5%",
        // height: 50,
    },
    activityIndicator: {
        alignItems: "center", 
        justifyContent: "center", 
        position:"absolute", 
        left: 0, 
        right: 0, 
        top: 0, 
        bottom: 0
    }
})

export default AdminHome;