import React from "react"
// import ReactDOM from 'react-dom'
import { useDrop } from 'react-dnd'
import itemTypes from "../data/itemType"
import "./comp-style.css"
import {createBox} from "./SplitCredits.js";

export default function addAvailable(prop){
    const [{ isOver }, drop] = useDrop({
        accept: itemTypes.CARD,
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    })
    // const root = ReactDOM.createRoot(
    //     document.getElementsByClassName('slots--container')
    // );
    // const element = "test";
    // root.render(element);

    return (
        <div className="drop-items-here">
            <div className="courses--container">
                <p>CSE {prop.CSE}</p>
                <br></br>
            </div>
            {/*FIX HERE*/}
            <div className="slots--container" ref={drop} id = {isOver ? "hover-region" : ""}>
                <p>{prop.slots}</p>
            </div>
        </div>
        // createBox("test");
    )
}