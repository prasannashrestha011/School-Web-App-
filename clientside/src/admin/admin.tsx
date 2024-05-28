import axios from "axios";
import React,{useEffect, useState} from "react";
import AddPdf from "./addpdf";
import { faArrowAltCircleRight, faArrowCircleLeft, faArrowCircleRight, faCircleXmark, faCross, faCrosshairs, faHamburger, faHeartCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Admin:React.FC=()=>{
    const [scorelist,setScoreList]=useState<any[]>([])
    const [show_pdf_panel,setShowPdfPanel]=useState<boolean>(false)
    const [show_table_score,setShowTableScore]=useState<boolean>(false)
    const GetScore=async()=>{
       try{
        const response=await axios.get("http://localhost:8080/get-scores")
        if (response.status!=200) throw new Error('failed to fetch the api')
            setScoreList(response.data)
       }catch(err){
        console.log(err)
       }
    }
    useEffect(()=>{
        GetScore()
    },[])
    const togglePanel = () => {
        setShowPdfPanel(!show_pdf_panel);
        // Enable or disable scroll depending on the panel visibility
        if (!show_pdf_panel) {
            document.body.style.overflow = 'hidden'; // Disable scrolling
        } 
    };
    return(
        <div className="h-svh border  bg-slate-200 flex flex-row justify-between">
            <center className="text-3xl font-serif fixed " style={{left:'50%'}}>Admin Panel</center>
            <p className="fixed">   <FontAwesomeIcon icon={faHamburger} onClick={()=>setShowTableScore(!show_table_score)} className="mt-14"/></p>
            <div className={`flex justify-center items-start mr-4 border border-black  bg-blue-800 w-80 ${show_table_score?'-translate-x-96':'-translate-x-0'} transition-transform duration-500`} style={{height:'100%'}}>
            <p className="fixed top-2 left-72"><FontAwesomeIcon icon={faCircleXmark} size="2x" onClick={()=>setShowTableScore(!show_table_score)} /></p>
                <center>
                   <ul>
                  
                    <span className="font-serif">Recent Test Submission</span>
                   
        
                    <div className="border border-gray-500 w-64 flex justify-between font-serif text-xl mr-4    ">
                            <div className="w-32 border-r-2 border-gray-500">Username</div>
                            <div className="w-32">Score</div>
                        </div>
                      
             
                   {scorelist.map((item,idx)=>{
                        return(
                            <li key={idx}>
                                <div className=" bg-gray-500 flex flex-row w-64 justify-between text-xl font-serif mr-4">                                  
                                    <div className="w-32 border border-slate-800">
                                    <span >{item.username}</span>
                                    </div>
                                    <div className="w-32 border border-slate-800">
                                    <span >{item.score}</span>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                   </ul>
                </center>
              
            </div>
                    
           

            <div>
                    <div>{show_pdf_panel?<FontAwesomeIcon icon={faArrowCircleLeft} onClick={togglePanel} size="2x" className=" transition-transform duration-500"/>:<FontAwesomeIcon icon={faArrowCircleRight} onClick={togglePanel} size="2x" className=" transition-transform duration-500 translate-x-64"/>}</div>
            <div className={`transition-transform duration-500 ${show_pdf_panel ? 'translate-x-0' : 'translate-x-80'}`}>
                <AddPdf />
            </div>
        </div>
        </div>
    )
}
export default Admin