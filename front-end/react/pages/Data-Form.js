import { unstable_renderSubtreeIntoContainer } from "react-dom";
import Layout from "./layout/layout.js";
import React, { useState } from "react";

export const newSemesterData = {}
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
                    <div>{semesterSelect.term} {semesterSelect.year}</div>
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