import React from "react"
import { useDrag } from "react-dnd"
import itemTypes from "../data/itemType"
import "./comp-style.css"

export default function addRequests(prop){
    const [{ isDragging }, drag ] = useDrag({
        type: itemTypes.CARD,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    })

    return (
        <div className="requests--container" ref={drag}>
            <div className="student--info">
                <p id="student-item" className="student-txt">{prop.student}</p>
                <p id="student-item" className="course-txt">CSE {prop.courses + " "}</p>
                <p id="student-item">{prop.professor} - {prop.percentage}</p>
                <br></br>
            </div>

            <div className="student--slots"></div>
        </div>
    )
}
