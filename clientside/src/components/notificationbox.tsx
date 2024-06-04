import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Socket } from "dgram";
import React, { useState, useEffect } from "react";
import { io } from 'socket.io-client';

const socket = io('http://localhost:8081');
interface NotificationProp{
    isDarkTheme:boolean
    username:string,
    profile_uri:string
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
const NotificationBox: React.FC<NotificationProp> = ({isDarkTheme,username,profile_uri}) => {
   
    const [message,setMessage]=useState<string>("")
    const [serverMessage,setServerMessage]=useState<ReceivedMessageProp[]>([])
    const [initialdata,setInitialData]=useState<NotificationMessageProp[]>([])
    const [showmessage,setShowMessage]=useState<boolean>(false)
    const [notification_length,setNotificationLength]=useState<number>(0)
   
  
    const MessageHandler=(e:React.ChangeEvent<HTMLInputElement>)=>{
       setMessage(e.target.value)
    }
    const sendHandler=()=>{
        console.log('btn')
        socket.emit('user-message',username,profile_uri,message)
    }
  
    useEffect(() => {
        // This will log when the client connects to the server
        socket.on('connect', () => {
            console.log('Connected to server', socket.id);
        });
        socket.on('initial-data-sent',(data)=>{
          
            setInitialData(data.message)
           
        })
        // Listen for 'server-message' events from the server
        socket.on('server-message', (data) => {
            
            setServerMessage(prevserverMessage=>[...prevserverMessage,data.message])
           
        });

        // Clean up event listeners on component unmount
        return () => {
            socket.off('connect');
            socket.off('server-message');
        };
    }, []);
    
    useEffect(()=>{
        if('serviceWorker' in navigator){
            console.log('service worker supported')
        }
       socket.emit('initial-data')
    },[])
    useEffect(()=>{
        setNotificationLength(serverMessage.length)
        
    },[serverMessage.length])
    
    return (
    <>
        
        <div className=" w-52 h-48    border-gray-100 fixed rounded-xl" style={{ left: '78%' }}>
        <div className="fixed border w-24" style={{left:'90%'}}  >
        <FontAwesomeIcon icon={faEnvelope} size="2x" className={`${isDarkTheme?'text-slate-200':'text-slate-700'}`}onClick={()=>setShowMessage(!showmessage)}/>
        <div className=" flex justify-center items-center absolute left-6  w-5 rounded-full top-0 bg-red-800"><span className="text-slate-200 text-sm   ">{notification_length!=0?notification_length:""}</span></div>
        </div>
        
            {showmessage?
            (
                <div className="flex flex-col mt-10 w-72 h-48 bg-white border rounded-lg overflow-auto">
       
                <input type="text" value={message} onChange={MessageHandler}/>
                <button type="submit" onClick={()=>sendHandler()}>Submit</button>
                <ul>
               
                {serverMessage.map((msg, index) => {
                    const {username,profile_uri,message}=msg
                    return(
                     <div>
                       
                           <li key={index}>
                          
                           <div className="flex flex-row mb-2 items-center" >
                           <span><img src={profile_uri} className="w-7 rounded-full"/></span>
                            <span className="text-sm mr-2">{username} </span>
                           
                            <span className="border border-gray-400 w-28 pl-2">{message}</span>
                           </div>
                            </li>
                     </div>
                    )
                })}
                 {initialdata&&initialdata.map((message,idx)=>{
                            
                            
                           
                            return(
                                <ul>
                                    <li  key={idx}>
                                    <div className="flex flex-row mb-2 items-center" >
                                        <span><img src={message.profile_uri} className="w-7 rounded-full"/></span>
                                            <span className="text-sm mr-2">{message.username} </span>
                                        
                                            <span className="border border-gray-400 w-28 pl-2">{message.notification_message}</span>
                                        </div>
                                    </li>
                                </ul>
                            )
                        })}  
            </ul>
            </div>):""}
        </div>  
    </>
    );
}

export default NotificationBox;