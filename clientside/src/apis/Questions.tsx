import React,{useState,useEffect} from "react";
import axios from "axios";
import OptionField from "../components/optionField";
import { useLocation } from "react-router-dom";
import SubmitTest from "../components/submittest";

const Question:React.FC=()=>{
    const [question,setQuestion]=useState<any[]>([])
    const [counter,setCounter]=useState<number>(0)
    const [minutes,setMinutes]=useState<number>(0)
    const [second,setSecond]=useState<number>(0)
    
    const [is_test_submit,setIsTestSubmit]=useState<boolean>(false)
    const userID=window.localStorage.getItem("user_id")
    const quiz_id=Number(userID)
   
    const fetchQuestions=async()=>{
        const response=await axios.get("http://localhost:8080/get-questions")
        if(response.status!=200) throw new Error("failed to fetch the api")
            setQuestion(response.data)
         
    }
    useEffect(()=>{
        fetchQuestions();
    },[])
    let interval:NodeJS.Timer
    
    useEffect(()=>{
         interval=setInterval(()=>{
            setSecond(second+1)
            if(second==59){
                setSecond(0)
                setMinutes(minutes+1)
            }
           
            
        },1000)
        return ()=>clearInterval(interval)
    })
    useEffect(()=>{
        if(minutes==5){
            clearInterval(interval)
        }
       
    },[minutes])
    useEffect(()=>{
        if(is_test_submit){
            clearInterval(interval)
        }
    },[is_test_submit])
   
    const logoutHandler=()=>{
        window.localStorage.removeItem("user_login_status")
        window.location.reload()
    }
    return(
        <div>
            
   
          <center><span className="text-4xl">{minutes}:{second}</span></center>
        <button onClick={()=>logoutHandler()} className="bg-red-600 text-slate-100 ">Logout</button>
         {is_test_submit?(
            ""
         ):(
            minutes==5?
                 
                <div className="text-2xl">
                       {/* 1st condition*/}
                    <center>Time up lad</center>
                    <center> 
                        Your Score:
                        {counter}/{question.length}
                    </center>
                </div>
                  :
                  <div className="border border-gray-800 flex flex-col items-center ">
                       {/* 2nd condition*/}
                    <ul style={{listStyle:'none'}} className=" flex flex-col gap-2">
                  {question.map((item,idx)=>(
                   <li key={idx} >
                   <div>
                    <OptionField id={item.q_id} 
                        question={item.question} 
                        ans1={item.ans1} ans2={item.ans2} ans3={item.ans3} ans4={item.ans4} 
                        correct_ans={item.correct_ans}
                        counter={counter}
                        setCounter={setCounter}
                        />
                   </div>
        
                   </li>
                  ))}
               </ul>
                    </div>
         )}
           <SubmitTest 
           quiz_id={quiz_id} 
           counter={counter} 
           is_test_submit={is_test_submit} 
           setIsTestSubmit={setIsTestSubmit}
           questionList={question}
          />
        
        </div>
    )
    
}

export default Question