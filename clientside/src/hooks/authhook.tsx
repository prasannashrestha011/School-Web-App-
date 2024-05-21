import React,{useContext} from "react";
import {AuthContext} from "../context/authcontext";
const AuthHook=()=>{
    return useContext(AuthContext)
}
export default AuthHook