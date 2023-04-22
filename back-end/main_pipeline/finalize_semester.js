//This function sets and checks to see if a semester has been finalized

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import semesterInput from '../test_data/test_year.js';


const dbPromise = open({

    filename: '../database/TA_Allocation.db',
    driver: sqlite3.Database
});


//finalizes semester if all studens were finalized
const finalize_semester = async (semesterInput) => {

    let sql = `
        UPDATE Semester 
        SET finalized = (SELECT
            CASE 
                WHEN INSTR(GROUP_CONCAT(T.CN,' ') , 'NO') = 0 THEN 'YES' ELSE 'NO'
                END AS finalized
            FROM
                (SELECT 
                    A.finalized AS CN
                FROM
                    Assignments A
                    INNER JOIN Assignments AA ON A.student_name = AA.student_name
                    INNER JOIN Semester S ON A.semester_fk = S.pk
                WHERE S.term = ? AND S.year = ?) AS T),
            data_available = (SELECT
            CASE 
                WHEN INSTR(GROUP_CONCAT(T.CN,' ') , 'NO') = 0 THEN 'YES' ELSE NULL
                END AS finalized
            FROM
                (SELECT 
                    A.finalized AS CN
                FROM
                    Assignments A
                    INNER JOIN Assignments AA ON A.student_name = AA.student_name
                    INNER JOIN Semester S ON A.semester_fk = S.pk
                WHERE S.term = ? AND S.year = ?) AS T)
        WHERE term = ? AND year = ?;
    `;

    let args = [semesterInput.term, semesterInput.year, semesterInput.term, semesterInput.year, semesterInput.term, semesterInput.year];
    const db = await dbPromise;
    await db.run(sql, args);
};


//checks to see if semester is finalized based on students status
const finalized_confirmation = async (semesterInput) => {

    const sql = `
      SELECT finalized
      FROM Semester
      WHERE term = ? AND year = ?
    `;
  
    const args = [semesterInput.term, semesterInput.year];
    const db = await dbPromise;
    const result = await db.get(sql, args);
  
    return result.finalized;
  };


//middleware that allows the finalize_semester to run first during get request
const finalizedSemesterMiddleware = async (req, res, next) => {

    await finalize_semester(semesterInput);
    next();
};
app.use(finalizedSemesterMiddleware);


//runs after finalize_semester and returns messages for whatever front-end wants when finalizing TA allocation
app.get('/finalized', async (req, res) => {
  
    const finalized = await finalized_confirmation(semesterInput);
  
    if (finalized === 'YES') {
  
      //console.log("Finalization completed");
      res.send("Finalization completed");
    } 
  
    else {
  
      //console.log("Not all students have been finalized");
      res.send("Not all students have been finalized");
    }
    
});