import React, { FormEvent, useEffect, useState } from "react";

const WebSocketClient: React.FC = () => {
   const [message,setMessage]=useState<string>("")
   const [socket,setSocket]=useState<WebSocket | null>(null)
   const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
   const username=window.localStorage.getItem("user_name")
   useEffect(()=>{
    const socket=new WebSocket(`ws://localhost:8080/ws?username=${username}`)
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
   const sendMessage=()=>{
    if(socket && message.trim() !="")
        {
            socket.send(message)
            console.log('message sent')
            setMessage('')
        }
   }
  return(
    <div>
        <center>
                <div className="border border-gray-500 w-fit">
                    <ul>
                    {receivedMessages.map((msg,idx)=>{
                        const [username,message]=msg.split(':')
                        return(
                            <li key={idx}>
                                <div className="flex flex-row w-96 ">
                                <span className="text-2xl">{username}</span>-<span className="text-2xl">{message}</span>
                                </div>
                                </li>
                        )
                    }
                    )}
                    </ul>
                </div>
                  
            <input 
            type="text"  
            className="border border-gray-400 h-10 w-48"
            value={message}
            onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
                setMessage(e.target.value)
            }}
            />
           <div> <button type="submit" className="bg-blue-500 text-white w-32 h-10 rounded-lg"
                    onClick={()=>sendMessage()}>Submit</button></div>
        </center>
    </div>
  )
};

export default WebSocketClient;
