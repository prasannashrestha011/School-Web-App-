import React,{useState} from 'react';

import Question from './apis/Questions';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
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

const App:React.FC=()=>{

  return(
    <AuthProvider>
        <Router>
      <Routes>
      <Route element={<AdminProvider/>}>
           <Route element={<ComponentProvider />}>
                      <Route path='/login' element={<LoginPage/>}/>
                        <Route element={<RequireAuth/>}>
                          <Route path='/' element={<StartTestInterface/>} />
                          <Route path='/class/test' element={<Question/>}/>
                          <Route path='/message' element={<WebSocketClient/>} />
                          <Route path='/notes' element={<GetPDF/>}/>
                        {/* admin panel*/}
                          <Route element={<AdminOnly/>}>
                            <Route path='/admin-panel' element={<Admin/>} />
                            <Route path='/create-questions' element={<CreateQuestion/>}/>
                          </Route>
                          {/* admin panel*/}
                      </Route>
            </Route>
         
        </Route>
      </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App;
