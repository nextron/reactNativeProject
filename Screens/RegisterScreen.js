import { useNavigation } from "@react-navigation/native";
import { Button, StyleSheet, View, TextInput, Text } from "react-native"
import colors from "../config/colors";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from "react-uuid";

function RegisterScreen() {
    const navigation = useNavigation();
    const [userNameInput, setUserNameInput]= useState('');
    const [userFullNameInput, setUserFullNameInput]= useState('');
    const [users, setUsers] = useState([]);
    //store data in local storage
    const storeData = async (loggedUser ,categoryData) => {
        try {  
            const jsonValue = JSON.stringify(categoryData);
            const userObj = JSON.stringify(loggedUser)
            await AsyncStorage.setItem('loggedInUser', userObj)
            await AsyncStorage.setItem('users', jsonValue);
            navigation.replace("Customer");
            //navigation.pop();
            //const getData= await AsyncStorage.getItem('categories');
            //console.log(JSON.parse(getData));
        } catch (e) {
            alert(e);
        }
    }

    //Below will fetch the users.
    useEffect(() => {
        (async ()=> {
            try{
                await AsyncStorage.getItem('users').then(
                    (data)=> {
                        if(data == null){
                            console.log("data is null");
                        }else{
                            setUsers(JSON.parse(data));
                            //console.log(data);
                        }
                    });
            } catch(e){ 
                console.log(e);
            }
        })();
    }, []);

    //function to add user to local storage
    const addUser = () => {
        if(userNameInput == "" || userFullNameInput == ""){
            alert("Input Fields cannot be empty");
            return;
        }
        let userObj = {
            userId: uuid(),
            userName: userNameInput,
            userFullName: userFullNameInput
        }
        let data = users;
        let userAddFlag = true;
        if(data.length == 0){
            data.push(userObj);
        }else{
            for(let i = 0; i < data.length; i++){
                if(data[i].userName == userNameInput){
                    userAddFlag = false;
                }
            }
            data.push(userObj);
        }
        //console.log(data);
        if(userAddFlag){
            storeData(userObj,data);
        }else{
            alert("UserName already exists. Please try with another User Name")
        }
        
    }

    return (
        <View style= {styles.welcome}>
            <View>
                <TextInput
                    style = {styles.elemetns} 
                    placeholder='User Name'
                    value = {userNameInput}
                    autoCapitalize='none'
                    onChangeText={(value)=> {setUserNameInput(value)}}
                />
                <TextInput
                    style = {styles.elemetns} 
                    placeholder='Full Name'
                    value = {userFullNameInput}
                    onChangeText={(value)=> {setUserFullNameInput(value)}}
                />
                <MaterialCommunityIcons style = {styles.buttonStyle} name="arrow-right-circle" color={colors.primary} size={45} onPress={()=> {addUser()}}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    welcome:{
        alignItems: 'center',
        marginTop: "50%",
        // justifyContent: 'center',
        flex: 1
    },elemetns: {
        fontSize: 17,
        textAlign: 'center',
        height: 40,
        margin: 12,
        width: 300,
        borderWidth: 1,
        padding: 10,
        borderColor: colors.primaryLight,
        borderRadius: 30
    },buttonStyle:{
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: "10%",
        marginLeft: "32%",
    },shoppingAppLogo: {
        fontFamily: 'Cochin',
        fontSize: 32,
        position:"relative", 
        color: colors.primary,
        marginTop: "20%",
        marginBottom: "35%",
    }
});

export default RegisterScreen;