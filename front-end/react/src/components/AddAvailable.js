import React, {useState} from "react"
import AddRequests from "./AddRequests"
import React from "react"
// import ReactDOM from 'react-dom'
import { useDrop } from 'react-dnd'
import itemTypes from "../data/itemType"
import available from "../data/available"
import requests from "../data/requests"
import "./comp-style.css"
import {createBox} from "./SplitCredits.js";

export default function addAvailable(prop){
    const [addingStudent, setAddingStudent] = useState([])
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: itemTypes.GRADUATE_STUDENT, // the type(s) to accept -- strings or symbols

        drop: (item) => addStudent(item.id),

        // props to collect
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop()
        })
    }))

    const addStudent = (id) => {
        const droppedStudents = requests.filter(slot => id === slot.id)
        setAddingStudent(addingStudent => [...addingStudent, droppedStudents[0]])
    }

    const slottedStudents = addingStudent.map(item => <AddRequests key = {item} {...item}/>)

    return (
        <React.Fragment>
            <div className="drop-items-here">
                <div className="courses--container">
                    <p>CSE {prop.CSE}</p>
                    <br></br>
                </div>
                {/*FIX HERE*/}
                <div className="slots--container" ref={drop} id = {isOver ? "hover-region" : ""}>
                    <span className="slotted">{slottedStudents}</span>
                    <p className="prop--slot">{prop.slots}</p>
                </div>
            </div>
        </React.Fragment>
        // createBox("test");
    )
}