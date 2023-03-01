import React from "react"
import { useDrag } from 'react-dnd'
import "./comp-style.css"

export default function addRequests(prop){
    return (
        <div className="requests--container">
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
