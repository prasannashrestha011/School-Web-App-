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
    }
    return(
        <div>
          
           <form onSubmit={SubmitHandler}>
           <input type="text" className="w-20 border border-black" value={message || ''} onChange={MessageChangeHandler}/>
           <button type="submit">Submit</button>
           </form>
        </div>
    )
}
export default SendNotification