import React, { useEffect, useState } from 'react';
import { useGoogleLogin, TokenResponse, CodeResponse } from "@react-oauth/google";
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const GoogleLoginPage: React.FC = () => {
  interface tokenProp{
    id:number,
    email:string,
    name:string,
    picture:string,
    verified_email:boolean
  }
  const [token,setToken]=useState<tokenProp | null>(null)
    const login = useGoogleLogin({
        onSuccess: async (codeResponse) => {
          // send codeResponse to the server
          const tokenResponse = await axios.get(
            `http://localhost:8080/auth/callback?code=${codeResponse.code}`
          );
    
  
          setToken(tokenResponse.data.token)
          console.log(tokenResponse.data.token)
          await InsertUser(tokenResponse.data.token)
          window.localStorage.setItem('userID',tokenResponse.data.token.id)
          window.localStorage.setItem('account_state',tokenResponse.data.token.verified_email)
          window.localStorage.setItem('userIdentity',tokenResponse.data.token.name)
        },
        flow: "auth-code",
      });
    const InsertUser=async(token:tokenProp)=>{
    
    
        try{
          const response=await axios.post('http://localhost:8080/insert-user-info',{
          "google_id":token.id,
          "email":token.email,
          "name":token.name,
          "profileURL":token.picture,
          "verify_email":token.verified_email,
        })
         if(response.status!=200) throw new Error('err')
    
        }catch(err){
          console.log(err)
        }
      }
      useEffect(()=>{
        if(token&&token.picture){
          const img=new Image()
          img.onload=()=>{
            console.log('image rendered , go a head')
          }
          img.src=token.picture
        }
      },[])
      return (
        <>
          <button onClick={() => login()}>Login with google</button>
          {
            token?.verified_email?<Navigate to="/home" />:""
          }
        
        </>
      );
}

export default GoogleLoginPage;
