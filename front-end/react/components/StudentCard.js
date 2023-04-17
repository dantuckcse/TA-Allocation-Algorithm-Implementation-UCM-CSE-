import { useDrag } from "react-dnd"
import  itemTypes  from "../utils/itemType"


export default function StudentCard(prop){

    const [{ isDragging }, drag] = useDrag(() => ({
        type: itemTypes.UNSLOTTED_STUDENT, // type is required as it's used by the "accept" specification of drop targets.
        item: {id: prop.id},
        // "collect" utilizes a "monitor" instance to pull important pieces of state from the DnD systems
        collect: monitor => ({
            isDragging: !!monitor.isDragging()
        })
    }))
    
    return (
        <div className="requests--container" ref={drag} id = {isDragging ? "dragging-item" : ""}>
            <div className="student--info">
                <p id="student-item" className="student-txt">{prop.student}</p>
                <p id="student-item" className="course-txt">CSE <span id="cse-check">{Number.isInteger(prop.courses) ? prop.courses + " " :" N/A"}</span></p>
                <p id="student-item">{prop.professor} - {prop.percentage}</p>
                <br></br>
            </div>

            <div className="student--slots"></div>
        </div>
    )
}
