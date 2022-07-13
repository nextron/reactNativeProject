import { useNavigation } from "@react-navigation/native";
import { Button, StyleSheet, View, TextInput, Text } from "react-native"
import colors from "../config/colors";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const WelcomeScreen = () => {
    const navigation = useNavigation();
    const [userNameInput, setUserNameInput]= useState('');
    const [users, setUsers] = useState([]);

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

    //store data in local storage
    const storeData = async (loggedInUser) => {
        try {  
            const jsonValue = JSON.stringify(loggedInUser)
            await AsyncStorage.setItem('loggedInUser', jsonValue)
            //const getData= await AsyncStorage.getItem('categories');
            //console.log(JSON.parse(getData));
            navigation.replace('Customer');
        } catch (e) {
            alert(e);
        }
    }
    const goToUser = () => {
        let userObj;
        if(userNameInput == ""){
            alert("Please provide the UserName to continue");
            return;
        }

        if(userNameInput.toLowerCase() == "admin"){
            //alert("Admin");
            // navigation.navigate("Admin");
            navigation.replace('Admin');
            //navigation.replace("Admin");
        }else{
            let data = users;
            //console.log(data);
            for(let i = 0; i < data.length; i++){
                if(data[i].userName == userNameInput){
                    userObj = data[i];
                }
            }
            if(userObj){ 
                storeData(userObj);
            }else{
                alert("User not found. Please register to continue.");
            }
            //alert("non-Admin");
        }
    }

    const goToRegister = () => {
        navigation.navigate("RegisterScreen");
    }

    return(
        <View style= {styles.welcome}>
            <Text style = {styles.shoppingAppLogo}>Shopping APP</Text>
            <View style = {styles.inLineLoginInputs}>
                <TextInput
                    style = {styles.elemetns} 
                    placeholder='User Name'
                    value = {userNameInput}
                    autoCapitalize='none'
                    onChangeText={(value)=> {setUserNameInput(value)}}
                />
                <MaterialCommunityIcons name="arrow-right-circle" color={colors.primary} size={33} onPress={()=> {goToUser()}}/>
            </View>
            <Button onPress={()=> goToRegister()} color={colors.primary} title = "Register"></Button>
        </View>
    )
}

const styles = StyleSheet.create({
    welcome:{
        alignItems: 'center',
        flex: 1
    },elemetns: {
        fontSize: 17,
        textAlign: 'center',
        height: 40,
        margin: 12,
        width: "70%",
        borderWidth: 1,
        padding: 10,
        borderColor: colors.primaryLight,
        borderRadius: 30
    },inLineLoginInputs:{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginLeft: "5%",
        marginRight: "5%",
    },shoppingAppLogo: {
        // fontFamily: 'Cochin',
        fontSize: 32,
        position:"relative", 
        color: colors.primary,
        marginTop: "45%",
        marginBottom: "35%",
    }
});

export default WelcomeScreen;