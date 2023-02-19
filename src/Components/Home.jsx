import React, {useEffect, useState} from "react";
import Navbar from "./Navbar";
import Card from "./Card";
import Data from "./Data";
import Price from "./Price";
import Dip from "./Dip";
import Footer from "./Footer";
import Loading from "./Loading";
import { pastiRef } from "../db"
import { onValue } from "firebase/database";
import Reports from "./Reports";

//prova a richiamare il valore db da testata in una variabile, e quando questa varia viene associata all'hook

function Home(){

    useEffect(() => {
        if(!authToken){
            window.location.replace(url + "/login");
        } 
        onValue(pastiRef, (snapshot) => {
            if(snapshot.exists()){
                setPasti(snapshot.val());
            } 
        });
    }, []);

    const today = new Date().toISOString().split('T')[0];
    const [data, setData] = useState(today);
    const [pasti, setPasti] = useState([]);
    const selectedData = new Date(Date.parse(data));
    const url = window.location.origin;
    const authToken = localStorage.getItem("authToken");
    const mese = (selectedData.getMonth()+1) + "-" + selectedData.getFullYear();
    const pastiMese = pasti[mese];
    let pastiGiorno;
    const setPastiGiorno = () => {
        if(pastiMese){
            pastiGiorno = pastiMese[(selectedData.getDate()-1)];
        }
    }
    setPastiGiorno();

    function changeDataHandler(event){
        const newValue = event.target.value;
        console.log(newValue);  
        
        setData(newValue);
    }

    if(pasti === "undefined" || pasti == undefined){
        return <Loading />
    }

    return <>
        <Navbar />
        <Data data={data} changeData={changeDataHandler}/>
        <div className="container">
            <div className="row gy-4">
                {pastiGiorno != undefined ?  pastiGiorno.map((value, index) => {
                    return <Card 
                                nome={value.nome}
                                cognome={value.cognome}
                                pasto={value.pasto}
                                costo={"€ " + value.prezzo}
                                prezzo={value.prezzo}
                                dipPrice={value.dip}
                                luxPrice={value.lux}
                                mese={mese}
                                giorno={selectedData.getDate()-1}
                                index={index}
                                key={index}
                            />
                }) : <Card  txt="Nessun risultato"
                            idName="no-results" />} 

                <Card 
                    idName="add"
                    txt="+"
                    mese={mese}
                    giorno={selectedData.getDate()-1}
                    oldCardArray={pastiGiorno}
                />  
            </div>
        </div>
    
        <Price />
        <Dip />
        <Reports 
            pasti={pasti}
        />
        <Footer />
    </>
}

export default Home;