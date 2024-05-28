import path from "path";
import React,{useEffect, useState} from "react";
import { Navigate, useLocation } from "react-router-dom";
import ComponentHook from "../hooks/componenthook";
import NavBar from "../components/navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCog, faGear } from "@fortawesome/free-solid-svg-icons";
import Setting from "../components/settingcomp";
const StartTestInterface:React.FC=()=>{
    const [start_test,setStartTest]=useState<Boolean>(false)
    const username=window.localStorage.getItem('user_name')
    const component_state=ComponentHook()
    const [show_setting_panel,setShowSettingPanel]=useState<boolean>(false)
    const [isDarkTheme,setIsDarkTheme]=useState<boolean>(false)
    const storedThemeString = window.localStorage.getItem('page-theme');
    const storedTheme = storedThemeString === 'true'; // Convert string to boolean
    console.log(storedTheme,"is page theme state")
    const NavBarHandler=()=>{
        component_state?.setShowNavBar(!component_state.show_nav_bar)
      }
    const ShowSettingPanelHandler=()=>{
        setShowSettingPanel(!show_setting_panel)
    }
   
   
    return(
        <div className={`${storedTheme?'bg-slate-800':'bg-slate-200'} h-screen transition-colors duration-300`}>
          
           <div className="fixed " style={{left:'95%'}} onClick={()=>ShowSettingPanelHandler()}><FontAwesomeIcon icon={faGear} size="2x"/></div>
            {show_setting_panel&&component_state?<Setting isDarkTheme={component_state?.isDarkTheme} setIsDarkTheme={component_state?.setIsDarkTheme}/>:""}
            {start_test?
            (
                <Navigate to="/class/test" />
            ):(
                <div>
                   {component_state &&username? <div ><NavBar show_nav_bar={component_state?.show_nav_bar} setShowNavBar={component_state?.setShowNavBar} username={username} /></div> :""}
                    <div className="fixed left-3 text-slate-950" onClick={()=>NavBarHandler()}><FontAwesomeIcon icon={faBars} size="2x"/></div>
                    <center>
                <div className="flex flex-col gap-5 justify-center items-center">
                <button onClick={()=>setStartTest(true)} className="bg-red-500 w-44 h-16 text-2xl text-slate-200 font-serif rounded-xl"><p>Start Test</p></button>
                    <span><a href="/message"><button className="bg-red-500 text-2xl w-44 h-14 rounded-xl text-slate-200">Group Chat</button></a></span>
                </div>
                </center>
                </div>
            )}
        </div>
    
    )
}
export default StartTestInterface