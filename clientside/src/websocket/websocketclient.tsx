import axios from "axios";
import React, { FormEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleUp,faBars,faFolder } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../components/navbar";
import ComponentHook from "../hooks/componenthook";
import '../css/websocketioclient.css'
const WebSocketClient: React.FC = () => {
   const [message,setMessage]=useState<string>("")
   const [filemessage,setFileMessage]=useState<File | null>()
   const [socket,setSocket]=useState<WebSocket | null>(null)
   const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
   const Username=window.localStorage.getItem("user_name")
    const latestMessageRef=useRef<HTMLDivElement>(null)
    const component_state=ComponentHook()
   useEffect(()=>{
    const socket=new WebSocket(`ws://localhost:8080/ws?username=${Username}`)
    setSocket(socket)
    return ()=>{
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.close();
        }
    }
   },[])
   useEffect(()=>{
    if (!socket) return;
    socket.onopen=()=>{
        console.log("Connection established")
       
    }
    socket.onmessage=(event)=>{
        console.log("Received from server",event.data)
        
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
        const response=await axios.post(`http://localhost:8080/insert-messages/${username}`,{message:message})
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
        latestMessageRef.current.scrollTop = latestMessageRef.current.scrollHeight;
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
    if (latestMessageRef.current) {
        latestMessageRef.current.scrollTop = latestMessageRef.current.scrollHeight;
      }
  }, [message]);
  return(
        <div >
        <div className="  h-fit overflow-x-auto  bg-purple-950 main-body">
      {component_state&&Username?  <NavBar show_nav_bar={component_state?.show_nav_bar} setShowNavBar={component_state?.setShowNavBar} username={Username}/>:""}
       <div className=" fixed left-4 " onClick={()=>NavBarHandler()}><FontAwesomeIcon icon={faBars} size="2x"/></div>
        <center>
        <p className="font-serif text-2xl text-slate-200 pt-2">Group Chat</p>
                <ul  className="  p-1  outermessage-container" >
                <div    ref={latestMessageRef}
                className=" message-container  border border-slate-600 flex flex-col h-svh overflow-x-auto gap-4  mt-4 pb-3" 
                >
                {receivedMessages.map((msg,idx)=>{
                    const [username,message]=msg.split('__')
                
                    return(
                     username.trim().toLowerCase()==Username?
                     <div className="  flex flex-col items-end justify-start " key={idx} >
                     <li  >
                         <div className="flex flex-col w-72  " >
                             <span className="text-xl  flex justify-start text-gray-200 ml-2 font-serif ">{username}</span>
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
                        <span className="text-xl  flex justify-start ml-2 text-gray-200 font-serif">{username}</span>
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
