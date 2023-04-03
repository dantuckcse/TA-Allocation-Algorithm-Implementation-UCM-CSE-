import { useState, createContext } from 'react'
import StudentCard from "../components/StudentCard"
import CourseCard from "../components/CourseCard"
import requests from "./data/requests"
import available from "./data/available"
import Head from 'next/head'
import Layout from "../layout/layout.js"

export const CardContext = createContext({
    markAsFinalized: null,
})

const available_courses = available.map((item, idx) => {
    return (
        <CourseCard
            item={item}
            key = {idx}
            {...item}
        />
    )
})

const requested_students = requests.map((item, idx) => {
    return (
        <StudentCard
            item={item}
            key = {idx}
            {...item}
        />
    )
})

export default function Allocation() {
    const [students, setStudents] = useState(() => requests)

    const markAsFinalized = id => {
        const f_student = students.filter((f_student, i) => f_student.id === id) // f_student = filtered student
        f_student[0].finalized = "YES"
        setStudents(students.filter((f_student, i) => f_student.id !== id).concat(f_student[0]))
    }

    return (
        <Layout>
            <Head>
                <title>TA Allocation</title>
            </Head>
            
            <CardContext.Provider value={{ markAsFinalized }}>
                <div className="drag-and-drop">
                    <div className="selected-container">
                        
                        {available_courses}
                    </div>
                    <div className="unselected-container">
                        
                        {requested_students}
                        {students
                            .filter((f_student, i) => f_student.finalized === "NO")
                            .map((f_student, i) => {
                                <StudentCard
                                    key={f_student.id.toString()}
                                    id={f_student.id}
                                    student={f_student.student}
                                    courses={f_student.courses}
                                    professor={f_student.professor}
                                    percentage={f_student.percentage}
                                />
                        })}
                    </div>
                    {/* <CourseCard>
                        {students
                            .filter((f_student, i) => f_student.finalized === "YES")
                            .map((f_student, i) => {
                                <StudentCard
                                    key={f_student.id.toString()}
                                    id={f_student.id}
                                    student={f_student.student}
                                    courses={f_student.courses}
                                    professor={f_student.professor}
                                    percentage={f_student.percentage}
                                />
                        })}
                    </CourseCard> */}
                </div>
            </CardContext.Provider>
        </Layout>
    )
}