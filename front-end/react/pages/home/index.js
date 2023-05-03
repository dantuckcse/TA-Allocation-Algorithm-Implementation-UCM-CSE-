import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import firebase from '../../utils/firebase';
import Layout from '../layout/layout.js';
import { url } from '../../components/url.js';
import Link from 'next/link';

export let currentSemesterData = [];

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const [semesterData, setSemesterData] = useState([]);
  useEffect(() => {
    fetch(`${url}/allSemesters`)
      .then((response) => response.json())
      .then((data) => setSemesterData(data));
  }, []);
  
  const [term, setTerm] = useState("");
  const [year, setYear] = useState("");
  const [showModal, setShowModal] = useState(false);
  
  const handleCreateSemester = () => {
    const newSemester = {
      term: term,
      year: parseInt(year)
    };
    currentSemesterData = newSemester;
    setSemesterData([...semesterData, newSemester]);
    setTerm("");
    setYear("");
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

  const [semesterSelect, setSemesterSelect] = useState([]);
  const handleSemesterChange = (e) => {
    const index = e.target.selectedIndex;
    const semester = semesterData[index];
    setSemesterSelect(semester);
    currentSemesterData = semester;
  }

  return (
    <Layout user={user}>
      <Head>
        <title>Welcome Page - Sign-In Page</title>
      </Head>
      {user ? (
        <>
          <div id="DF-Semester-Title">{semesterSelect.term} {semesterSelect.year}</div>
          <div className='Data-Form-DropDown'> 
            <label id="DF-Select-Semester-Title">Select Semester</label>
            <select id="semester-drop-down" onChange={handleSemesterChange}>
              {semesterData.map((s, i) => (
                <option key={i} value={s}>{s.term} {s.year}</option>
              ))}
            </select>
            <button id="Add-Semester-Btn" className="TA-Button" onClick={() => setShowModal(true)}>Add Semesters</button>
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
                  <button id="Add-Semester-Btn" className="TA-Button" onClick={handleCreateSemester}>Create Semester</button>
                  <button id="Add-Semester-Btn" className="TA-Button" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div>
          <h1>Please sign in to continue:</h1>
          <Link href="/login">Sign in</Link>
        </div>
      )}
    </Layout>
  );
}
  
  
  

// import Head from 'next/head';
// import { useEffect, useState } from 'react';
// import firebase from '../utils/firebase';
// import Layout from './layout/layout.js';
// import Dashboard from './Dashboard';
// import Link from 'next/link';

// export default function Home() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
//       if (user) {
//         setUser(user);
//       } else {
//         setUser(null);
//       }
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, []);

//   return (
//     <Layout user={user}>
//       <Head>
//         <title>Welcome Page - Sign-In Page</title>
//       </Head>
//       {user ? (
//         <Dashboard />
//       ) : (
//         <div>
//           <h1>Please sign in to continue:</h1>
//           <Link href="/login">Sign in</Link>
//         </div>
//       )}
//     </Layout>
//   );
// }
