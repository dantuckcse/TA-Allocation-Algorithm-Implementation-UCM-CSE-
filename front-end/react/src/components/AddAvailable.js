import React, {useState} from "react"
import AddRequests from "./AddRequests"
import { useDrop } from 'react-dnd'
import itemTypes from "../data/itemType"
import "./comp-style.css"

export default function addAvailable(prop){
    const [addAvailable, setAddAvailable] = useState([])
    const [{ isOver }, drop] = useDrop({
        accept: itemTypes.CARD,
        drop: (item) => setAddAvailable((addAvaiable) =>
            !addAvailable.includes(item) ? [...addAvailable, item] : addAvailable),
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    })

    return (
        <React.Fragment>
        <div className="drop-items-here">
            <div className="courses--container">
                <p>CSE {prop.CSE}</p>
                <br></br>
            </div>
            <div className="slots--container" ref={drop} id = {isOver ? "hover-region" : ""}>
                {addAvailable.map(slots => <AddRequests id={slots.id} name={slots.name} />)}
                <p>{prop.slots}</p>
            </div>
        </div>
        </React.Fragment>
    )
}