import { signOut } from "firebase/auth";
import React from "react";
import { useNavigate as navigate } from "react-router-dom";
import { auth } from "../db";
import Logo from "../img/logo_luxpan.svg";

function Menu(props){
    return <a className="menu-items" href={props.href}>{props.name}</a>
}



function Navbar(){

    const url = window.location.origin;

    function logout(){
        signOut(auth).then(() => {
            localStorage.removeItem("authToken");
            window.location.replace(url + "/login")
        });
    }

    
    return <nav className="navbar-menu">
        <div className="logo">
        <img src={Logo} alt="logo"/>
        </div>
        <div className="menu">
            <Menu name="Home" href={"#"}/>
            <Menu name="Prezzi" href={"#prezzi"}/>
            <Menu name="Dipendenti" href={"#dipendenti"}/>
            <Menu name="Report" href={"#reports"}/>
            
            <a onClick={logout} className="menu-items">LogOut</a>
        </div>
    </nav>
}

export default Navbar;
