// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getMessaging} from 'firebase/messaging'

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
export const GenerateToken=async()=>{
    const permission=await Notification.requestPermission()
    console.log(permission)
}