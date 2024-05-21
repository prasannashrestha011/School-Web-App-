import axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";
import { Navigate,useNavigate,useLocation } from "react-router-dom";
import AdminHook from "../hooks/adminhook";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [auth, setAuth] = useState<boolean>(false);
  const Admin=AdminHook()
  const navigate=useNavigate()

  const user_login_status = window.localStorage.getItem("user_login_status");

  const usernameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const formHandler = async (e: FormEvent) => {
    e.preventDefault(); // Move this to the beginning

    try {
      const response = await axios.post(
        "http://localhost:8080/login",
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log("Authenticated");
        
        console.log(response.data.user)
        window.localStorage.setItem('user_id',response.data.user.id)
        window.localStorage.setItem('user_name',response.data.user.username)
        window.localStorage.setItem('user_role', response.data.user.role);
        Admin?.setIsAdmin(response.data.user.role)
        setAuth(true);
        window.localStorage.setItem("user_login_status", JSON.stringify(true));
        
       
      } else {
        throw new Error("Incorrect password");
      }
    } catch (err) {
      console.error(err);
    }
  };




  return auth && user_login_status ? (
    <Navigate to="/" state={{Username:username}}/>
  ) : (
    <div className="text-3xl">
      <form onSubmit={formHandler}>
        <label htmlFor="username">
          <p>Username</p>
          <input
            type="text"
            id="username"
            value={username}
            onChange={usernameHandler}
          />
        </label>
        <label htmlFor="password">
          <p>Password</p>
          <input
            type="password"
            id="password"
            value={password}
            onChange={passwordHandler}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default LoginPage;
