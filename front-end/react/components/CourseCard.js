import { useDrop } from 'react-dnd'
import { useContext, useState } from "react"
import  itemTypes  from "../utils/itemType"
import  { CardContext }  from "../pages/TA-Allocation/allocation.js"
import StudentCard from "./StudentCard"
import requests from "../pages/TA-Allocation/data/requests"

export default function CourseCard(prop){
    const { markAsFinalized } = useContext(CardContext);
    const [students, setStudents] = useState(() => requests)

    const [addingStudent, setAddingStudent] = useState([])

    const addStudent = (id) => {
        const droppedStudents = requests.filter(slot => id === slot.id)
        setAddingStudent(addingStudent => [...addingStudent, droppedStudents[0]])
    }

    const slottedStudents = addingStudent
        .filter((f_student, i) => f_student.finalized === "YES")
        .map((f_student, i) => 
            <StudentCard
                key={f_student.id.toString()}
                index={i}
                id={f_student.id}
                student={f_student.student}
                courses={f_student.courses}
                professor={f_student.professor}
                percentage={f_student.percentage}
            />)

    let boxTotal = prop.slots;
    const boxes = [];
    while (boxTotal != 0 && boxTotal != undefined){
        if(boxTotal >= 0.5){
            boxes.push(0.5);
            boxTotal -= (0.5)
        } else if(boxTotal >= 0.25){
            boxes.push(0.25);
            boxTotal -= 0.25;
        }
    }

    return(
        <div>
            <div className="drop-items-here">
                <div className="courses--container">
                    <p>CSE {prop.CSE}</p>
                    <br></br>
                </div>
                {boxes.map((b, index) =>{ // Added index to map
                    const [{ isOver, didDrop, getDropResult }, drop] = useDrop(() => ({
                        accept: itemTypes.UNSLOTTED_STUDENT,
                        drop(item, monitor) {
                            markAsFinalized(item.id)
                            addStudent(item.id)
                        },
                        collect: monitor => ({
                            isOver: !!monitor.isOver(),
                            didDrop: monitor.didDrop(),
                            getDropResult: monitor.getDropResult()
                        }),
                    }))
                    return(
                        <div className="slots--container" ref={drop} id={ isOver ? "hover-region" : ""} key={index}>
                            <p className="prop--slot"> {b}
                                <CardContext.Provider value={{ markAsFinalized }}>
                                    {index < slottedStudents.length ? slottedStudents[index] : null}
                                </CardContext.Provider>
                            </p>
                        </div>
                    )     
                })}

            </div>
        </div>
    )
}
