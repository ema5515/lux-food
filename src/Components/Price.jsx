import React, { useEffect, useState } from "react";
import edit from "../icons/Edit.png";
import {prezziRef} from "../db";
import { onValue } from "firebase/database";
import Loading from "./Loading";
import Popup from "./Popup";

function createModifyPrice (props){
    return <Popup 
                title={props.title}
                display={props.display}
                hide={props.hide}> 
               
            <h3 className="form-label">Prezzo</h3>
                     <input value={props.index} id="indexPrice" type="hidden"></input>

                    <input type="text" className="input-text" name="pasto" value={props.pasto} onChange={props.changePriceProps} id="pastoProps" placeholder="Nome Pasto" />
                    <input type="number" className="input-text" name="costo" value={props.costo} onChange={props.changePriceProps} id="costoProps" placeholder="Costo" />
                    <input type="number" className="input-text" name="dip" value={props.dip} onChange={props.changePriceProps} id="dipProps" placeholder="Carico Dipendente" />
                    <input type="number" className="input-text" name="lux" value={props.lux} onChange={props.changePriceProps} id="luxProos" placeholder="Carico Luxpan" />

                    <h2 className="callout-attenction">Attenzione! la modifica dei prezzi NON è RETROATTIVA</h2>

                    <div className="button-div">
                        <button className="btn create-button" onClick={props.action}>{props.type}</button>
                        <button className="btn cancel-button" onClick={props.hide}>Annulla</button>
                    </div>
                       { props.type === "Modifica" && <button className="btn cancel-button" onClick={props.delete}>Elimina</button> } 


    
    </Popup>
}

function PriceTag(props) {

    const [hiddetn, show] = useState({display: "none"});
    const [style, changeStyle] = useState({
        backgroundColo: "fff",
        color: "#234E9C"
    });

    return <>
            <div className="col-lg-4">
                <div className="price-card">
                    <p className="price-header">{props.pasto} € {props.costo}</p>
                    <hr />
                    <p>Luxpan: € {props.costoLuxpan}</p>
                    <p>Dipendente: € {props.costoDip}</p>
                    <img className="edit" src={edit}/>
                </div>
            </div>

            {!hiddetn.update ? 
                    <createModifyPrice 
                        display={hidden}
                        hide={closeNewPrice}
                        index={props.index}
                        action
                        delete
                        pasto
                        costo
                        dip
                        lux
                        changePriceProps
                        title
                        type
                    /> 
                    :
                    <createModifyPrice 
                        display={hidden}
                        hide={closeNewPrice}
                        index={props.index}
                        action
                        delete
                        pasto
                        costo
                        dip
                        lux
                        changePriceProps
                        title
                        type
                    /> 
            }
    </>
}


function Price() {
    const [price, setPrice] = useState("undefined");

    useEffect(() => {
        onValue(prezziRef, (snapshot) => {
            if(snapshot.exists()){
                setPrice(snapshot.val());
            } 
        });
    }, []);

        if(price == "undefined"){
            return<Loading /> 
        }

    return <>
        <h1 className="title" id="prezzi">
            Prezzi
        </h1>
        <div className="container">
        <div className="row gy-4">
            {price.map((data, index) => {
                    return <PriceTag 
                        pasto={data.pasto}
                        costo={data.prezzo}
                        costoLuxpan={data.luxpan}
                        costoDip={data.dipendente}

                        key={index}
                    />
                    })}
        </div>
        </div>
    </>
}


export default Price;