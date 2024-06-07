import React,{useEffect, useState} from 'react';

import Question from './apis/Questions';
import { BrowserRouter as Router,Route,Routes, useNavigate, Navigate,redirect } from 'react-router-dom';
import StartTestInterface from './apis/StartTestInterface';
import LoginPage from './authComponent/login';
import { AuthProvider } from './context/authcontext';
import RequireAuth from './context/requireauth';
import CreateQuestion from './components/createQuestion';
import { AdminProvider } from './context/admincontext';
import AdminOnly from './context/adminonly';
import WebSocketClient from './websocket/websocketclient';
import Admin from './admin/admin';
import GetPDF from './admin/getpdf';
import { ComponentProvider } from './context/componentprovider';
import GoogleLoginPage from './components/googlelogin';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Layout from './components/layout';
import EventList from './apis/event';

const App:React.FC=()=>{
  const userLoginStatus=window.localStorage.getItem("account_state")

 
  return(
    <GoogleOAuthProvider  clientId={"912288367848-nvs2f3721ij51orl7h3kolmpjnad68l2.apps.googleusercontent.com"} >
    <AuthProvider>
   
        <Router>
        
      <Routes>
      <Route element={<AdminProvider/>}>
           <Route element={<ComponentProvider />}>
            <Route path='/login' element={<GoogleLoginPage/>}/>
           <Route path="/" element={userLoginStatus ? <Navigate to="/home" /> : <GoogleLoginPage />} />
                        <Route element={<RequireAuth/>}>
                          <Route element={<Layout/>}>
                          <Route path='/home' element={userLoginStatus?<StartTestInterface/>:<GoogleLoginPage/>} />
                          
                          <Route path='/class/test' element={<Question/>}/>
                          <Route path='/message' element={<WebSocketClient/>} />
                          <Route path='/notes' element={<GetPDF/>}/>
                          <Route path='/events' element={<EventList/>}/>
                        {/* admin panel*/}
                          <Route element={<AdminOnly/>}>
                            <Route path='/admin-panel' element={<Admin/>} />
                            <Route path='/create-questions' element={<CreateQuestion/>}/>
                          </Route>
                          </Route>
                          {/* admin panel*/}
                      </Route>
            </Route>
         
        </Route>
      </Routes>
      
      </Router>
     
    </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App;
