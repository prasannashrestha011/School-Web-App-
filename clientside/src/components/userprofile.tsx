import axios from "axios";
import React,{useState,useEffect, useRef, HTMLAttributeAnchorTarget} from "react";
interface UserProp{
    id:string,
    name:string,
    email:string,
    profileURL:string
    showprofile:boolean,
    setShowProfile:(showprofile:boolean)=>void
}
const UserProfile:React.FC<UserProp>=({id,showprofile,setShowProfile})=>{
    const [fetched_user,setFetchedUser]=useState<UserProp>()
    const modalRef=useRef<HTMLDivElement>(null)
    const fetchUser=async()=>{
       try{
        const response=await axios.get(`http://localhost:8080/get-user-info/${id}`)
        if (response.status!==200) throw new Error('error')
            setFetchedUser(response.data)
            console.log(response.data,"is from userprofile")
       }catch(err){
        console.log(err)
       }
    }
    const CloseModel=(e:React.MouseEvent<HTMLDivElement>)=>{
        if(modalRef.current==e.target){
            setShowProfile(!showprofile)
        }
    }
    useEffect(()=>{
        fetchUser()
    },[])
    return(
        <div ref={modalRef} onClick={CloseModel}className="fixed inset-0 flex items-center justify-center  bg-opacity-75 backdrop-blur-sm">
            <div className="flex flex-col items-start bg-slate-200 h-96 p-3 bg-opacity-90 rounded-xl text-2xl border-4 border-gray-600">
                <div className=" w-96 flex  justify-center"><p><img src={fetched_user?.profileURL} className="rounded-xl" /></p>
                    </div>
                <p>Name:{fetched_user?.name}</p>
                <p>Email:{fetched_user?.email}</p>
                
            </div>
        </div>
    )
}
export default UserProfile