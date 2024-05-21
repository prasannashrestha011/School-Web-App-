import axios from "axios";
import React,{FormEvent, useState} from "react";
interface SubmitTestProp{
    quiz_id:number | null
    counter:number
    is_test_submit:boolean,
    setIsTestSubmit:(is_test_submit:boolean)=>void
}
const SubmitTest:React.FC<SubmitTestProp>=({quiz_id,counter,is_test_submit,setIsTestSubmit})=>{
    const SubmitHandler=async(e:FormEvent)=>{
        e.preventDefault()
       try{
        const response=await axios.post(`http://localhost:8080/insert-score/${quiz_id}`,{
            "score":counter,
        })
         if(response.status!==200) throw new Error("failed to insert the data")
            console.log(response.data.message)
            setIsTestSubmit(!is_test_submit)
       }catch(err){
        console.log(err)
       }
    }
    return(
        <>
        {is_test_submit?<center>Test Submitted</center>
        :
        <form onSubmit={SubmitHandler}>
           <center> <button 
           type="submit"
           className="bg-blue-600 w-32 h-10 text-slate-200 rounded-lg">Submit Test</button></center>
        </form>
        }
        </>
    )
}
export default SubmitTest