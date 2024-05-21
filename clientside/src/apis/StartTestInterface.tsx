import path from "path";
import React,{useState} from "react";
import { Navigate, useLocation } from "react-router-dom";
const StartTestInterface:React.FC=()=>{
    const [start_test,setStartTest]=useState<Boolean>(false)
    const username=window.localStorage.getItem('user_name')

    return(
        <div>
            {username}
           
            {start_test?
            (
                <Navigate to="/home" />
            ):(
                <center>
                    
                    <h1>Start Test</h1>
                    <button onClick={()=>setStartTest(true)}>Go</button>
                </center>
            )}
        </div>
    
    )
}
export default StartTestInterface