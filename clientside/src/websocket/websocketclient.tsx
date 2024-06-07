import axios from "axios";
import React, { FormEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleUp,faBars,faFolder } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../components/navbar";
import ComponentHook from "../hooks/componenthook";
import '../css/websocketioclient.css'
interface UserProp{
    id:string,
    email:string,
    name:string,
    profileURL:string,
    verified_email:boolean
}
const WebSocketClient: React.FC = () => {
   const [message,setMessage]=useState<string>("")
   const [filemessage,setFileMessage]=useState<File | null>()
   const [socket,setSocket]=useState<WebSocket | null>(null)
   const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
    const Username=window.localStorage.getItem("userIdentity")
    const latestMessageRef=useRef<HTMLDivElement>(null)
    const component_state=ComponentHook()

    const userID=window.localStorage.getItem("userID")
    const [fetchUserDetails,setFetchUserDetails]=useState<UserProp | null>(null)
    const fetchUser=async()=>{
        const img=new Image()
        try{
            const response=await axios.get(`http://localhost:8080/get-user-info/${userID}`)
         if(response.status!=200) throw new Error("Error")
            if(response.data){
                  
                img.src = response.data.profileURL;
                console.log(response.data.profileURL)
         img.onload = () => {
            console.log('all ok')
            setFetchUserDetails(response.data);
         };
        
    img.onerror = (error) => {
        console.error('Error loading image:', error);
        // Handle the error here, e.g., display a placeholder image
    };
       
            }
            
        }catch(err){
            console.log(err)
            }
    }
    useEffect(()=>{
        fetchUser()
     
    },[])
   useEffect(()=>{
    if(fetchUserDetails){
    
        const socket=new WebSocket(`ws://localhost:8080/ws?username=${fetchUserDetails.name}&profile_uri=${fetchUserDetails.profileURL}`)
        setSocket(socket)
        
          
        return ()=>{
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        }
    }
    
   },[fetchUserDetails])
   useEffect(()=>{
    if (!socket) return;
    socket.onopen=()=>{
        console.log("Connection established")
       
    }
    socket.onmessage=(event)=>{
       
     
        setReceivedMessages(prevMessages => [...prevMessages, String(event.data)]);
    }
    
    socket.onerror=(err)=>{
        console.log(err)
    }
    socket.onclose=()=>{
        console.log("Connection terminated")
    }
    
    return ()=>{
        socket.onopen=null
        socket.onmessage=null
        socket.onerror=null
        socket.onclose=null
    }
   },[socket])


   const todb=async(username:string,message:string)=>{
    try{
        const response=await axios.post(`http://localhost:8080/insert-messages/${fetchUserDetails?.name}`,{message:message})
        if(response.status!=200) throw new Error("failed to insert data")
            console.log(response.data.message)
    }catch(err){
        console.log(err)
    }
}
   
   const fileHandler=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const files = e.target.files;
    if (files && files[0]) {
      setFileMessage(files[0]);
    }
   }
   const sendFile=async()=>{
    var formdata
    if (filemessage){
         formdata=new FormData()
        formdata.append('img-msg',filemessage)
    }
    try{
        const response=await axios.post(`http://localhost:8080/upload-image`,formdata)
        if (response.status!=200) throw new Error("failed")
            console.log(response.data.message)
            socket?.send(response.data.message)
         
           

    }catch(err){
        console.log(err)
    }
   }


   const sendMessage=async(e:FormEvent)=>{
    e.preventDefault()

    
    if(socket && message.trim() !="")
        {
            socket.send(message)

            console.log('message sent')
            
            setMessage('')
        }
        
   }
   
   const isImageUrl = (url:string) => {
    return /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(url);
  };
 
  const scrollToBottom = () => {
    if (latestMessageRef.current) {
        latestMessageRef.current.scrollTo({
            top: latestMessageRef.current.scrollHeight,
            behavior: 'smooth'
          });
    }
  };
  const NavBarHandler=()=>{
    component_state?.setShowNavBar(!component_state.show_nav_bar)
  }
  useEffect(() => {
    scrollToBottom()
  }, []);
  useEffect(() => {
    // Scroll to the latest message container when component updates
    scrollToBottom()
  }, [message,fetchUser]);
  return(
        <div >
        <div className="  h-fit overflow-x-auto  bg-purple-950 main-body">
      
      
        <center>
        <p className="font-serif text-2xl text-slate-200 pt-2">Group Chat/{fetchUserDetails?fetchUserDetails.name:""}</p>
                <ul  className="  p-1  outermessage-container" >
                <div    ref={latestMessageRef}
                className=" message-container  border border-slate-600 flex flex-col h-svh overflow-x-auto gap-4  mt-4 pb-3" 
                >
                {receivedMessages.map((msg,idx)=>{
                    const [username,profile_uri,message]=msg.split('__')

                    return(
                     username.trim().toLowerCase()==Username?.trim().toLowerCase()?
                     <div className="  flex flex-col items-end justify-start " key={idx} >
                     <li  >
                         <div className="flex flex-col w-72  " >
                             <span className="text-xl  flex justify-start items-center text-gray-200 ml-2 font-serif gap-2 ">
                             <img src={profile_uri} className="w-9 rounded-full"/>{username}</span>
                             <p 
                             className="text-2xl rounded-lg bg-blue-600  text-slate-200  w-64 h-auto break-words font-serif p-2 hover:bg-blue-400">
                                {isImageUrl(message)?
                                <img src={message} className="w-150px rounded-xl" />
                                :<p>{message}</p>
                                }
                             </p>
                         </div>                             
                     </li>
                 </div>:
                    <div className=" flex flex-col items-start justify-start ml-2" >
                    <li key={idx}>
                        <div className="flex flex-col w-72 h-auto  items-start  overflow-hidden">
                        <span className="text-xl  flex justify-start ml-2 text-gray-200 font-serif">
                        <img src={profile_uri} className="w-9 rounded-full"/>{username}
                            </span>
                        <p 
                             className="text-2xl rounded-lg bg-gray-600  text-slate-200  w-64 h-auto break-words font-serif p-2 hover:bg-blue-400">
                                {isImageUrl(message)?
                                <img src={message} className="w-150px rounded-xl" />
                                :<p>{message}</p>
                                }
                             </p>
                        </div>                             
                    </li>
                </div>
                    )
                }
                )}
                 </div>
                 <center>
         <div className=" message-input-container mt-5  flex flex-row justify-center items-center gap-3">
           <form onSubmit={sendMessage} className="flex flex-row justify-center items-center ">
           <div className=" main-input-container  w-96 flex flex-row">
             <input 
            type="text"  
            className=" message-input border border-gray-400  h-12  w-96 rounded-tl rounded-bl pl-2 font-serif text-xl"
            value={message}
            onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
                setMessage(e.target.value)
            }}
            />
            <div>
            <button type="submit" 
            className=" message-button border border-gray-400 bg-blue-500 text-white w-32 h-12 rounded-tr rounded-br ">Submit</button>
            </div>
           </div>
            
            
           </form>

           <div className="file-message-input-container flex flex-row justify-center items-center gap-2">
                <label htmlFor="file-img">   
                <input type="file" name="img-msg" onChange={fileHandler} id="file-img" className="hidden"/>
                <span><FontAwesomeIcon icon={faArrowAltCircleUp} size="2x" /></span>   
            </label>
            <button onClick={()=>sendFile()} className="file-input-submit-btn bg-red-600 w-28 h-11 rounded-lg text-slate-200">Submit file</button>
            </div>
                </div>
           
         </center>
        
                </ul>
    </center>
       
    </div>
            </div>
  )
};

export default WebSocketClient;
