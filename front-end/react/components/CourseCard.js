import { useDrop } from 'react-dnd'
import { useContext, useState } from "react"
import itemTypes from "../utils/itemType"
import { CardContext } from "../pages/TA-Allocation/allocation.js"
import StudentCard from "./StudentCard"
import { currentSemesterData } from '../pages/home/index';
import { url } from '../components/url'
import { studentData } from "../pages/TA-Allocation/allocation.js"


export default function CourseCard(prop) {
    const { markAsFinalized } = useContext(CardContext);
    const [students, setStudents] = useState(() => studentData[0])

    const [addingStudent, setAddingStudent] = useState([])

    // console.log("STUDENT DATA: ", studentData)

    /*  This works similarly to 'markAsFinalized' in allocation.js'. 
    addStudent ensures that the student dropped stays inside of the dropped slot
    by storing the dropped students in 'droppedStudents.*/
    const addStudent = (id) => {
        const droppedStudents = students.filter(slot => id === slot.id)
        console.log("DROPPED STUDENT: ", droppedStudents)
        setAddingStudent(addingStudent => [...addingStudent, droppedStudents[0]])
    }

    /*  slottedStudents maps through *filtered* students. The filter conditions are:
     -  The 'finalized' item in the students object must be equal to "YES".
        Being 'finalized' means that they have been added to a slot. 
        They are set as 'finalized' in allocation.js, in markAsFinalized. */
    const slottedStudents = addingStudent

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
                finalized="YES"
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
                    const [{ isOver }, drop] = useDrop(() => ({ // react-dnd's drop state

                        accept: itemTypes.UNSLOTTED_STUDENT,
                        drop(item, monitor) {
                            // Check if student's course code matches prop.CSE
                            if (item.courses === prop.CSE || item.courses.includes(`<span class="prevent">${prop.CSE}</span>`)) {
                                return null; // Cancel drop operation
                            }

                            markAsFinalized(item.id);
                            addStudent(item.id);

                            console.log("DROPPED ON COURSE: =====> ", prop.CSE)
                            item.courses = prop.CSE;
                            console.log("ITEM: =====> ", item)

                            // reranking & rankings requests here
                            // runs each time a student is dragged & dropped to a class
                            const body = {
                                assignment: item,
                                semester: currentSemesterData
                            }
                            console.log('body: ', body);
                            const requestOptions = {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(body)
                            };
                            fetch(`${url}/reranking`, requestOptions)
                                .then(response => response.json())
                                .then(data => fetch(`${url}/rankings`))
                                .then(response => response.json())
                                .then(data => {
                                    // Edit here if no work
                                    console.log('reranked data, ', data)
                                    setStudents(data);
                                })

                            return monitor.getItem()
                        },
                        collect: monitor => ({
                            isOver: !!monitor.isOver(),
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
