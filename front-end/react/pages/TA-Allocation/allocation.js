import { useState, createContext, useEffect } from 'react'
import StudentCard from "../../components/StudentCard"
import CourseCard from "../../components/CourseCard"
import AssignedStudents from "../../components/AssignedStudents"
//import requests from "./data/requests"
import { requestData } from "./data/requests";
//import available from "./data/available"
import { availableData } from "./data/available"
import Head from 'next/head'
import Layout from "../layout/layout.js"
import { url } from "../../components/url"
import { currentSemesterData } from "../Data-Form"

export const CardContext = createContext({
    markAsFinalized: null,
})

export default function Allocation() {
    const [courses, setCourses] = useState(() => availableData)
    const [students, setStudents] = useState(() => requestData)

    /*  markAsFinalized filters all of the students' ids using the following condition:
     -  If the id of the student being dropped (droppedID) matches an id in the students array (f_student.id),
        then the dragged student will be accepted into the dropped slot (setStudents). */  
    const markAsFinalized = id => {
        const f_student = students.filter((f_student, i) => id === f_student.id) // f_student = filtered student
        f_student[0].finalized = "YES" // Once the item is "dropped", finalized will be marked as "YES".
        
        // This removes the student item that matches the id of the dropped item from the leftside selection
        setStudents(students.filter((f_student, i) => f_student.id !== id).concat(f_student[0]))
    }

    const finalize = () => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentSemesterData)
        };
        fetch(`${url}/finalized`, requestOptions)
            .then(response => response.json())
            .then(msg => console.log(msg))
    }

    const reset = () => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentSemesterData)
        };
        fetch(`${url}/reset`, requestOptions)
            .then(response => response.json())
            .then(msg => console.log(msg))
    }

    const exportFunc = () => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentSemesterData)
        };
        fetch(`${url}/allocation`, requestOptions)
            .then(response => response.json())
            .then(msg => console.log(msg))
    }

    // Setup & Ranking
    // go to data form, click semester, then go to TA allocation
    useEffect(() => {
        console.log(currentSemesterData);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentSemesterData)
        };
        fetch(`${url}/setup`, requestOptions)
            .then(response => response.json())
            .then(data => fetch(`${url}/rankings`))
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setStudents(data)
            })
    }, []);

    return (
        <Layout>
            <Head>
                <title>TA Allocation</title>
            </Head>
            <AssignedStudents />
            <CardContext.Provider value={{ markAsFinalized }}>
                <div className="drag-and-drop">
                    <div className="selected-container">
                        {courses
                            .map((f_course, i) => (
                                <CourseCard
                                    key={f_course.id.toString()}
                                    index={i}
                                    id={f_course.id}
                                    CSE={f_course.CSE}
                                    slots={f_course.slots}
                                />

                            ))}
                    </div>

                    <div className="unselected-container">
                        {students
                            .filter((f_student, i) => f_student.finalized === "NO")
                            .map((f_student, i) => (
                                <StudentCard
                                    key={f_student.id.toString()}
                                    index={i}
                                    id={f_student.id}
                                    rank={f_student.rank}
                                    student={f_student.student}
                                    courses={f_student.courses}
                                    professor={f_student.professor}
                                    percentage={f_student.percentage}
                                />
                            ))}
                    </div>
                    <div className="TA-Button-Container">
                        <button onClick={finalize}>Finalize</button>
                        <button onClick={exportFunc}>Export</button>
                        <button onClick={reset}>Reset</button>
                    </div>
                </div>
            </CardContext.Provider>
        </Layout>
    )
}