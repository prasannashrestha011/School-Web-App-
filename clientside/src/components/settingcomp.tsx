import { faCircle, faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React,{useState,useEffect} from "react";
import ToggleBtn from "./togglebtn";
import ComponentHook from "../hooks/componenthook";
interface SettingProp{
    isDarkTheme:boolean | null,
    setIsDarkTheme:(isDarkTheme:boolean)=>void
}
const Setting:React.FC<SettingProp>=({isDarkTheme,setIsDarkTheme})=>{
    const component_state=ComponentHook()
    const ThemeHandler=()=>{
        setIsDarkTheme(!isDarkTheme)
        window.localStorage.setItem('page-theme',JSON.stringify(isDarkTheme))
    }
    const storedThemeString = window.localStorage.getItem('page-theme');
    const storedTheme = storedThemeString === 'true'; // Convert string to boolean
    return(
      <div className={` rounded-md border ${storedTheme?'bg-slate-950 border-gray-500':'bg-slate-200 border-gray-500'} transition-colors duration-300 w-48 h-48 fixed `} style={{left:'85%',top:'8%'}} >
            <div className={`${storedTheme?'text-slate-200 ':'text-slate-950'} flex item-center justify-center border-b-2 border-gray-500`}>Setting</div>
            <div className={`flex flex-row justify-between  gap-3 mt-2 pl-2 pr-2 pb-2 border-b-2 border-gray-400  ${storedTheme?'text-slate-200':'text-slate-950'} transition-colors duration-300`}>
            <span> Theme</span>
            <div className={`border border-gray-400 rounded-lg h-8 pl-1 w-16  `}    onClick={()=>ThemeHandler()}>
             <div  className={`${storedTheme?'translate-x-8':'translate-x-0'} duration-300`}
             style={{fontSize:'21px'}} >
                <FontAwesomeIcon icon={faCircle} />
                </div>
             </div>
            </div>
      </div>
    )
}
export default Setting