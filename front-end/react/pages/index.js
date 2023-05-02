import Head from 'next/head'
import Link from "next/link"
import Layout from "./layout/layout.js"
import React, { useEffect, useState } from "react";
import { url } from "../components/url.js";

export let currentSemesterData = [];

export default function Home() {
  const [semesterData, setSemesterData] = useState([]);
  useEffect(() => {
      fetch(`${url}/allSemesters`)
          .then((response) => response.json())
          .then(data => setSemesterData(data));
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

      // Create new semester on backend
      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSemester)
      };
      fetch(`${url}/semester`, requestOptions)
          .then(response => response.json())
          .then(data => console.log(data))
  };

  const [semesterSelect, setSemesterSelect] = useState([])
    const handleSemesterChange = (e) => {
    const index = e.target.selectedIndex;
    const semester = semesterData[index];
    setSemesterSelect(semester)
    currentSemesterData = semester;
  }

  return (
    <Layout home>
      <Head>
        <title>Welcome Page - Sign-In Page</title>
      </Head>
      <div id="DF-Semester-Title">{semesterSelect.term} {semesterSelect.year}</div>
        <div className='Data-Form-DropDown'> 
            <label id="DF-Select-Semester-Title">Select Semester</label>

            <select id="semester-drop-down" onChange={handleSemesterChange}>
                {semesterData.map((s, i) => (
                    <option key={i} value={s}>{s.term} {s.year}</option>
                ))}
            </select>

            <button id = "Add-Semester-Btn" className = "TA-Button" onClick={() => setShowModal(true)}>Add Semesters</button>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3 id="DF-Select-Semester-Title">Add Semester</h3>
                        <input
                            type="text"
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                            placeholder="Enter term"
                            className="DF-CD-Input-Box"
                        />
                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            placeholder="Enter year"
                            className="DF-CD-Input-Box"
                        />
                        <button id = "Add-Semester-Btn" className = "TA-Button" onClick={handleCreateSemester}>Create Semester</button>
                        {/* <button onClick={newSemesterFunction}>Check Last Export</button> */}
                        <button id = "Add-Semester-Btn" className = "TA-Button" onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
      </div>      
    </Layout>
  )
}

/* 
CREDIT: 

Next.js set-up: https://youtube.com/playlist?list=PLynWqC6VC9KOvExUuzhTFsWaxnpP_97BD

React-dnd with Next.js tutorial I followed: https://www.youtube.com/watch?v=NW8erkUgqus
*/