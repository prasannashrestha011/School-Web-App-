import path from "path";
import React,{useEffect, useState} from "react";
import { Navigate, useLocation } from "react-router-dom";
import ComponentHook from "../hooks/componenthook";
import NavBar from "../components/navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCog, faEnvelope, faGear, faMessage } from "@fortawesome/free-solid-svg-icons";
import Setting from "../components/settingcomp";
import NotificationBox from "../components/notificationbox";
import axios from "axios";
import { GenerateToken } from "../pushnotification/firebase";
import EventList from "./event";
interface UserProp{
    id:string,
    name:string,
    email:string,
    profileURL:string
    showprofile:boolean,
    setShowProfile:(showprofile:boolean)=>void
}
const StartTestInterface:React.FC=()=>{
    const id=window.localStorage.getItem('userID')
    const [start_test,setStartTest]=useState<Boolean>(false)
    const username=window.localStorage.getItem('user_name')
    const component_state=ComponentHook()
    const [show_setting_panel,setShowSettingPanel]=useState<boolean>(false)
    const [isDarkTheme,setIsDarkTheme]=useState<boolean>(false)
    const [isNotificationEnabled,setIsNotificationEnabled]=useState<boolean>(false)
    const storedThemeString = window.localStorage.getItem('page-theme');
    const isDarkThemeEnb = storedThemeString === 'true'; // Convert string to boolean
    const [fetched_user,setFetchedUser]=useState<UserProp>()
    const fetchUser=async()=>{
        try{
         const response=await axios.get(`http://localhost:8080/get-user-info/${id}`)
         if (response.status!==200) throw new Error('error')
             setFetchedUser(response.data)
             
        }catch(err){
         console.log(err)
        }
     }
     useEffect(()=>{
         fetchUser()
     },[])
    const NavBarHandler=()=>{
        component_state?.setShowNavBar(!component_state.show_nav_bar)
      }
    const ShowSettingPanelHandler=()=>{
        setShowSettingPanel(!show_setting_panel)
    }
   
   useEffect(()=>{
    if(fetched_user){
        GenerateToken(fetched_user.name)
    }
   },[fetched_user])
    return(
        <div className={`${isDarkThemeEnb?'bg-blue-950':'bg-slate-200'} h-screen transition-colors duration-300`}>
            
            {fetched_user?
            <NotificationBox isDarkTheme={isDarkThemeEnb} username={fetched_user?.name} profile_uri={fetched_user?.profileURL}/>
            :
            ""}
           <div className="fixed " style={{left:'95%'}} onClick={()=>ShowSettingPanelHandler()}>
            <FontAwesomeIcon className={`${isDarkThemeEnb?'text-slate-200':'text-slate-950'}`} icon={faGear} size="2x"/>
            </div>
            
            {show_setting_panel&&component_state?
            <Setting isDarkTheme={component_state?.isDarkTheme} setIsDarkTheme={component_state?.setIsDarkTheme}/>
            :""}
            {start_test?
            (
                <Navigate to="/class/test" />
            ):(
                <div>
                  

                    <center>
                <div className="flex gap-5 justify-center items-center flex-row  shadow-custom-black ">
                <button onClick={()=>setStartTest(true)} className={` w-28 h-16 text-xl ${isDarkThemeEnb?'text-slate-200':'text-gray-950'} font-semibold  hover:bg-gray-300  transition duration-300`}><p>Start Test</p></button>
                <span><a href="/message"><button className={` text-xl w-28 h-16 ${isDarkThemeEnb?'text-slate-200':'text-gray-950'} font-semibold hover:bg-gray-300  transition duration-300`}>Group Chat</button></a></span>
                </div>
                </center>
               
                </div>
            )}
        </div>
    
    )
}
export default StartTestInterface