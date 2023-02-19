import React, {useState, useEffect} from "react";
import { dipRef } from "../db";
import { onValue } from "firebase/database";
import Loading from "./Loading";

function Row(props){
    const i = props.index
    return <tr>
    {i === 0 && <td className="cell-body" rowSpan={props.nr}>{props.giorno}</td>}
    {props.dipendenteVis && <td className="cell-body" >{props.nome}</td>}
    {props.pastoVis && <td className="cell-body" >{props.pasto}</td>}
    {props.costoVis && <td className="cell-body" >{props.prezzo}</td>}
    {props.cdipVis && <td className="cell-body" >{props.dip}</td>}
    {props.cluxVis && <td className="cell-body" >{props.lux}</td>}
</tr>
}

function Views(props){
    const view = props.view;
    if(view === "completo"){
        return <div>
                 <h2 className="table-title">Completo</h2>
                    <Table 
                        giorno={true}
                        mese={props.selectMese}
                        dipendente={true}
                        pasto={true}
                        costo={true}
                        cdip={true}
                        clux={true}
                        content={props.content}
                    />
                </div>
    }
    if(view === "paghe"){
        return <div>
                    {(props.dip).map((value, index) => {
                        return <div key={index}>
                        <h2 className="table-title" >{value.nome + " " + value.cognome}</h2>
                        <Table 
                                    giorno={true}
                                    mese={props.selectMese}
                                    pasto={true}
                                    cdip={true}
                                    content={props.content}
                                    filterName={value.nome}
                                    filterLastName={value.cognome}
                                />
                        </div>
                    })}
                </div>
    }
    if(view === "fattura"){
        return <div>
                    <h2 className="table-title">Fattura</h2>
                    <Table 
                        giorno={true}
                        mese={props.selectMese}
                        dipendente={true}
                        pasto={true}
                        costo={true}
                        content={props.content}
                    />
                </div>
    }
}

function Table(props){
    const content = props.content;
    let pasti = [];
    let totFattura = 0;
    let totDip = 0.0;
    let totLux = 0.0;

    if(!content){
        return <Loading />
    }

    for (const [keys, value] of Object.entries(content)) {
        pasti.push(value);        
    }

    return <>
        <table className="table table-report">
            <thead>
                <tr className="table-head-report">
                {props.giorno && <th className="cell-header" >Giorno</th>}
                {props.dipendente && <th className="cell-header" >Dipendente</th>}
                {props.pasto && <th className="cell-header" >Pasto</th>}
                {props.costo && <th className="cell-header" >Costo</th>}
                {props.cdip && <th className="cell-header" >C. Dip</th>}
                {props.clux && <th className="cell-header" >C. Lux</th>}
                </tr>
            </thead>


                {pasti.map((data, index) => {
                    return <tbody className="table-body-report" key={index}>

                        {data.filter(element => {
                            if(props.filterName){
                                return element.nome === props.filterName && element.cognome === props.filterLastName;
                            }
                            return element;
                        })
                             .map((value, index) => {
                                {value.prezzo && (totFattura += parseFloat(value.prezzo))}
                                {value.dip && (totDip += parseFloat(value.dip))}
                                {value.lux && (totLux += parseFloat(value.lux))}
                            return <Row 
                                giorno={(parseInt(value.giorno) + 1) + "-" + props.mese}
                                nome={value.nome + " " + value.cognome}
                                prezzo={value.prezzo}
                                pasto={value.pasto}
                                dip={value.dip}
                                lux={value.lux}
                                index={index}
                                key={index}
                                nr={data.length}
                                dipendenteVis={props.dipendente}
                                pastoVis={props.pasto}
                                costoVis={props.costo}
                                cdipVis={props.cdip}
                                cluxVis={props.clux}
                            />
                        })}

                    </tbody>
                })}
                <thead>
                <tr className="table-head-report">
                {props.giorno && <th className="cell-header" ></th>}
                {props.dipendente && <th className="cell-header" ></th>}
                {props.pasto && <th className="cell-header" ></th>}
                {props.costo && <th className="cell-header" >€ {totFattura}</th>}
                {props.cdip && <th className="cell-header" >€ {totDip}</th>}
                {props.clux && <th className="cell-header" >€ {totLux}</th>}
                </tr>
            </thead>
        </table>
    </>
}


function Reports (props){
const today = new Date();
const currentMese = (today.getMonth()+1) + "-" + today.getFullYear();
const [selectMese, setSelectedMese] = useState(currentMese);
const [view, setview] = useState("completo");
const pasti = props.pasti;
const mesi = Object.keys(pasti);
const [dip, setDip] = useState("undefined");

    useEffect(() => {
        onValue(dipRef, (snapshot) => {
            if(snapshot.exists()){
                setDip(snapshot.val());
            } 
        });
    }, []);

    if(dip === "undefined"){
        return <></>
    }

function changeSelectMese(event){
    setSelectedMese(event.target.value);
}
function changeView(event){
    const name = event.target.name;
    setview(name);
}


    return <>
        <h1 className="title" id="reports">Reports</h1>
        <select className="select-mese-report" id="select-mese" aria-label="Default select example" name="mese" value={selectMese} onChange={changeSelectMese}>
            {mesi.map((data) => {return <option value={data} key={data}>{data}</option>})}
        </select>
        <button className={view === "completo" ? "button-report-active button-report" : "button-report-no-active button-report"}
                name={"completo"} 
                value={true}
                onClick={changeView}>Completo</button>
        <button className={view === "paghe" ? "button-report-active button-report" : "button-report-no-active button-report"} 
                name={"paghe"}
                value={false}
                onClick={changeView}>Paghe</button>
        <button className={view === "fattura" ? "button-report-active button-report" : "button-report-no-active button-report"} 
                name={"fattura"}
                value={false}
                onClick={changeView}>Fattura</button>


        <Views 
            view={view}
            selectMese={selectMese}
            content={pasti[selectMese]}
            dip={dip} />
        
    </>
}

export default Reports