import React from "react";

function Popup (props){

    return <>
            <div className="create-card" style={props.display} >
                <div className="card-form">
                    <p className="close" onClick={props.hide}>X</p>
                    <h1 className="form-title">{props.title}</h1>

                    {props.children}
                
                </div>
            </div>
    </>
}

export default Popup;