import React,{useState,useEffect} from "react";
import { io } from "socket.io-client";
interface AdminProp{
    username:string,
    profile_uri:string
}
interface NotificationMessageProp{
    username:string,
    profile_uri:string,
    notification_message:string
}
const socket=io('http://localhost:8081')

const SendNotification:React.FC<AdminProp>=({username,profile_uri,})=>{
    const [message,SetMessage]=useState<string>("")
    useEffect(()=>{
        socket.on('connect',()=>{
            console.log('Admin connected to socket io',socket.id)
        })
    },[])
    const MessageChangeHandler=(e:React.ChangeEvent<HTMLInputElement>)=>{
       SetMessage(e.target.value)
    }
    const SubmitHandler=(e:React.FormEvent)=>{
        e.preventDefault()
        socket.emit('user-message',username,profile_uri,message)
        socket.emit('dashboard-message',username,profile_uri,Date.now(),`New Notification was sent by ${username}`)
        SetMessage('')
    }
    return(
        <div className="border border-black mr-10 rounded-xl pt-2 ">
          
           <form onSubmit={SubmitHandler} className="flex flex-col items-center gap-4 pb-4 ">
            <p>Send Notification</p>
            <input type="text" className="w-44 h-9 border border-black" value={message || ''} onChange={MessageChangeHandler}/>
            <button type="submit" className="bg-blue-950 text-slate-200 w-40 h-9 rounded-lg">Submit</button>
           </form>
        </div>
    )
}
export default SendNotification