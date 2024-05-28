import axios from "axios";
import React,{useState,useEffect} from "react";
import NavBar from "../components/navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import ComponentHook from "../hooks/componenthook";
const GetPDF:React.FC=()=>{
    const [pdflist,setPdfList]=useState<any[]>([])
    const username=window.localStorage.getItem("user_name")
    const [show_download_nav,setShowDownloadNav]=useState<boolean>(false)
    const [current_idx,setCurrentIdx]=useState<number | null>(-1)
    const [show_nav_bar,setShowNavBar]=useState<boolean>(false)
    const component_state=ComponentHook()
    const [enable_nav_bar,setEnableNavBar]=useState<boolean>(false)
    const fetch_pdf_list=async()=>{
        try{
            const response=await axios.get('http://localhost:8080/get-pdf')
            if (response.status!=200) throw new Error("failed to get the list")
                setPdfList(response.data)
        }catch(err){
            console.log(err)
        }
    }
    const navHandler=(idx:number)=>{
        if (current_idx === idx) {
            setShowDownloadNav(!show_download_nav);
          } else {
            setCurrentIdx(idx);
            setShowDownloadNav(true);
          }
    }
    
    const SideNavBarHandler=()=>{
  
       component_state?.setShowNavBar(!component_state.show_nav_bar)
    
    }
    useEffect(()=>{
        fetch_pdf_list()
    },[])
  
    return(
     <div>
        
        <center className="text-3xl font-serif">Notes</center>
        <div className=" fixed left-4 top-1" onClick={()=>SideNavBarHandler()}><FontAwesomeIcon icon={faBars} size="2x"/></div>
         {component_state &&username? <NavBar show_nav_bar={component_state?.show_nav_bar} setShowNavBar={component_state?.setShowNavBar} username={username}/> :""}
        <div className="grid grid-cols-3 gap-4 ml-4 mt-8" >
         
        {pdflist.map((item, idx) => (
          <div key={idx} className=" bg-gray-100 rounded-lg p-4 flex flex-col justify-center items-center h-44 font-serif gap-4"
            onMouseEnter={()=>navHandler(idx)}
            onMouseLeave={()=>navHandler(idx)}>
            <div className={`w-52 h-28 overflow-hidden border border-gray-500  rounded-lg flex flex-col justify-center items-center shadow-custom-black`} >
            <div className={`${current_idx==idx?(show_download_nav?'-translate-y-16':'translate-y-8'):'translate-y-8'} transition-transform duration-700` }>{item.file_name}</div>
                <div className={`${current_idx==idx?(show_download_nav?'translate-y-1 ':'translate-y-24' ):'translate-y-24'}  transition-transform duration-700 w-52 h-28 border border-gray-500 bg-purple-950 flex flex-col justify-center items-center text-slate-200`}>
                    <a href={`http://localhost:8080/public/pdf/${item.file_path}`} target="_blank" >Download now !!</a>
                    </div>
            </div>
            <div className="w-52  pl-2 ">Added by:{item.file_by}</div>
            </div>
           
        ))}
     
      </div>
     </div>
           
    )
}
export default GetPDF