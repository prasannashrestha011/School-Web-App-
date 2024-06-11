import axios from 'axios';

import React,{useEffect, useState} from "react";
import AddPdf from "./addpdf";
import { faArrowAltCircleRight, faArrowCircleLeft, faArrowCircleRight, faCircleXmark, faCross, faCrosshairs, faHamburger, faHeartCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { io } from "socket.io-client";
import SendNotification from './sendnotification';
import DashBoard from './dashboard';
import WebTerminal from './terminal';

interface AdminProp{
    google_id:string,
    email:string,
    name:string,
    profileURL:string,
    verify_email:string,
}
interface ReceivedMessageProp{
    username:string,
    profile_uri:string,
    message:string,
   
    
}
interface NotificationMessageProp{
    username:string,
    profile_uri:string,
    notification_message:string
}
const Admin:React.FC=()=>{
  
    const [scorelist,setScoreList]=useState<any[]>([])
    const [fetchUser,setFetchUser]=useState<AdminProp | null>(null)
    const [show_pdf_panel,setShowPdfPanel]=useState<boolean>(false)
    const [show_table_score,setShowTableScore]=useState<boolean>(false)
    const userID=window.localStorage.getItem("userID")
    const [isTerminal,setIsTerminal]=useState<boolean>(false)
    const fetchUserInfo=async()=>{
        try{
            const response = await axios.get(`http://localhost:8080/get-user-info/${userID}`);
            if (response.status !== 200) {
                throw new Error('Error fetching user info');
            }
               
                setFetchUser(response.data)
        }catch(err){
            console.log(err)
        }
    }
    useEffect(()=>{
        fetchUserInfo()
    },[])
    const GetScore=async()=>{
       try{
        const response=await axios.get("http://localhost:8080/get-scores")
        if (response.status!=200) throw new Error('failed to fetch the api')
            setScoreList(response.data)
       }catch(err){
        console.log(err)
       }
    }
  
    useEffect(()=>{
        GetScore()
    },[])
   
    const togglePanel = () => {
       if(show_pdf_panel){
        setShowPdfPanel(false)
       }else{
        setShowPdfPanel(true)
       }
        // Enable or disable scroll depending on the panel visibility
        if (!show_pdf_panel) {
            document.body.style.overflow = 'hidden'; // Disable scrolling
        } 
    };
    const showTerminal=()=>{
        setIsTerminal(!isTerminal)
    }
    return(
        <div className="h-svh border  bg-slate-200 flex flex-row justify-between overflow-hidden">
            <nav className="fixed top-0  w-auto h-10 flex justify-end pr-56 items-center" style={{left:'45%'}}>
            <div className="flex flex-row ">
        
            <button onClick={showTerminal} className='font-modeseven text-2xl'>Open Terminal</button>
            </div>
        </nav>
       
                <DashBoard/>                                  
            <div>
        <div>
            {show_pdf_panel?
            <FontAwesomeIcon icon={faArrowCircleLeft} onClick={togglePanel} size="2x" className=" transition-transform duration-500 "/>
            :<FontAwesomeIcon icon={faArrowCircleRight} onClick={togglePanel} size="2x" className=" transition-transform duration-500 translate-x-48"/>}
        </div>
            <div className={`transition-transform duration-500 ${show_pdf_panel ? '-translate-x-3' : 'translate-x-80'}`}>
               {fetchUser?<AddPdf username={fetchUser?.name} profile_uri={fetchUser.profileURL} show_pdf_panel={show_pdf_panel} setShowPdfPanel={setShowPdfPanel}/>:""}
            </div>
            {fetchUser?<SendNotification username={fetchUser?.name} profile_uri={fetchUser.profileURL} />:""}
        </div>
                {isTerminal?<WebTerminal onClose={()=>setIsTerminal(!isTerminal)}/>:""}
        </div>
    )
}
export default Admin