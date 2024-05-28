import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React,{useState} from "react";
interface ToggleProp{
    isDarkTheme:boolean
    setIsDarkTheme:(isDarkTheme:boolean)=>void
}
const ToggleBtn:React.FC<ToggleProp>=({isDarkTheme,setIsDarkTheme})=>{
    const ThemeHandler=()=>{
        setIsDarkTheme(!isDarkTheme)
        
    }
    return(
        <div className=" border  w-16 mt-2">
            <div  className={`${isDarkTheme?'translate-x-10':'translate-x-0'} duration-300`}
            onClick={()=>ThemeHandler()}
             style={{fontSize:'21px'}} ><FontAwesomeIcon icon={faCircle} /></div>
        </div>
    )
}
export default ToggleBtn