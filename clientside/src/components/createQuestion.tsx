import axios from "axios";
import React,{useState} from "react";
const CreateQuestion:React.FC=()=>{
    const [question,setQuestion]=useState<string>("")
    const [ans1,setAns1]=useState<string>("")
    const [ans2,setAns2]=useState<string>("")
    const [ans3,setAns3]=useState<string>("")
    const [ans4,setAns4]=useState<string>("")
    const [correct_ans,setCorrectAns]=useState<string>("")
    const [is_question_created,setIsQuestionCreated]=useState<boolean>(false)
    const QuestionHandler=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setQuestion(e.target.value)
    }
    const AnsHandler=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const {name,value}=e.target
        switch(name){
            case 'ans1':
                setAns1(value)
                break
            case 'ans2':
                setAns2(value)
                break;
            case 'ans3':
                setAns3(value)
                break;
            case 'ans4':
                setAns4(value)
        }
    }
    const CorrectAnsHandler=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setCorrectAns(e.target.value)
    }

    const SubmitHandler=async(e:React.FormEvent)=>{
        e.preventDefault()
        const formData= new FormData()
        formData.append('question',question)
        formData.append('ans1',ans1)
        formData.append('ans2',ans2)
        formData.append('ans3',ans3)
        formData.append('ans4',ans4)
        formData.append('correct_ans',correct_ans)
        try{
            const response=await axios.post('http://localhost:8080/create-question',{
                question,ans1,ans2,ans3,ans4,correct_ans
            })
             if(response.status!==200) throw new Error('failed to insert your info')
            console.log("answer inserted")
             setIsQuestionCreated(!is_question_created)
             setQuestion("")
             setAns1("")
             setAns2("")
             setAns3("")
             setAns4("")
             setCorrectAns("")
        }catch(err){
            console.log(err)
        }
    }
    return(
       <div>
       {is_question_created?
       <center>
        Question created and inserted to the database
        <button onClick={()=>setIsQuestionCreated(!is_question_created)}><p>Create another question</p></button>
       </center>
        :
        <center> <form onSubmit={SubmitHandler}>
      
        <div className="ml-3 border border-gray-500 w-96 flex flex-col items-center justify-center">
              Question:<input type="text" className="border border-gray-400" value={question} onChange={QuestionHandler}/>
           
              <div className="flex flex-col  w-32">
                  Opt1<input type="text" className="border border-gray-400" name="ans1" value={ans1}  onChange={AnsHandler}/>
                  Opt1<input type="text" className="border border-gray-400" name="ans2" value={ans2}  onChange={AnsHandler}/>
                  Opt1<input type="text" className="border border-gray-400" name="ans3" value={ans3}  onChange={AnsHandler}/>
                  Opt1<input type="text" className="border border-gray-400" name="ans4" value={ans4}  onChange={AnsHandler}/>
                  CorrectAns<input type="text" className="border border-gray-400" value={correct_ans} onChange={CorrectAnsHandler}/>
              </div>
              <button type="submit" className="bg-blue-600 text-slate-200 mt-3 rounded-lg w-32 h-10" >Create question</button>
          </div>
        
        </form></center>
    }
       </div>
    )
}
export default CreateQuestion