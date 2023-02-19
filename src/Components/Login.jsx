import React, {useState, useEffect} from "react";
import Home from "./Home";
import logo from "../img/logo_luxpan.svg";
import { useNavigate as navigate } from "react-router";
import { auth, signInWithEmailAndPassword } from "../db";



function Login(){

    const url = window.location.origin;
    const [user, setUser] =useState({
        email: "",
        password: ""
    });

    function handleChange(event){
        const {name, value} = event.target;

        setUser((prevValue) => {
            return {
                ...prevValue,
                [name]: value
            }
        });
    }

    function loginUser(){
        signInWithEmailAndPassword(auth, user.email, user.password)
            .then((res) => {
                console.log(res);
                console.log(res._tokenResponse.refreshToken);
                localStorage.setItem("authToken", res._tokenResponse.refreshToken);
                window.location.replace(url);
            })

        }

    return  <div className="login-page">
                <img src={logo}/>
                <h1>LuxFood</h1>
                <div className="login">
                        <input 
                            type="email"     
                            name="email"    
                            value={user.email}     
                            onChange={handleChange}/>
                        <input 
                            type="password"  
                            name="password" 
                            value={user.password}  
                            onChange={handleChange}/>
                        <button type="submit" onClick={loginUser}>Login</button>
                </div>
            </div>;
}

export default Login;