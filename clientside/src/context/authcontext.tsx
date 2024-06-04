import React,{useState,createContext, ReactNode} from "react";
interface AuthType{
    isAuthenticated:boolean
    shownavbar:boolean,
    setShowNavBar:(shownavbar:boolean)=>void
}
const AuthContext=createContext<AuthType |null>(null)

const AuthProvider:React.FC<{children:ReactNode}>=({children})=>{
    const [isAuthenticated,setIsAuthenticated]=useState<boolean>(()=>{
        const savedStatus=window.localStorage.getItem("user_login_status")
        return savedStatus ? JSON.parse(savedStatus) : false
    })
    const [shownavbar,setShowNavBar]=useState<boolean>(false)
    return(
        <AuthContext.Provider value={{isAuthenticated,shownavbar,setShowNavBar}}>
            {children}
        </AuthContext.Provider>
    )
}
export  {AuthContext,AuthProvider}