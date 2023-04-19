import { unstable_renderSubtreeIntoContainer } from "react-dom";
import Layout from "./layout/layout.js";
import React, { useState } from "react";
// import app from './path/to/module.js';
import newSemesterFunction from "./Export-Data-Form.js"; {/* EXPORT CHECK */}

export let currentSemesterData = [];
export let newSemesterData = [];
export let courseDetail = [];
export default function Data_Form(){
    const [semesterData, setSemesterData] = useState([
        {
            term: "Summer",
            year: 2020
        },
        {
            term: "Spring",
            year: 2022
        },
        {
            term: "Fall",
            year: 2020
        }
    ]) //imported data inside useState[]
    // const [senesterData, setSemesterData] = useState([
    //     app.then((result) => {
    //     })
    // ])
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

    //Course Details - Exclusive for options either YES or NO
    const [selectedOption, setSelectedOption] = useState("");
    const handleOptionChange = (e) => {
        const selectedValue = e.target.value
        setSelectedOption(selectedValue); // Update the selected option in state
        console.log(`Selected option: ${selectedValue}`);
    };

    //Handle Export Course Details
    const [courseDetails, setCourseDetails] = useState("");
    const exportCourseDetails = (e) => {
    };

    return (
        <>
            <Layout dataform>
                <div className='Data-Form-Div'>
                    <div id="DF-Title">Data Form</div>
                    <div id= "DF-Semester-Title">{semesterSelect.term} {semesterSelect.year}</div>
                    <div className='Data-Form-DropDown'>
                        <label id = "DF-Select-Semester-Title">Select Semester:</label>
                        <select id = "semester-drop-down" onChange={handleSemesterChange}>
                            {semesterData.map((s, i) => ( 
                                <option key={i} value = {s}>{s.term} {s.year}</option>
                            ))}
                        </select>
                        <button onClick = {newSemesterFunction}>Export Check</button> {/* EXPORT CHECK */}
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
                            <input className = "DF-CD-Input-Box" type="number" placeholder="Course Number"/>
                            <input className = "DF-CD-Input-Box" type="number" placeholder="Course Unit"/>
                            <h3 id="DF-Exclusive-Text">Exclusive: </h3>
                            <div className="DF-Exclusive-Container">
                                <label htmlFor="radioYes">
                                    <input
                                    type="radio"
                                    id="radioYes"
                                    name="radioOption"
                                    value="YES"
                                    checked={selectedOption === "YES"} // Set the checked attribute based on selectedOption value
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
                                    checked={selectedOption === "NO"} // Set the checked attribute based on selectedOption value
                                    onChange={handleOptionChange}
                                    />
                                    NO
                                </label>
                                </div>

                            <button className = "DF-CD-Button">Submit Course Data</button>
                        </div>
                        
                        {/* PROFESSOR DETAILS */}
                        <div className="DF-Input-Div">
                            <h1>Professor Details</h1> 
                            <input className = "DF-CD-Input-Box" type="text" placeholder="First Name"/>
                            <input className = "DF-CD-Input-Box" type="text" placeholder="Last Name"/>
                            <input className = "DF-CD-Input-Box" type="text" placeholder="Starting Term"/>
                            <input className = "DF-CD-Input-Box" type="number" placeholder="Starting Term Year"/>
                            <button className = "DF-CD-Button">Submit Professor Data</button>
                        </div>

                        {/* STUDENT DETAILS */}
                        <div className="DF-Input-Div">
                            <h1>Student Details</h1>
                            <input className = "DF-CD-Input-Box" type="text" placeholder="Associated Professor Name"/>
                            <input className = "DF-CD-Input-Box" type="text" placeholder="Full Name"/>
                            <input className = "DF-CD-Input-Box" type="text" placeholder="Courses"/>
                            <input className = "DF-CD-Input-Box" type="text" placeholder="Exclusive Courses"/>
                            <input className = "DF-CD-Input-Box" type="number" placeholder="TA Unit"/>
                            <button className = "DF-CD-Button">Submit Student Data</button>
                        </div>
                    </div>

                </div>
            </Layout>
        </>
    )
}


//Select Semester (Have to create them to select them): Current Semester
//Issue: page cannot save, on refresh, all the data will be lost.

{/* 
{semesterData.map((semester, index) => (
    <div key={index}>
    <h3>{semester.term} {semester.year}</h3>
    </div>
))} */}


// //Only for the current semester
// //NOTE!!: exclusive_courses is the course that the professor guarantees for the student. Using
// //this object as an example, Professor Wan Du is teaching CSE 185 and wants to reserve TA spots 
// //for his graduate students, such Bobby Hill. So the exclusive course is 185. 
// //Otherwise make it empty, exclusive_courses: []
// const addStudent = {
//     professor_name: "Wan Du",
//     student_name: "Bobby Hill",
//     courses: [5,15,20,30,31,100,165,185],
//     exclusive_courses: [185],
//     percentage: 0.5
// };
