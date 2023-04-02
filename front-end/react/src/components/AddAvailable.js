import React, {useState} from "react"
import AddRequests from "./AddRequests"
import { useDrop } from 'react-dnd'
import itemTypes from "../data/itemType"
import available from "../data/available"
import requests from "../data/requests"
import "./comp-style.css"

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
    
    let boxTotal = prop.slots;
    const boxes = [];
    while (boxTotal != 0){
        if(boxTotal >= 0.5){
            boxes.push(0.5);
            boxTotal -= (0.5)
        } else if(boxTotal >= 0.25){
            boxes.push(0.25);
            boxTotal -= 0.25;
        }
    }



    return (
        <React.Fragment>
            <div className="drop-items-here">
                <div className="courses--container">
                    <p>CSE {prop.CSE}</p>
                    <br></br>
                </div>
                
                {/*FIX HERE*/}
                {/* <div className="slots--container" ref={drop} id = {isOver ? "hover-region" : ""}>
                    <span className="slotted">{slottedStudents}</span>
                    <p className="prop--slot">{prop.slots}</p>
                </div> */}
                {boxes.map((b) =>{
                    return(
                        <div className="slots--container" ref={drop} id = {isOver ? "hover-region" : ""}>
                            <span className="slotted">{slottedStudents}</span>
                            <p className="prop--slot">{b}</p>
                        </div>
                    )     
                })}
                {/* <CreateBox drop = {drop} isOver = {isOver} slottedStudents = {slottedStudents} slots = {prop.slots}/> */}
            </div>
        </React.Fragment>
        // createBox("test");
    )
}