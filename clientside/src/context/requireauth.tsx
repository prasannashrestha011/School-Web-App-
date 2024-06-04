import React,{useContext, useEffect} from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import AuthHook from "../hooks/authhook";
import { AuthContext } from "./authcontext";
const RequireAuth:React.FC=()=>{
    const auth=AuthHook()
    const userLoginStatus=window.localStorage.getItem("account_state")
    const navigate=useNavigate()
   

    const user_login_status=window.localStorage.getItem("account_state")
    return(
      auth?.isAuthenticated || user_login_status?<Outlet/>:<Navigate to="/login"/>
    )
}
export default RequireAuth