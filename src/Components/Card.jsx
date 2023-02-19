import React, { useState, useEffect } from "react";
import userIcon from "../icons/MaleUser.png";
import foodIcon from "../icons/Food.png";
import priceIcon from "../icons/EuroMoney.png";
import edit from "../icons/Edit.png";
import {createPasti, updatePasti, deletePasti, dipRef, prezziRef} from "../db";
import { onValue } from "firebase/database";
import Popup from "./Popup";
import Loading from "./Loading";

function ContentCard(props){
    return (<><div className="content dip-data px-4">
                <div className="row">
                    <div className="col-3">
                         <img className="user-icon" src={userIcon} alt="user icon"/>
                    </div>
                    <div className="col-9">
                        <p className="dip-name">{props.nome} <br />{props.cognome}</p>
                    </div> 
                </div>
            </div>
            <div className="data-div">
                <div>
                    <img className="data-icon" src={foodIcon} alt="food icon"/> <label>{props.pasto}</label>
                </div>
                <div>
                    <img className="data-icon" src={priceIcon} alt="price icon"/> <label>{props.costo}</label>
                </div>
                <img className="edit" id="update" src={edit} onClick={props.update}/>
            </div>
            </>)
}

function CreateModifyCard(props){
    const [dip, setDip] = useState("undefined");
    const [prezzi, setPrezzi] = useState("undefined");

    useEffect(() => {
        onValue(dipRef, (snapshot) => {
            if(snapshot.exists()){
                setDip(snapshot.val());
            }
        });
        onValue(prezziRef, (snapshot) => {
            if(snapshot.exists()){
                setPrezzi(snapshot.val());
            } 
        });

        return;
    }, []);

    if(dip === "undefined" || prezzi === "undefined" ){
        return <Loading />
    }

    return  <Popup
                display={props.display}
                hide={props.hide}
                title={props.title}>

            <h3 className="form-label">Dipendente</h3>
                    <input value={props.index} id="index" type="hidden"></input>

                    <select className="form-select" style={props.error} id="select-dip" aria-label="Default select example" name="dip" value={props.dip} onChange={props.changeCardProps}>
                        <option value="default">Seleziona Dipendente</option>
                            {dip.map((data) => {return <option value={data.nome + " " + data.cognome} key={data.nome}>{data.nome} {data.cognome}</option>})}
                            
                    </select>
                    <h3 className="form-label">Pasto</h3>
                    <select className="form-select" style={props.error} id="select-food" aria-label="Default select example" name="food" value={props.food} onChange={props.changeCardProps}>
                        <option value="default">Seleziona Pasto</option>
                            {prezzi.map((data) => {return <option value={data.pasto + " " + data.prezzo + " " + data.dipendente + " " + data.luxpan} key={data.pasto}>{data.pasto} € {data.prezzo}</option>})}

                    </select>

                    <div className="button-div">
                        <button className="btn create-button" onClick={props.action} value={props.mese} name={props.giorno}>{props.type}</button>
                        <button className="btn cancel-button" onClick={props.hide}>Annulla</button>
                    </div>
                       { props.type === "Modifica" && <button className="btn cancel-button" onClick={props.delete}>Elimina</button> } 
            </Popup>

}

function Card(props){
    const [style, changeStyle] = useState({
        backgroundColor: "#fff",
        color: "#234E9C"
    });
    const [hidden, show] = useState({
        display: "none"
    });
    const [newCardProps, setNewCardProps] = useState({
        dip: "default",
        food: "default"
    });
    const [selectError, setSelectError] = useState({});

    function mouseOn(event){
        if(event.target.id === "add"){
            changeStyle({
                backgroundColor: "#234E9C",
                color: "#fff"
                });
        }
    }

    function mouseOver() {
        changeStyle({
            backgroundColor: "#fff",
            color: "#234E9C"
        });
    }

    function newCard(event){
        if(event.target.id === "add"){
            show({
                display: "block"
            });
            setNewCardProps({
                dip: "default",
                food: "default"
            })
        } else if (event.target.id === "update"){
            setNewCardProps({
                dip: (props.nome + " " + props.cognome),
                food: (props.pasto + " " + props.prezzo + " " + props.dipPrice + " " + props.luxPrice)
            })
            console.log(newCardProps);
            show({
                display: "block",
                update: true
            });
        }
        
    }

    function closeNewCard(){
        show({
            display: "none"
        })
    }

    function changeCardProps(event){
        const {value, name} = event.target;
        console.log(event.target);
        setNewCardProps((prevValue) => {
            return {
                ...prevValue,
                [name]: value
            }
        });

        console.log(newCardProps);
    }

    function createNewCard(event){
        const path = event.target.value + "/" + event.target.name;
        const fullname = newCardProps.dip;
        const fullfood = newCardProps.food;
        const errorStyle = {
            border: "1px solid #F5333F"
        }

        if(newCardProps.food === "default" || newCardProps.dip === "default"){ 
            setSelectError(errorStyle); 
        }
        else{
            setSelectError({dip: {}, food: {}});
            createPasti(path, props.oldCardArray, fullname, fullfood);
            closeNewCard();
        }
    }

    function updateCard(){
        const path ='/Pasti/' + props.mese + "/" + props.giorno + "/" + props.index;
        const fullname = newCardProps.dip;
        const fullfood = newCardProps.food;

       updatePasti(path, fullname, fullfood);

       closeNewCard();
    }
    function deleteCard(){
        const path ='/Pasti/' + props.mese + "/" + props.giorno + "/" + props.index;
        
        deletePasti(path);

        closeNewCard();
    }

    return <>
    <div className="col-lg-3 col-md-6">
    <div className="card" 
        style={style}
        id={props.idName}
        onMouseOver={mouseOn}
        onMouseOut={mouseOver}
        onClick={newCard}
        >

        {props.nome ? <ContentCard
            nome={props.nome}
            cognome={props.cognome}
            pasto={props.pasto}
            costo={props.costo}
            update={newCard}
            /> : <p id="add">{props.txt}</p>}

    </div> 
    </div>
    {!hidden.update ? 
        <CreateModifyCard 
        display={hidden}
        hide={closeNewCard}
        action={createNewCard}
        dip={newCardProps.dip}
        food={newCardProps.food}
        changeCardProps={changeCardProps} 
        mese={props.mese}
        giorno={props.giorno}
        error={selectError}
        index={props.index}
        title={"Crea Pasto"}
        type={"Crea"}
        />  :
        
        <CreateModifyCard 
        display={hidden}
        hide={closeNewCard}
        action={updateCard}
        delete={deleteCard}
        dip={newCardProps.dip}
        food={newCardProps.food}
        changeCardProps={changeCardProps} 
        mese={props.mese}
        giorno={props.giorno}
        error={selectError}
        index={props.index}
        title={"Modifica Pasto"}
        type={"Modifica"}
        />  }
    
    </>
}

export default Card;