import axios from "axios";
import React,{useState,useEffect, FormEvent} from "react";
import { io } from "socket.io-client";
interface PdfProp{
    username:string,
    profile_uri:string,
    show_pdf_panel:boolean,
    setShowPdfPanel:(show_pdf_panel:boolean)=>void
}
const socket = io('http://localhost:8081');
const AddPdf:React.FC<PdfProp>=({username,profile_uri,show_pdf_panel,setShowPdfPanel})=>{

    const [pdfname,setPdfName]=useState<string>("")
    const [file,setFile]=useState<File | null>(null)
    const [isfilesubmitted,setIsFileSubmitted]=useState<boolean>(false)
    const sendPdf=async(e:FormEvent)=>{
        e.preventDefault()
        const formdata=new FormData()

        if (file){
            formdata.append("pdf-file",file)
        }
        const uploadedTime=Date.now()
        const response=await axios.post(`http://localhost:8080/upload-pdf/${username}/${pdfname}/${uploadedTime}`,formdata)
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
    useEffect(()=>{
        if(isfilesubmitted){
            alert('New Document added to the notes')
            setShowPdfPanel(false)
            setPdfName('')
            setFile(null)
            sendMessageToDashBoard()
        }
    },[isfilesubmitted])
    useEffect(()=>{
        socket.on('connect',()=>{
            console.log('connected to dashboard message from add pdf',socket.id)
        })
    },[])
    const sendMessageToDashBoard=()=>{
        const messageToDashBoard=`${pdfname} was added to the notes`
        const date=Date.now()
        socket.emit('dashboard-message',username,profile_uri,Date.now(),messageToDashBoard)
    }
    return(
        <div >
           
          <form onSubmit={sendPdf} className="flex flex-col justify-center">
            <input type="text" value={pdfname} onChange={pdfHandler} />
            <input type="file" onChange={fileHandler}/>
            <button type="submit" className="bg-blue-600 text-slate-200 w-60">Submit</button>
            </form>
        </div>
    )
}
export default AddPdf