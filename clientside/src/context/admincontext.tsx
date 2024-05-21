import React,{useState,createContext, ReactNode} from "react";
import { Outlet } from "react-router-dom";
interface AdminProp{
    isAdmin:string
    setIsAdmin:(isAdmin:string)=>void
}
const AdminContext=createContext<AdminProp | null>(null)
const  AdminProvider:React.FC=()=>{
    const [isAdmin,setIsAdmin]=useState<string>("")
    return(
        <AdminContext.Provider value={{isAdmin,setIsAdmin}}>
           <Outlet/>
        </AdminContext.Provider>
    )
}
export {AdminProvider,AdminContext}
