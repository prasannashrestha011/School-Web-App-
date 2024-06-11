import React,{useState,useEffect, useRef} from "react";
import '@fontsource/vt323';
import { io } from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faCross } from "@fortawesome/free-solid-svg-icons";
const socket=io('http://localhost:8081')
type HelpList=Map<string,string>
type TerminalProp=Map<string,string>
interface WebTerminalProp{
    onClose:()=>void
}
const WebTerminal:React.FC<WebTerminalProp>=({onClose})=>{
    const bodyRef=useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [terminalInput,setTerminalInput]=useState<string>()
    const [helpList, setHelpList] = useState<HelpList>(new Map());
    const [httpapis,setHttpApis]=useState<TerminalProp[]>([])
    const [clear_terminal,setClearTerminal]=useState<boolean>(false)
    const [currentInputIdx,setCurrentInputIdx]=useState<number>()
    useEffect(() => {
        
        if (inputRef.current) {
            inputRef.current.focus();
          }
      }, []);
      const MaintainCursorFocus=()=>{
        if (inputRef.current) {
            inputRef.current.focus();
          }
      }
    
    useEffect(()=>{
        socket.on('connect',()=>{
            console.log('socket connection established from the terminal',socket.id)
        })
        socket.on('terminal-help-prompt-message',(data)=>{
            const receivedMap:HelpList=new Map(Object.entries(data.helplist))
            console.log(receivedMap)
            setHelpList(receivedMap)
        })
        socket.on('http-api-prompt-message',(data)=>{
            const receivedMap:TerminalProp=new Map(Object.entries(data.httpApiList)) 
            console.log(receivedMap)
            setHttpApis((prevHttpApis) => [...prevHttpApis, receivedMap]);
        })
        return ()=>{
            socket.off('connect')
            socket.off('terminal-help-prompt-message')
            socket.off('http-api-prompt-message')
        }
    })
    const terminalInputHandler=async(e:React.ChangeEvent<HTMLInputElement>)=>{
        setTerminalInput(e.target.value)
    }

    const sendTerminalPrompt=async(e:React.FormEvent)=>{
        setClearTerminal(false)
        e.preventDefault()
            if(terminalInput=="/help"){
                socket.emit('terminal-help-prompt')
            }
            else if (terminalInput=="/clear"){
                setClearTerminal(true)
                setHelpList(new Map())
                setHttpApis([])
            }
            else if (terminalInput=="/http_api"){
                socket.emit('http-api-prompt')
            }else{
                socket.emit('http-invalid-prompt')
            }
            setTerminalInput("")
        
    }
    const handleInputFocuse=(idx:number)=>{
        console.log(idx)
        setCurrentInputIdx(idx)
    }
    const CloseModel=(e:React.MouseEvent<HTMLDivElement>)=>{
        if(bodyRef.current==e.target){
            onClose()
        }
    }
    return(
        <div onClick={CloseModel}ref={bodyRef} className=" flex   pt-28 items-start justify-center fixed backdrop-blur-sm bg-opacity-30 inset-0">
            
            <div  style={{width:'40%',height:'55%'}}>
            <div className="bg-slate-300 w-full pl-2 flex flex-row justify-between items-center pr-2 ">
                 <div className="flex flex-row gap-2 h-auto">
                 <img className="w-5" src={`https://img.icons8.com/?size=100&id=Eayl3jnSFaNs&format=png&color=000000`}/>
                 <span>Command Prompt</span>
                 </div>
                <div style={{fontSize:'20px'}}>  <FontAwesomeIcon icon={faClose} size={"1x"} onClick={()=>onClose()}/>  </div> 
            </div>
            <div  className="flex flex-col items-start bg-slate-950 overflow-y-scroll h-96"  >
           
                <div className="flex flex-row  ">
                    <span style={{ fontFamily: 'VT323, monospace' }} className="text-white  " >Server\Admin\Terminal{">"}</span>
                    <form onSubmit={sendTerminalPrompt}>
                    <input 
                      ref={inputRef}
                    type="text" 
                    className="w-96 bg-black  text-yellow-300 pl-2" 
                    autoFocus 
                    style={{ outline: 'none' ,fontFamily:'VT323,monospace'}}
                    value={terminalInput}
                    onChange={terminalInputHandler}

                    />
                    
                    </form>
                </div>
                
                <div className="pl-1 text-yellow-300 font-modeseven text-xl "  >
                {Array.from(helpList.entries()).map(([key,value])=>(
                    <div key={key}>
                        {key}{"-> "}{value}
                    </div>
                ))}
                
            </div>
             
                  <div className="pl-1 text-yellow-300" >
                  {httpapis.map((item,idx)=>{
                   
                   return(
                        <div className="font-modeseven text-xl">
                       <div key={idx} onClick={()=>handleInputFocuse(idx)}>
                           {Array.from(item.entries()).map(([key,value])=>(
                               <div key={key}>
                                   {key}{"-> "}{value}
                                   
                               </div>
                               
                           ))}
                           </div>
                       
                           </div>
                   )
                  })}
               </div>

            
            </div>
            </div>
        </div>
    )
}
export default WebTerminal