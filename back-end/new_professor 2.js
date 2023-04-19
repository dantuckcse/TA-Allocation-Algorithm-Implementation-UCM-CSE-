import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import semesterInput from "./test_year.js"
import { newProfessor } from "./test_data.js"


const dbPromise = open({
    filename: 'TA_Allocation.db',
    driver: sqlite3.Database
});


const insertData = async (semesters, newProfessor) => {

    let sql = `
        INSERT INTO Faculty (first_name, last_name, start_semester_fk, students_assigned, total_semesters, score)
        VALUES (?, ?, ?, 0, 0, 0.0);
    `;

    let args = [newProfessor.first_name, newProfessor.last_name, semesters.num_semesters];
    const db = await dbPromise;
    await db.run(sql, args);
};



const addProfessor = async (newProfessor, semesterInput) => {

    let sql = `
    SELECT 
        (SELECT semester_order
         FROM Semester
         WHERE term = ? AND year = ?) - 
        (SELECT semester_order
         FROM Semester
         WHERE term = ? AND year = ?) AS num_semesters;
    `;

    let args = [semesterInput.term, semesterInput.year, newProfessor.starting_term, newProfessor.starting_year];
    const db = await dbPromise;
    const semesters = await db.get(sql, args);
    
    insertData(semesters, newProfessor);
};

addProfessor(newProfessor, semesterInput);
