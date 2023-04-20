import { useState, createContext } from 'react'
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

    const markAsFinalized = id => {
        const f_student = students.filter((f_student, i) => id === f_student.id) // f_student = filtered student
        f_student[0].finalized = "YES"
        setStudents(students.filter((f_student, i) => f_student.id !== id).concat(f_student[0]))
    }

    // Setup
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentSemesterData)
    };
    fetch(`${url}/setup`, requestOptions)
        .then(response => response.json())
        .then(data => console.log(data));

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
                </div>
            </CardContext.Provider>
        </Layout>
    )
}