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

const App:React.FC=()=>{

  return(
    <AuthProvider>
        <Router>
      <Routes>
      <Route element={<AdminProvider/>}>
            <Route path='/login' element={<LoginPage/>}/>
            <Route element={<RequireAuth/>}>
              <Route path='/' element={<StartTestInterface/>} />
              <Route path='/home' element={<Question/>}/>
              <Route path='/message' element={<WebSocketClient/>} />
            {/* admin panel*/}
              <Route element={<AdminOnly/>}>
                 <Route path='/create-questions' element={<CreateQuestion/>}/>
              </Route>
              {/* admin panel*/}
            </Route>
         
        </Route>
      </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App;
