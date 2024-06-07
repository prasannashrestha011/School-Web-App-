import axios from "axios";
import React,{useEffect, useState} from "react";
interface EventProp{
    id:number,
    username:string,
    profile_uri:string,
    notification_message:string,
}
const EventList:React.FC=()=>{
    const [fetchEvents,setFetchEvents]=useState<EventProp[]>([])
    const FetchEventList=async()=>{
        try{
            const response=await axios.get('http://localhost:8080/get-notifications-list')
            if (response.status!=200) throw new Error('error')
            setFetchEvents(response.data)
            console.log(response.data)
        }catch(err){
            console.log(err)
        }
        
    }
    useEffect(()=>{
        FetchEventList()
    },[])
    return(
        <div className="h-svh border border-yellow-300 ">
            <div className=" h-96 border border-black mx-auto mt-2" style={{width:'50%'}}>
                <ul>
                 {fetchEvents?fetchEvents.map((item,idx)=>{
                    return(
                        <li key={idx}>
                           <div className="flex flex-col mb-2 mt-3 text-xl font-semibold">
                                <div className="flex flex-row gap-2 items-center bg-gray-400 h-14">
                                    <p><img src={item.profile_uri} className="w-10 rounded-full"/></p>
                                    <p>{item.username}</p>
                                </div>
                                <div className="w-full h-14 border border-gray-400 ">
                                 <p>{item.notification_message}</p>
                                </div>
                           </div>
                            
                        </li>
                    )
                 }):""}
                </ul>
            </div>
        </div>
    )
}
export default EventList