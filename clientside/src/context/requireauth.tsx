import React,{useContext} from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthHook from "../hooks/authhook";
import { AuthContext } from "./authcontext";
const RequireAuth:React.FC=()=>{
    const auth=AuthHook()
    const user_login_status=window.localStorage.getItem("user_login_status")
    return(
      auth?.isAuthenticated || user_login_status?<Outlet/>:<Navigate to="/login"/>
    )
}
export default RequireAuth