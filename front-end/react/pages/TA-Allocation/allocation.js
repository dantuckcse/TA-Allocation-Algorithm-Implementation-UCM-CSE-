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
import { currentSemesterData } from "../index";
import Modal from "react-modal"
import jsPDF from "jspdf"
// import finalized_export from "../TA-Allocation/export.json"

export const CardContext = createContext({
    markAsFinalized: null,
})
export const studentData = []

export default function Allocation() {
    const [courses, setCourses] = useState([])
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)

    const [exportData, setExportData] = useState(false)
    const [isExportDataHere, setIsExportDataHere] = useState(false);


    // Setup & Ranking
    // go to data form, click semester, then go to TA allocation
    useEffect(() => {
        console.log(currentSemesterData);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentSemesterData)
        };

        const setup = async () => {
            const setupResponse = await fetch(`${url}/setup`, requestOptions);
            const setupMsg = await setupResponse.json();
            const rankingsResponse = await fetch(`${url}/rankings`)
            const rankings = await rankingsResponse.json();

            console.log("Rankings===> ", rankings)
            studentData.push(rankings)
            setStudents(rankings)

            const coursesResponse = await fetch(`${url}/available_courses`)
            const coursesData = await coursesResponse.json();

            console.log('Courses===>', coursesData);
            setCourses(coursesData);

            setLoading(false)
        }

        setup();
    }, []);

    //Export Data Display Variables and Functions
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [fileName, setFileName] = useState("");
    async function openExportModal() {
        setIsExportModalOpen(true);
        //Fetch export data
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentSemesterData)
        };

        const response = await fetch(`${url}/allocation`, requestOptions);

        console.log("response: ", response)

        if (response.status == 200) {
            let data = await response.json();
            setExportData(data);
            setIsExportDataHere(true)
            console.log('response data: ', data)
        }
        else {
            console.log('hasnt been finalized')
        }


    } //popup open
    function closeExportModal() { setIsExportModalOpen(false); } //popup close
    function handleFileNameChange(event) { setFileName(event.target.value); }
    function handleExportPDF() {
        const doc = new jsPDF();
        let x = 10;
        let y = 10;
        let pageHeight = doc.internal.pageSize.height;
        exportData.forEach((item) => {
            // Check if adding the text will exceed the height of the page
            if (y > pageHeight - 20) {
                doc.addPage();
                y = 10;
            }
            Object.entries(item).forEach(([key, value]) => {
                doc.text(`${key}: ${value}`, x, y);
                y += 10;
            });
            // Add some space between each data item
            y += 10;
        });
        doc.save(`${fileName}.pdf`);
    }


    const finalize = async () => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentSemesterData)
        };
        const response = await fetch(`${url}/finalized`, requestOptions)
        let msg = await response.json();
        console.log(msg)
    }


    const reset = async () => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentSemesterData)
        };
        const response = await fetch(`${url}/reset`, requestOptions);
        let msg = await response.json();
        console.log(msg)
    }

    /*  markAsFinalized filters all of the students' ids using the following condition:
         -  If the id of the student being dropped (droppedID) matches an id in the students array (f_student.id),
            then the dragged student will be accepted into the dropped slot (setStudents). */
    const markAsFinalized = id => {
        const f_student = students.filter((f_student, i) => id === f_student.id) // f_student = filtered student
        f_student[0].finalized = "YES"  // Once the item is "dropped", finalized will be marked as "YES".

        // This removes the student item that matches the id of the dropped item from the leftside selection
        setStudents(students.filter((f_student, i) => f_student.id !== id).concat(f_student[0]))
    }

    if (loading) {
        return <p>Loading...</p>
    }

    return (
        <Layout>
            <Head>
                <title>TA Allocation</title>
            </Head>
            <AssignedStudents />

            <div className='TA-Button-Container'>
                <button className='TA-Button' onClick={finalize}>Finalize</button>
                <button className='TA-Button' onClick={openExportModal}>Export</button>
                <Modal isOpen={isExportModalOpen} onRequestClose={closeExportModal}>
                    <h2>Export Data</h2>
                    <div>
                        <label htmlFor="fileName">File Name: </label>
                        <input
                            type="text"
                            id="fileName"
                            value={fileName}
                            placeholder='PDF Name Here...'
                            onChange={handleFileNameChange}
                        />
                    </div>
                    {/* <pre>{JSON.stringify(finalized_export, null, 2)}</pre> */}
                    <pre>{isExportDataHere ? exportData.map((item, index) => (
                        `rank: ${item.rank !== null ? item.rank : 'null'},
                                student: ${item.student},
                                id: ${item.id},
                                professor: ${item.professor},
                                courses: ${item.courses}`
                    )).join('\n\n') : `Can't export to pdf, semester has not been finalized`}
                    </pre>
                    <button className='TA-Button' onClick={handleExportPDF}>Export to PDF</button>
                    <button className='TA-Button' onClick={closeExportModal}>Close</button>
                </Modal>
                <button className='TA-Button' onClick={reset}>Reset</button>
            </div>

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