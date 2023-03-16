import React, {useState} from "react"
import AddRequests from "./AddRequests"
import React from "react"
// import ReactDOM from 'react-dom'
import { useDrop } from 'react-dnd'
import itemTypes from "../data/itemType"
import available from "../data/available"
import "./comp-style.css"
import {createBox} from "./SplitCredits.js";

export default function addAvailable(prop){
    const [addAvailable, setAddAvailable] = useState([])
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
        const droppedStudents = available.filter(slot => id === slot.id)
        setAddAvailable(addAvailable => [...addAvailable, droppedStudents[0]])
    }

    const slottedStudents = addAvailable.map(slot => <AddRequests id={slot.id} rank={slot.rank} professor={slot.professor} student={slot.student} courses={slot.courses} finalized={true}/>)

    // const root = ReactDOM.createRoot(
    //     document.getElementsByClassName('slots--container')
    // );
    // const element = "test";
    // root.render(element);

    return (
        <React.Fragment>
            <div className="drop-items-here">
                <div className="courses--container">
                    <p>CSE {prop.CSE}</p>
                    <br></br>
                </div>
                {/*FIX HERE*/}
                <div className="slots--container" ref={drop} id = {isOver ? "hover-region" : ""}>
                    {slottedStudents}
                    <p>{prop.slots}</p>
                </div>
            </div>
        </React.Fragment>
        // createBox("test");
    )
}