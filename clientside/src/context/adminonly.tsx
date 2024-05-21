import React from "react";
import { Outlet } from "react-router-dom";
import AdminHook from "../hooks/adminhook";
const AdminOnly:React.FC=()=>{
    const Admin=AdminHook()
    const UserRole=window.localStorage.getItem('user_role')
    return(
       Admin?.isAdmin=="ADMIN" || UserRole=="ADMIN"? <Outlet/>:<center><h1>Unauthorized</h1></center>
    )
}
export default AdminOnly