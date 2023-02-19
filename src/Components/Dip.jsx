import React, {useState, useEffect} from "react";
import userIcon from "../icons/MaleUser.png";
import edit from "../icons/Edit.png";
import { createDip, deleteDip, updateDip, dipRef } from "../db";
import { onValue } from "firebase/database";
import Loading from "./Loading";
import Popup from "./Popup";

function CreateModifyDip(props) {
    return <Popup
               display={props.display}
                hide={props.hide}
                title={props.title}>

                <h3 className="form-label">Dipendente</h3>
                     <input value={props.index} id="indexDip" type="hidden"></input>

                    <input type="text" placeholder="Nome" className="input-text" name="nome" id="nomeDip" value={props.nome} onChange={props.changeDipProps}/>
                    <input type="text" placeholder="Cognome" className="input-text" name="cognome" id="cognomeDip" value={props.cognome} onChange={props.changeDipProps}/>

                    <div className="button-div">
                        <button className="btn create-button" onClick={props.action}>{props.type}</button>
                        <button className="btn cancel-button" onClick={props.hide}>Annulla</button>
                    </div>
                       { props.type === "Modifica" && <button className="btn cancel-button" onClick={props.delete}>Elimina</button> } 

    </Popup>
}

function DipCard(props){
    const [hidden, show] = useState({
        display: "none"
    });
    const [style, changeStyle] = useState({
        backgroundColor: "#fff",
        color: "#234E9C"
    });
    const [dipProps, setDipProps] = useState({
        nome: "",
        cognome: ""
    });

    function closeNewDip(){
        show({
            display: "none"
        })
    }
    function newDip(event){
        if(event.target.id === "addDip"){
            setDipProps({});
            show({
                display: "block"
            });
        } else if (event.target.id === "update"){
            setDipProps({
                nome: props.nome,
                cognome: props.cognome
            });
            console.log(dipProps);

            show({
                display: "block",
                update: true
            });
        }
    }
    function mouseOn(event){
        if(event.target.id === "addDip"){
            changeStyle({
                backgroundColor: "#234E9C",
                color: "#fff"
                });
        }
    }
    function changeDipProps(event){
        const {name, value} = event.target;

        setDipProps((prevValue) => {
            return {
                ...prevValue,
                [name]: value
            }
        });
    }
    function createNewDip(){
        createDip(dipProps.nome, dipProps.cognome, props.oldDipArray);
        closeNewDip();
    }
    function removeDip(){
        deleteDip(props.index);
    }
    function modifyDip(){
        updateDip(dipProps.nome, dipProps.cognome, props.index);
        closeNewDip();
    }

    function mouseOver() {
        changeStyle({
            backgroundColor: "#fff",
            color: "#234E9C"
        });
    }

    return <>
        <div className="col-lg-4">
            <div    className="dip-card" 
                    id={props.idName} 
                    onClick={props.click}
                    onMouseOver={mouseOn}
                    onMouseOut={mouseOver}
                    style={style}>

            {props.nome ? 
               <><p className="dip-name">
                    <img src={userIcon} className="user-icon"/>
                    {props.nome + " " + props.cognome}
                </p>
                    <img src={edit} className="edit" onClick={newDip} id="update"/> 
                    </> : <p className="dip-name dip-add" onClick={newDip} id="addDip">+</p>}

            </div>
        </div>

        {!hidden.update ? 
        <CreateModifyDip 
        display={hidden}
        hide={closeNewDip}
        index={props.index}
        action={createNewDip}
        delete={removeDip}
        nome={dipProps.nome}
        cognome={dipProps.cognome}
        changeDipProps={changeDipProps}
        title={"Nuovo Dipendente"}
        type={"Nuovo"}
        />  :
        
        <CreateModifyDip 
        display={hidden}
        hide={closeNewDip}
        index={props.index}
        action={modifyDip}
        delete={removeDip}
        nome={dipProps.nome}
        cognome={dipProps.cognome}
        changeDipProps={changeDipProps}
        title={"Modifica Dipendete"}
        type={"Modifica"}
        />  }
    </>
}


function Dip(){
    const [dip, setDip] = useState("undefined");

    useEffect(() => {
        onValue(dipRef, (snapshot) => {
            if(snapshot.exists()){
                setDip(snapshot.val());
            } 
        });
    }, []);

    if(dip === "undefined"){
        return <Loading />
    }

 return <>
    <h1 className="title" id="dipendenti">
            Dipendenti
        </h1>
        <div className="container">
        <div className="row gy-4">
            {dip.map((data, index) => {
                    return <DipCard 
                            nome={data.nome}
                            cognome={data.cognome}
                            key={index} 
                            index={index}
                            />
            })}

            <DipCard 
                idName="addDip"
                oldDipArray={dip}
            />
            </div>
        </div>
 </>
}

export default Dip;