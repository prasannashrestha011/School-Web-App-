import React,{useState,useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars,faBook,faGroupArrowsRotate,faHome, faNoteSticky, faUser, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import UserProfile from "./userprofile";

interface NavBarProp{
    show_nav_bar: boolean | null,
    setShowNavBar:(show_nav_bar:boolean)=>void 
    username:string
    profileURL:string
}

const NavBar:React.FC<NavBarProp>=({show_nav_bar,setShowNavBar,username,profileURL})=>{
   const location=useLocation();
    const [show_user_profile,setShowUserProfile]=useState<boolean>(false)
    const id=window.localStorage.getItem("userID")
    const ProfileHandler=()=>{
        console.log("acc")
        setShowUserProfile(!show_user_profile)
    }
    return(
        <div>
            {show_user_profile?id?<UserProfile id={id} name={""} email={""} profileURL={""} showprofile={show_user_profile} setShowProfile={setShowUserProfile}/>:"":""}
            <div className={`flex flex-col justify-start items-start w-80 h-svh fixed top-0 pl-4 pt-5 border border-gray-500 gap-5 bg-blue-700 z-10 ${show_nav_bar?'translate-x-0':'-translate-x-96'} transition-transform duration-500`}>
                
                <span className="fixed left-6 text-slate-200 text-xl font-semibold flex flex-row justify-center items-center gap-1" onClick={()=>ProfileHandler()} ><FontAwesomeIcon icon={faUser} /><img src={profileURL} className="w-9 rounded-full" />{username}</span>
               
                <span className="fixed left-72 text-slate-300  " onClick={()=>setShowNavBar(!show_nav_bar)}><FontAwesomeIcon icon={faBars} size="2x" /></span>
                 <div className="text-slate-300 flex flex-col gap-5 mt-12 text-xl font-semibold w-72 h-80  ">
                    
                 <a href="/home" className={`${location.pathname=='/home'?'bg-slate-200 text-blue-700 rounded-xl':''} pl-2 active:bg-blue-800 rounded-xl`}> <span className="flex flex-row gap-3 justify-start items-center h-14"><FontAwesomeIcon icon={faHome}/>Home</span> </a>
                    <a href="/message" className={`${location.pathname=='/message'?'bg-slate-200 text-blue-700 rounded-xl':''} pl-2 active:bg-blue-800 rounded-xl`}> <span className="flex flex-row gap-3 justify-start items-center h-14"><FontAwesomeIcon icon={faUserGroup}/>GroupChat</span> </a>
                    <a href="/notes" className={`${location.pathname=='/notes'?'bg-slate-200 text-blue-700 rounded-xl':''} pl-2 active:bg-blue-800 rounded-xl`}> <span className="flex flex-row gap-3 justify-start items-center h-14"><FontAwesomeIcon icon={faBook}/>Notes</span> </a>
                 
                 </div>
            </div>
        </div>
    )
}
export default NavBar