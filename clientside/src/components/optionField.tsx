import axios from "axios";
import React,{FormEvent, useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
interface OptionProp{
    id:number,
    question:string,
    ans1:string,
    ans2:string,
    ans3:string,
    ans4:string,
    correct_ans:string,
    counter:number,
    setCounter:(counter:number)=>void
}
interface selectedAnswer{
    q_id: number;
    userAns:string
}

const OptionField:React.FC<OptionProp>=({id,question,ans1,ans2,ans3,ans4,correct_ans,counter,setCounter})=>{
    const [selected_ans,setSelectedAns]=useState<selectedAnswer|null>(null)
    const [confirm,setConfirm]=useState(false)
    const confirmHandler=()=>{

    }
    const   sendHandler=async(e:FormEvent)=>{
        setConfirm(!confirm)
        e.preventDefault()
        
        const response=await axios.post(`http://localhost:8080/check-answer/${selected_ans?.q_id}`,{
            "answer":selected_ans?.userAns
        })
        try{
            if(response.status!=200) throw new Error("failed to fetch the api")
               
            if(response.data.message=="correct_answer" && response.data.message!=""){
              
                console.log("answer is correct")
                setCounter(counter+1)

            }else{
                console.log("incorrect answer")
            }
        }catch(err){
            console.log(err)
        }
      
    }
    const selectedAnsHandler=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setSelectedAns({
            q_id:id,
            userAns:e.target.value,
        })
      
    }
    return(
        <div className="border  border-gray-400 ">
            <form onSubmit={sendHandler} className="flex  flex-col gap-3">
       
                <div className="text-2xl">
                <p>{question}?</p>
                    <div className="flex flex-row gap-4 text-xl ">
                        <span><input type="radio"  name="opt" value={ans1} onChange={selectedAnsHandler}/>{ans1}</span>
                        <span><input type="radio" name="opt" value={ans2}  onChange={selectedAnsHandler}/>{ans2}</span>
                        <span><input type="radio" name="opt"  value={ans3}  onChange={selectedAnsHandler}/>{ans3}</span>
                        <span><input type="radio"  name="opt"  value={ans4}  onChange={selectedAnsHandler}/>{ans4}</span>
                    </div>
                </div>
                   {confirm?<FontAwesomeIcon icon={faCheck}/>:<button type="submit" className="bg-green-400 text-slate-100 rounded-lg w-32">Confirm Answer</button>}
            </form>
        </div>
    )
}
export default  OptionField