import axios from "axios";
import '@fontsource/vt323';
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import React,{useState,useEffect} from "react";
import { io } from "socket.io-client";
const socket=io('http://localhost:8081')
interface ReceivedMessageProp{
    username:string,
    profile_uri:string,
    message:string,
   
    
}
interface DashBoardMessageProp{
    id:number,
    username:string,
    profile_uri:string,
    time_uploaded:string,
    message:string,
}
const DashBoard:React.FC=()=>{
    const [dashboardMessage,setDashBoardMessage]=useState<ReceivedMessageProp[]>([])
    const [fetched_dashboard_message,setFetchedDashBoardMessage]=useState<DashBoardMessageProp[]>([])
    const fetchDashBoardMsg=async()=>{
        try{
            const response=await axios.get('http://localhost:8080/get-dashboard-messages')
            if(response.status!=200) throw new Error('error')
                
                setFetchedDashBoardMessage(response.data)  
        }catch(err){
            console.log(err)
        }
    }
    useEffect(()=>{
        fetchDashBoardMsg()
    },[])
    useEffect(()=>{
   
        socket.on('connect',()=>{
            console.log('Connected to dashboard server ',socket.id)
        })
       socket.on('dashboard-sent-message',(data)=>{
            setDashBoardMessage(prevDashBoardMessage=>[...prevDashBoardMessage,data.message])
            console.log(data.message)
       })
       return ()=>{
        socket.off('dashboard-sent-message')
       }
    },[])
    return(
        <div className=" h-56  overflow-x-auto   mt-14 ml-80 bg-slate-950 border border-black rounded-md scroll-m-1" style={{width:'50%'}}>
            <div className=" flex flex-row  items-center justify-center font-semibold bg-blue-950 text-slate-300 shadow-custom-black ">
                <p style={{ fontFamily: 'VT323, monospace' }} className="text-xl">Activities</p>
            </div>
            {dashboardMessage.map((item,idx)=>{
                return(
                    <div key={idx} className=" flex flex-col gap-2">
                    <div>
                      
                    </div>
                    <div className=" flex flex-row gap-10 pl-2">
                        <div className=" w-44 h-11 flex flex-row items-center gap-1  shadow-custom-black  border-black text-slate-50" style={{ fontFamily: 'VT323, monospace' }}>
                        <p><img src={item.profile_uri} className="w-9 pl-1 rounded-full"/></p>
                        <p className=""> {item.username}</p>
                        </div>
                        <div className=" w-72 shadow-custom-black h-11 " style={{ fontFamily: 'VT323, monospace' }}>                                 
                             <p className="text-yellow-400 ">{item.message}</p>
                            <p className=" pl-44  text-gray-500"> {formatDistanceToNow( Date.now(),{ addSuffix: true })}</p>
                        </div>
                       
                    </div>
                    </div>
                )
            })}
            {fetched_dashboard_message.map((item,idx)=>{
                const uploadedTime = new Date(parseInt(item.time_uploaded, 10))
                
                return(
                    <div key={idx} className=" flex flex-col gap-2">
                    <div>
                      
                    </div>
                    <div className=" flex flex-row gap-10 pl-2">
                        <div className=" w-44 h-11 flex flex-row items-center gap-1  shadow-custom-black  border-black text-slate-50" style={{ fontFamily: 'VT323, monospace' }}>
                        <p><img src={item.profile_uri} className="w-9 pl-1 rounded-full"/></p>
                        <p className=""> {item.username}</p>
                        </div>
                        <div className=" w-72 shadow-custom-black h-11 " style={{ fontFamily: 'VT323, monospace' }}>                                 
                             <p className="text-yellow-400 ">{item.message}</p>
                            <p className=" pl-44  text-gray-500"> {formatDistanceToNow( uploadedTime,{ addSuffix: true })}</p>
                        </div>
                       
                    </div>
                    </div>
                )
            })}
        </div>
    )
}
export default DashBoard