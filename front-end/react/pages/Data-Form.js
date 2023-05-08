import Layout from "./layout/layout.js";
import React, { useEffect, useState, useRef } from "react";
import newSemesterFunction from "./Exported-DataForm/EDF-NewSemester.js"; {/* CONSOLE LOGGED EXPORT CHECK */ }
import currentSemesterFunction from "./Exported-DataForm/EDF-CurrentSemester.js"; {/* CONSOLE LOGGED EXPORT CHECK */ }
import { url } from "../components/url.js";
import { currentSemesterData } from "./home/index";

//EXPORT DETAILS
export let courseDetailData = []; //exports: course number, course unit, and the selected exclusivity radio options of YES or NO
export let professorDetailData = []; //exports: professor's first name, last name, starting term, starting year
export let studentDetailData = []; //exports: student's fullname, associated professor name, exclusive course assigned, TA Unit, desired courses, and studentID

export default function Data_Form() {

    //Variables instantiated as null for the CLEAR functions. This is NOT the acutal data.
    const clearCourseNumber = useRef(null);
    const clearCourseUnit = useRef(null);

    const clearProfessorFirstName = useRef(null);
    const clearProfessorLastName = useRef(null);
    const clearProfessorStartingTerm = useRef(null);
    const clearProfessorStartingYear = useRef(null);

    const clearAssociatedProfessorName = useRef(null);
    const clearStudentFullName = useRef(null);
    const clearStudentCourse = useRef(null);
    const clearStudentExclusiveCourses = useRef(null);
    const clearStudentTAUnit = useRef(null);
    const clearStudentID = useRef(null);

    //individual notification message
    const [courseDetailNotif, setCourseMessage] = useState('');
    const [professorDetailNotif, setProfessorMessage] = useState('');
    const [studentDetailNotif, setStudentMessage] = useState('');

    //clear functions get called after submitting
    function clearCourseDetails(){
        clearCourseNumber.current.value = '';
        clearCourseUnit.current.value = '';
        setCourseMessage('Course details submitted!');
        setTimeout(() => setCourseMessage(''), 2000);
    }
    function clearProfessorDetails(){
        clearProfessorFirstName.current.value = '';
        clearProfessorLastName.current.value = '';
        clearProfessorStartingTerm.current.value = '';
        clearProfessorStartingYear.current.value =  '';
        setProfessorMessage('Professor details submitted!');
        setTimeout(() => setProfessorMessage(''), 2000);
    }
    function clearStudentDetails(){
        clearAssociatedProfessorName.current.value = '';
        clearStudentFullName.current.value = '';
        clearStudentCourse.current.value = '';
        clearStudentExclusiveCourses.current.value = '';
        clearStudentTAUnit.current.value = '';
        clearStudentID.current.value = '';
        setStudentMessage('Student details submitted!');
        setTimeout(() => setStudentMessage(''), 2000);
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
        const course = {
            number: courseDetailData.courseNumber,
            percentage: courseDetailData.courseUnit,
            exclusive: courseDetailData.exclusive
        };
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(course)
        };
        fetch(`${url}/course`, requestOptions)
            .then(response => response.json())
            .then(data => console.log("inputted new course"))
        console.log("Submitted Course Data: ", courseDetailData)

        // clear function -> clears the input fields
        clearCourseDetails(); 
        setSelectedOption("");
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
            semester: currentSemesterData //error
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
        
        // clear function -> clears the input fields
        clearProfessorDetails();
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
    const exportStudentID = (e) => {
        const updatedStudentDetails = { ...studentDetails, studentID: e.target.value }
        setStudentDetails(updatedStudentDetails)
    }

    const exportStudentDetails = () => {
        studentDetailData = studentDetails

        const student = {
            professor_name: studentDetailData.associatedProfessorName,
            student_name: studentDetailData.fullName,
            courses: studentDetailData.studentCourses,
            exclusive_course: studentDetailData.studentExclusiveCourses,
            percentage: studentDetailData.studentTAUnit,
            student_id: studentDetailData.studentID,
        }
        console.log(student)

        // Add new student
        const body = {
            student: student,
            semester: currentSemesterData //error
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
            

        
        // clear function -> clears the input fields
        clearStudentDetails();
    
    }

    return (
        <>
            <Layout dataform>
                <div className='Data-Form-Div'>
                    <div id="DF-Title">Data Form</div>
                    <div id="DF-Semester-Title">{currentSemesterData.term} {currentSemesterData.year}</div>
                    {/* COURSE DETAILS */}
                    <div className='Data-Form-Course-Details-Div'>
                        <div className="DF-Input-Div">
                            <h1>Course Details</h1>
                            <input onChange={exportCourseNumber} ref={clearCourseNumber} className="DF-CD-Input-Box" type="number" placeholder="Course Number" />
                            <input onChange={exportCourseUnit} ref={clearCourseUnit} className="DF-CD-Input-Box" type="number" placeholder="Course Unit" />
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
                            {/* ON CLICK calls -> exportCourseDetails */}
                            <button className="DF-CD-Button" onClick={exportCourseDetails}>Submit Course Data</button>
                            <div>{courseDetailNotif}</div>
                        </div>

                        {/* PROFESSOR DETAILS */}
                        <div className="DF-Input-Div">
                            <h1>Professor Details</h1>
                            <input ref = {clearProfessorFirstName} onChange={exportProfessorFirstName} className="DF-CD-Input-Box" type="text" placeholder="First Name" />
                            <input ref = {clearProfessorLastName} onChange={exportProfessorLastName} className="DF-CD-Input-Box" type="text" placeholder="Last Name" />
                            <input ref = {clearProfessorStartingTerm} onChange={exportProfessorStartingTerm} className="DF-CD-Input-Box" type="text" placeholder="Starting Term" />
                            <input ref = {clearProfessorStartingYear} onChange={exportProfessorStartingYear} className="DF-CD-Input-Box" type="number" placeholder="Starting Term Year" />
                            {/* ON CLICK calls -> exportProfessorDetails */}
                            <button onClick={exportProfessorDetails} className="DF-CD-Button">Submit Professor Data</button>
                            <div>{professorDetailNotif}</div>
                        </div>

                        {/* STUDENT DETAILS */}
                        <div className="DF-Input-Div">
                        <h1>Student Details</h1>
                        <div className="DF-Input-Div-Student-Fields-Div">
                                <div className= "DF-Input-Student-Fields-1">
                                    <input ref = {clearAssociatedProfessorName} className="DF-CD-Input-Box" onChange={exportAssociatedProfessorName} type="text" placeholder="Associated Professor Name" />
                                    <input ref = {clearStudentFullName} className="DF-CD-Input-Box" onChange={exportStudentFullName} type="text" placeholder="Full Name" />
                                    <input ref = {clearStudentCourse} className="DF-CD-Input-Box" onChange={exportStudentCourses} type="text" placeholder="Courses" />
                                </div>
                                <div className= "DF-Input-Student-Fields-1">
                                    <input ref = {clearStudentExclusiveCourses} className="DF-CD-Input-Box" onChange={exportStudentExclusiveCourses} type="number" placeholder="Exclusive Course" />
                                    <input ref = {clearStudentTAUnit} className="DF-CD-Input-Box" onChange={exportStudentTAUnit} type="number" placeholder="TA Unit" />
                                    <input ref = {clearStudentID} className="DF-CD-Input-Box" onChange={exportStudentID} type="number" placeholder="Student ID" />
                                </div>
                            </div>
                            {/* ON CLICK calls -> exportStudentDetails */}
                            <button className="DF-CD-Button" id = "DF-CD-Button-Student" onClick={exportStudentDetails}>Submit Student Data</button>
                            <div>{studentDetailNotif}</div>
                        </div>
                    </div>
                    {/*<button onClick={newSemesterFunction}>New Semester</button>*/} {/* CONSOLE LOG EXPORT CHECK */}
                    {/*<button onClick={currentSemesterFunction}>Current Semester</button>*/} {/* CONSOLE LOG EXPORT CHECK */}
                </div>
            </Layout>
        </>
    )
}
