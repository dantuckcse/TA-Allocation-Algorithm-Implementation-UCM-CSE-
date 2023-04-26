import { useDrop } from 'react-dnd'
import { useContext, useState } from "react"
import itemTypes from "../utils/itemType"
import { CardContext } from "../pages/TA-Allocation/allocation.js"
import StudentCard from "./StudentCard"
import { requestData } from "../pages/TA-Allocation/data/requests"
import { currentSemesterData } from '@/pages/Data-Form'
import { url } from '../components/url'
import { assigned_student } from './AssignedStudents'

export default function CourseCard(prop) {
    const { markAsFinalized } = useContext(CardContext);
    const [students, setStudents] = useState(() => requestData)

    const [addingStudent, setAddingStudent] = useState([])

    const addStudent = (id) => {
        const droppedStudents = students.filter(slot => id === slot.id)
        setAddingStudent(addingStudent => [...addingStudent, droppedStudents[0]])
    }

    const slottedStudents = addingStudent
        .filter((f_student, i) => f_student.finalized === "YES")
        .map((f_student, i) =>
            <StudentCard
                key={f_student.id.toString()}
                index={i}
                id={f_student.id}
                rank={f_student.rank}
                student={f_student.student}
                courses={f_student.courses}
                professor={f_student.professor}
                percentage={f_student.percentage}
            />)

    let boxTotal = prop.slots;
    const boxes = [];
    while (boxTotal != 0 && boxTotal != undefined) {
        if (boxTotal >= 0.5) {
            boxes.push(0.5);
            boxTotal -= (0.5)
        } else if (boxTotal >= 0.25) {
            boxes.push(0.25);
            boxTotal -= 0.25;
        }
    }
    return (
        <div>
            <div className="drop-items-here">
                <div className="courses--container">
                    <p>CSE {prop.CSE}</p>
                    <br></br>
                </div>
                {boxes.map((b, index) => { // Added index to map
                    const [{ isOver, didDrop, getDropResult }, drop] = useDrop(() => ({
                        accept: itemTypes.UNSLOTTED_STUDENT,
                        // canDrop: (item, monitor) => {  // will use later for "prevent" cases
                        //     return (item.task_id === prop.task_id ? true : false);
                        // },
                        drop(item, monitor) {
                            markAsFinalized(item.id)
                            addStudent(item.id)

                            // reranking & ranking requests here
                            const body = {
                                assignment: item,
                                semester: currentSemesterData
                            }
                            const requestOptions = {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(body)
                            };
                            fetch(`${url}/reranking`, requestOptions)
                                .then(response => response.json())
                                .then(data => console.log(data))
                            // .then(data => fetch(`${url}/rankings`))
                            // .then(response => response.json())
                            // .then(data => console.log(data))

                            return monitor.getItem()
                        },
                        collect: monitor => ({
                            isOver: !!monitor.isOver(),
                            didDrop: monitor.didDrop(),
                            canDrop: !!monitor.canDrop()
                        }),
                    }))
                    return (
                        <div className="slots--container">
                            {slottedStudents[index] ? (
                                <div className="items-dropped" ref={drop} id={isOver ? "hover-region" : ""} key={index}>
                                    <CardContext.Provider value={{ markAsFinalized }}>
                                        {slottedStudents[index]}
                                    </CardContext.Provider>
                                </div>
                            ) : (
                                <div className="empty-slot" ref={drop} id={isOver ? "hover-region" : ""} key={index}>
                                    <span id="slot-amount">{b}</span>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
