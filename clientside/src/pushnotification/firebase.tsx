// Import the functions you need from the SDKs you need
import axios from "axios";
import { FirebaseApp, initializeApp } from "firebase/app";

import {getMessaging, getToken} from 'firebase/messaging'
import { title } from "process";

const firebaseConfig = {
  apiKey: "AIzaSyD7oHh6Ed3A7ozCRWBXAMKhOpPX4BlZajs",
  authDomain: "pushnotification-25da2.firebaseapp.com",
  projectId: "pushnotification-25da2",
  storageBucket: "pushnotification-25da2.appspot.com",
  messagingSenderId: "91817390878",
  appId: "1:91817390878:web:ae720b35627cd165534f0f",
  measurementId: "G-M5Y44T0FV1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const messaging=getMessaging(app);

export const GenerateToken=async(username:string)=>{
    const permission=await Notification.requestPermission()
    console.log(permission)
    if (permission=="granted"){
      const token=await getToken(messaging,{
        vapidKey:"BMG1IXjvYTMrpsSthu27Xo3Nletpkh9rf-xEviIzjsFgTXBm3iq2mFEvJtErwPoSv4RwqYswwri04PEcEsjFNWQ"
      })
      console.log(token)
      InsertUserID(token,username)
    }
}
const InsertUserID=async(id:string,username:string)=>{
  try{
    const response=await axios.post(`http://localhost:8080/insert-push-notification-id?deviceid=${id}&username=${username}`)
    if (response.status!=200) throw new Error('error')
      console.log('your device id inserted into the database')
      const message={
       notification:{
         title:'Hello',
        body:'hi'
       },
       token:id,
      }
      
  }catch(err){
console.log(err)
}
}


