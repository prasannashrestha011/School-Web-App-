import React,{ReactNode, useEffect, useState} from "react";
import NavBar from "./navbar";
import ComponentHook from "../hooks/componenthook";
import axios from "axios";
import AuthHook from "../hooks/authhook";
import { Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
interface UserProp{
    id:string,
    email:string,
    name:string,
    profileURL:string,
    verified_email:boolean
}
const Layout:React.FC=()=>{
    const component_state=AuthHook()
    const userID=window.localStorage.getItem("userID")
    const [show_nav_bar,setShowNavBar]=useState<boolean>(false)
    const [fetchUserDetails,setFetchUserDetails]=useState<UserProp | null>(null)
    const fetchUser=async()=>{
        try{
            const response=await axios.get(`http://localhost:8080/get-user-info/${userID}`)
         if(response.status!=200) throw new Error("Error")
        
            setFetchUserDetails(response.data)
        }catch(err){
            console.log(err)
            }
    }
    useEffect(()=>{
        fetchUser()
    },[])
    const NavBarHandler=()=>{
        setShowNavBar(!show_nav_bar)
      }
    return(
      <div>
        
          <div>
          <div className={`fixed left-3 'text-slate-200':'text-slate-950'} `} onClick={()=>NavBarHandler()}><FontAwesomeIcon icon={faBars} size="2x"/></div>
        {fetchUserDetails?  <NavBar show_nav_bar={show_nav_bar} setShowNavBar={setShowNavBar} username={fetchUserDetails?.name} profileURL={fetchUserDetails?.profileURL}/>:""}
    
        </div>
        <div>
           <Outlet/>
        </div>
      </div>
    )
}
export default Layout