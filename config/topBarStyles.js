import { StyleSheet } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
    topBar: {
        marginTop: "12%",
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        height: 33
    }, 
    userNameStyle:{
        fontSize: 18,
        color: colors.medium
    },
    cartIcon: {
        position: 'absolute',
        top: 0,
        left: "88%",
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        // marginRight: 15
    },
    logOutButton: {
        position: 'absolute',
        top: 0,
        left: "5%",
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        // marginRight: 15
    }
})