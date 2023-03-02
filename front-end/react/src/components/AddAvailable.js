import React from "react"
import { useDrag } from 'react-dnd'
import "./comp-style.css"

export default function addAvailable(prop){
    return (
        <div className="drop-items-here">
            <div className="courses--container">
                <p>CSE {prop.CSE}</p>
                <br></br>
            </div>
            <div className="slots--container">
                <p>{prop.slots}</p>
            </div>
        </div>
    )
}