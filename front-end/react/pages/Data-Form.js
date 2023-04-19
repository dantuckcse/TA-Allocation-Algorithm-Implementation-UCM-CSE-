import { unstable_renderSubtreeIntoContainer } from "react-dom";
import Layout from "./layout/layout.js";
import React, { useState } from "react";

export default function Data_Form(){
    const [semesterData, setSemesterData] = useState([
        {
            term: "Summer",
            year: 2020
        },
        {
            term: "Winter",
            year: 2022
        },
        {
            term: "Fall",
            year: 2020
        }
    ]) //imported data inside useState[]
    const [term, setTerm] = useState("");
    const [year, setYear] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [termToDelete, setTermToDelete] = useState("");

    const handleCreateSemester = () => {
        const newSemester = {
            term: term,
            year: parseInt(year)
        };
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
    }

    const handleDeleteSemester = (index) => {
        const updatedSemesterData = semesterData.filter(semester => semester.term != termToDelete);
        setSemesterData(updatedSemesterData);
        setTermToDelete("");
        setShowModal(false);
    }

    return (
        <>
            <Layout dataform>
                <div className='Data-Form-Div'>
                    <div className='Data-Form-DropDown'>
                        <label for = "semester">Select Semester:</label>
                        <select id = "semester-drop-down" onChange={handleSemesterChange}>
                            {semesterData.map((s, i) => ( 
                                <option key={i} value = {s}>{s.term} {s.year}</option>
                            ))}
                        </select>
                        <button onClick={() => setShowModal(true)}>Edit Semesters</button>

                        {showModal && (
                            // Render the modal content
                            <div>
                            <h3>Delete Semester</h3>
                            <select value={termToDelete} onChange={(e) => setTermToDelete(e.target.value)}>
                                <option value="">Select Term to Delete</option>
                                {semesterData.map((semester, index) => (
                                <option key={index} value={semester.term}>{semester.term} {semester.year}</option>
                                ))}
                            </select>
                            <button onClick={handleDeleteSemester}>Delete Semester</button>
                            <button onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        )}

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
                            <button onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                        </div>
                        )}
                    </div>
                    <div className='Data-Form-Course-Details'></div>
                    {/* <div>{semesterSelect.term} {semesterSelect.year}</div> */}
                    {/* 
                    {semesterData.map((semester, index) => (
                        <div key={index}>
                        <h3>{semester.term} {semester.year}</h3>
                        </div>
                    ))} */}


                </div>
            </Layout>
        </>
    )
}