import { unstable_renderSubtreeIntoContainer } from "react-dom";
import Layout from "./layout/layout.js";
import React, { useEffect, useState } from "react";
import semesterDataList from '../../../back-end/main_pipeline/semester_list.json'
import newSemesterFunction from "./Exported-DataForm/EDF-NewSemester.js"; {/* EXPORT CHECK */ }
import currentSemesterFunction from "./Exported-DataForm/EDF-CurrentSemester.js"; {/* EXPORT CHECK */ }
import { url } from "../components/url.js";

export let currentSemesterData = [];
export let newSemesterData = [];
export let courseDetailData = [];
export let professorDetailData = [];
export let studentDetailData = [];

export default function Data_Form() {
    const [semesterData, setSemesterData] = useState([]);
    useEffect(() => {
        setSemesterData(semesterDataList)
    }, []);

    const [term, setTerm] = useState("");
    const [year, setYear] = useState("");
    const [showModal, setShowModal] = useState(false);
    const handleCreateSemester = () => {
        const newSemester = {
            term: term,
            year: parseInt(year)
        };
        newSemesterData = newSemester;
        setSemesterData([...semesterData, newSemester])
        setTerm("");
        setYear("")
        setShowModal(false);
    };

    const [semesterSelect, setSemesterSelect] = useState([])
    const handleSemesterChange = (e) => {
        const index = e.target.selectedIndex;
        const semester = semesterData[index];
        setSemesterSelect(semester)
        currentSemesterData = semester;
    }

    //HANDLE EXPORT COURSE DETAILS
    const [courseDetail, setCourseDetails] = useState([]);
    const exportCourseNumber = (e) => {
        const updatedCourseDetail = { ...courseDetail, courseNumber: e.target.value };
        setCourseDetails(updatedCourseDetail)
    }
    const exportCourseUnit = (e) => {
        const updatedCourseDetail = { ...courseDetail, courseUnit: e.target.value };
        setCourseDetails(updatedCourseDetail)
    };
    //Course Details - Exclusive for options either YES or NO
    const [exclusive, setSelectedOption] = useState("");
    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value); // Update the selected option in state
    };
    const exportCourseDetails = () => {
        courseDetailData = { ...courseDetail, exclusive };
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(courseDetailData)
        };
        fetch(`${url}/course`, requestOptions)
            .then(response => response.json())
            .then(data => console.log("inputted new course"))
        console.log("Submitted Course Data: ", courseDetailData)
    };

    //HANDLE EXPORT PROFESSOR DETAILS
    const [professorDetail, setProfessorDetails] = useState([]);
    const exportProfessorFirstName = (e) => {
        const updatedProfessorDetail = { ...professorDetail, FirstName: e.target.value }
        setProfessorDetails(updatedProfessorDetail)
    }
    const exportProfessorLastName = (e) => {
        const updatedProfessorDetail = { ...professorDetail, LastName: e.target.value }
        setProfessorDetails(updatedProfessorDetail)
    }
    const exportProfessorStartingTerm = (e) => {
        const updatedProfessorDetail = { ...professorDetail, StartingTerm: e.target.value }
        setProfessorDetails(updatedProfessorDetail)
    }
    const exportProfessorStartingYear = (e) => {
        const updatedProfessorDetail = { ...professorDetail, StartingYear: e.target.value }
        setProfessorDetails(updatedProfessorDetail)
    }
    const exportProfessorDetails = () => {
        professorDetailData = professorDetail
        const body = {
            professor: professorDetailData,
            semester: currentSemesterData
        }
        console.log("body", body);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };
        fetch(`${url}/professor`, requestOptions)
            .then(response => response.json())
            .then(data => console.log("inputted new professor"))
    }

    //HANDLE EXPORT STUDENT DETAILS
    const [studentDetails, setStudentDetails] = useState([]);
    const exportAssociatedProfessorName = (e) => {
        const updateStudentDetails = { ...studentDetails, associatedProfessorName: e.target.value }
        setStudentDetails(updateStudentDetails)
    }
    const exportStudentFullName = (e) => {
        const updateStudentDetails = { ...studentDetails, fullName: e.target.value }
        setStudentDetails(updateStudentDetails)
    }
    const exportStudentCourses = (e) => {
        const newArray = e.target.value.split(',').map(str => str.trim());
        const updateStudentDetails = { ...studentDetails, studentCourses: newArray }
        setStudentDetails(updateStudentDetails)
    }
    const exportStudentExclusiveCourses = (e) => {
        const updateStudentDetails = { ...studentDetails, studentExclusiveCourses: e.target.value }
        setStudentDetails(updateStudentDetails)
    }
    const exportStudentTAUnit = (e) => {
        const updateStudentDetails = { ...studentDetails, studentTAUnit: e.target.value }
        setStudentDetails(updateStudentDetails)
    }

    const exportStudentDetails = () => {
        studentDetailData = studentDetails

        const student = {
            professor_name: studentDetailData.associatedProfessorName,
            student_name: studentDetailData.fullName,
            courses: studentDetailData.studentCourses,
            exclusive_course: studentDetailData.studentExclusiveCourses,
            percentage: studentDetailData.studentTAUnit,
            student_id: 0, //Fix student_id part
        }
        console.log(student)

        // Add new student
        const body = {
            student: student,
            semester: currentSemesterData
        }
        console.log("body", body);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };
        fetch(`${url}/student`, requestOptions)
            .then(response => response.json())
            .then(data => console.log("inputted new student"))
    }

    return (
        <>
            <Layout dataform>
                <div className='Data-Form-Div'>
                    <div id="DF-Title">Data Form</div>
                    <div id="DF-Semester-Title">{semesterSelect.term} {semesterSelect.year}</div>
                    <div className='Data-Form-DropDown'>
                        <label id="DF-Select-Semester-Title">Select Semester:</label>

                        <select id="semester-drop-down" onChange={handleSemesterChange}>
                            {semesterData.map((s, i) => (
                                <option key={i} value={s}>{s.term} {s.year}</option>
                            ))}
                        </select>

                        <button onClick={() => setShowModal(true)}>Add Semesters</button>

                        {showModal && (
                            <div className="modal">
                                <div className="modal-content">
                                    <h3>Add Semester</h3>
                                    <input
                                        type="text"
                                        value={term}
                                        onChange={(e) => setTerm(e.target.value)}
                                        placeholder="Enter term"
                                    />
                                    <input
                                        type="number"
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        placeholder="Enter year"
                                    />
                                    <button onClick={handleCreateSemester}>Create Semester</button>
                                    {/* <button onClick={newSemesterFunction}>Check Last Export</button> */}
                                    <button onClick={() => setShowModal(false)}>Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* COURSE DETAILS */}
                    <div className='Data-Form-Course-Details-Div'>
                        <div className="DF-Input-Div">
                            <h1>Course Details</h1>
                            <input onChange={exportCourseNumber} className="DF-CD-Input-Box" type="number" placeholder="Course Number" />
                            <input onChange={exportCourseUnit} className="DF-CD-Input-Box" type="number" placeholder="Course Unit" />
                            <h3 id="DF-Exclusive-Text">Exclusive: </h3>
                            <div className="DF-Exclusive-Container">
                                <label htmlFor="radioYes">
                                    <input
                                        type="radio"
                                        id="radioYes"
                                        name="radioOption"
                                        value="YES"
                                        checked={exclusive === "YES"} // Set the checked attribute based on selectedOption value
                                        onChange={handleOptionChange}
                                    />
                                    YES
                                </label>
                                <label htmlFor="radioNo">
                                    <input
                                        type="radio"
                                        id="radioNo"
                                        name="radioOption"
                                        value="NO"
                                        checked={exclusive === "NO"} // Set the checked attribute based on selectedOption value
                                        onChange={handleOptionChange}
                                    />
                                    NO
                                </label>
                            </div>
                            <button className="DF-CD-Button" onClick={exportCourseDetails}>Submit Course Data</button>
                        </div>

                        {/* PROFESSOR DETAILS */}
                        <div className="DF-Input-Div">
                            <h1>Professor Details</h1>
                            <input onChange={exportProfessorFirstName} className="DF-CD-Input-Box" type="text" placeholder="First Name" />
                            <input onChange={exportProfessorLastName} className="DF-CD-Input-Box" type="text" placeholder="Last Name" />
                            <input onChange={exportProfessorStartingTerm} className="DF-CD-Input-Box" type="text" placeholder="Starting Term" />
                            <input onChange={exportProfessorStartingYear} className="DF-CD-Input-Box" type="number" placeholder="Starting Term Year" />
                            <button onClick={exportProfessorDetails} className="DF-CD-Button">Submit Professor Data</button>
                        </div>

                        {/* STUDENT DETAILS */}
                        <div className="DF-Input-Div">
                            <h1>Student Details</h1>
                            <input className="DF-CD-Input-Box" onChange={exportAssociatedProfessorName} type="text" placeholder="Associated Professor Name" />
                            <input className="DF-CD-Input-Box" onChange={exportStudentFullName} type="text" placeholder="Full Name" />
                            <input className="DF-CD-Input-Box" onChange={exportStudentCourses} type="text" placeholder="Courses" />
                            <input className="DF-CD-Input-Box" onChange={exportStudentExclusiveCourses} type="number" placeholder="Exclusive Course" />
                            <input className="DF-CD-Input-Box" onChange={exportStudentTAUnit} type="number" placeholder="TA Unit" />
                            <button className="DF-CD-Button" onClick={exportStudentDetails}>Submit Student Data</button>
                        </div>
                    </div>
                    <button onClick={newSemesterFunction}>New Semester</button> {/* EXPORT CHECK */}
                    <button onClick={currentSemesterFunction}>Current Semester</button> {/* EXPORT CHECK */}
                </div>
            </Layout>
        </>
    )
}