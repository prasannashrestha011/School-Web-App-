import React,{useState,createContext, ReactNode} from "react";
interface AuthType{
    isAuthenticated:boolean
}
const AuthContext=createContext<AuthType |null>(null)

const AuthProvider:React.FC<{children:ReactNode}>=({children})=>{
    const [isAuthenticated,setIsAuthenticated]=useState<boolean>(()=>{
        const savedStatus=window.localStorage.getItem("user_login_status")
        return savedStatus ? JSON.parse(savedStatus) : false
    })
    return(
        <AuthContext.Provider value={{isAuthenticated}}>
            {children}
        </AuthContext.Provider>
    )
}
export  {AuthContext,AuthProvider}