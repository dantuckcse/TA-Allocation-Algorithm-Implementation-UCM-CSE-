import { useDrop } from 'react-dnd'
import { useContext, useState } from "react"
import  itemTypes  from "../../utils/itemType"
import requests from "../TA-Allocation/data/requests"
import  { CardContext }  from "../TA-Allocation/allocation.js"
import StudentCard from "./StudentCard"

export default function CourseCard(prop){
    const { markAsFinalized } = useContext(CardContext);

    const [addingStudent, setAddingStudent] = useState([])
    
    const [{ isOver }, drop] = useDrop(() => ({
        accept: itemTypes.CARD, // the type(s) to accept -- strings or symbols
        drop: (item, monitor) => markAsFinalized(item.id),
        drop: (item) => addStudent(item.id),

        // props to collect
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        })
    }))

    const addStudent = (id) => {
        const droppedStudents = requests.filter(slot => id === slot.id)
        setAddingStudent(addingStudent => [...addingStudent, droppedStudents[0]])
    }

    const slottedStudents = addingStudent.map(item => <StudentCard key = {item} {...item}/>)

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
        <CardContext.Provider value={{ markAsFinalized }}>
            <div className="drop-items-here">
                <div className="courses--container">
                    <p>CSE {prop.CSE}</p>
                    <br></br>
                </div>
                {boxes.map((b) =>{
                    return(
                        <div className="slots--container" ref={drop} id = {isOver ? "hover-region" : ""}>
                            <span className="slotted">{slottedStudents}</span>
                            <p className="prop--slot">{b}</p>
                        </div>
                    )     
                })}
                
            </div>
        </CardContext.Provider>
    )
}