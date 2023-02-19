import React, {useState} from "react";
import Loading from "./Loading";


function Table (props){
    const content = props.content;
    console.log(content);
    let days = [];

    console.log("content: " + content);

    if(!content){
        return <Loading />
    }

    for(var i=0; i<30; i++){
        if(content[i]){
            days.push(i);
        }
    }

    return <>
        <table>
            <thead>
            {/* HEADER */}
            <tr className="table-header">
                {props.giorno && <th className="cell-header" >Giorno</th>}
                {props.dipendente && <th className="cell-header" >Dipendente</th>}
                {props.costo && <th className="cell-header" >Costo</th>}
                {props.cdip && <th className="cell-header" >C. Dipendente</th>}
                {props.clux && <th className="cell-header" >C. Luxpan</th>}
            </tr>
            </thead>
            <tbody>
            {/* BODY */}
            {days.map((i) => {
                {props.giorno && <th className="cell-wrap">{i++}</th>}
                content[i].map((data) => {
                return <tr className="table-content">
                    {props.dipendente && <th className="cell-content">{data.dipendete}</th>}
                    {props.costo && <th className="cell-content">{data.giorno}</th>}
                    {props.cdip && <th className="cell-content">{data.giorno}</th>}
                    {props.clux && <th className="cell-content">{data.giorno}</th>}
                </tr>
                })
            })}
            </tbody>


        </table>
    </>

}


function Reports (props){

    const pasti = props.pasti;
    const mesi = Object.keys(pasti);
    const [selectMese, setSelectMese] = useState(mesi[mesi.length -1]);

    console.log("pasti: " + pasti);


    function changeSelectMese (event){
        setSelectMese(event.target.value);
    }

console.log(selectMese);

if(!pasti){
    return <Loading />
}

    return <>
             <h1 className="title">
                Reports
             </h1>
            <select className="select-mese-report" id="select-mese" aria-label="Default select example" name="mese" value={selectMese} onChange={changeSelectMese}>
             {mesi.map((data) => {return <option value={data} key={data}>{data}</option>})}
             </select>

             <Table 
                content={pasti[selectMese]}
                giorno="true"
                dipendete="true"
                costo="true"
                cdip="true"
                clux="true"

             />
            </>


}

// export default Reports;