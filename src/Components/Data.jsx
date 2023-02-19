import React, {useState, useEffect}from "react";
import calendar from "../icons/Calendar.png";

function Data(props){ 
    return <div className="calendar-div">
                <input type="date" value={props.data} onChange={props.changeData}></input>
    </div>
}

export default Data;