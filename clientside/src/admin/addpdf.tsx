import axios from "axios";
import React,{useState,useEffect, FormEvent} from "react";
const AddPdf:React.FC=()=>{
    const username=window.localStorage.getItem("user_name")
    const [pdfname,setPdfName]=useState<string>("")
    const [file,setFile]=useState<File | null>(null)
    const [isfilesubmitted,setIsFileSubmitted]=useState<boolean>(false)
    const sendPdf=async(e:FormEvent)=>{
        e.preventDefault()
        const formdata=new FormData()

        if (file){
            formdata.append("pdf-file",file)
        }
        const response=await axios.post(`http://localhost:8080/upload-pdf/${username}`,formdata)
        if (response.status!=200) throw new Error("failed to upload the pdf")
            setIsFileSubmitted(!isfilesubmitted)
    }
    const pdfHandler=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setPdfName(e.target.value)
    }
    const fileHandler=(e:React.ChangeEvent<HTMLInputElement>)=>{
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    }
    return(
        <div >
           {isfilesubmitted?
           <div>file submitted</div>: <form onSubmit={sendPdf} className="flex flex-col justify-center">
            <input type="text" value={pdfname} onChange={pdfHandler} />
            <input type="file" onChange={fileHandler}/>
            <button type="submit" className="bg-blue-600 text-slate-200 w-60">Submit</button>
            </form>}
        </div>
    )
}
export default AddPdf