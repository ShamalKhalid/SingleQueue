import React,{useState} from "react";

export const AuthContext = () =>{

    const [isLoggedIn,setLoggedIn] = useState(false)

    return isLoggedIn

}