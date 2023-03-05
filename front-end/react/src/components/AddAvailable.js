import React from "react"
import { useDrop } from 'react-dnd'
import itemTypes from "../data/itemType"
import "./comp-style.css"

export default function addAvailable(prop){
    const [{ isOver }, drop] = useDrop({
        accept: itemTypes.CARD,
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    })

    return (
        <div className="drop-items-here">
            <div className="courses--container">
                <p>CSE {prop.CSE}</p>
                <br></br>
            </div>
            <div className="slots--container" ref={drop} id = {isOver ? "hover-region" : ""}>
                <p>{prop.slots}</p>
            </div>
        </div>
    )
}