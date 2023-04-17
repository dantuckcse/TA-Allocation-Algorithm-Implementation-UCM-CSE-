import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import semesterInput from './test_year.js';

const app = express();

const dbPromise = open({
  filename: 'TA_Allocation.db',
  driver: sqlite3.Database,
});


const available_condition = async (semesterInput) => {
  const sql = `
    SELECT data_available
    FROM Semester
    WHERE term = ? AND year = ?;
  `;

  const args = [semesterInput.term, semesterInput.year];
  const db = await dbPromise;
  const result = await db.get(sql, args);

  return result.finalized;
};


const finalized_condition = async (semesterInput) => {
  const sql = `
    SELECT finalized
    FROM Semester
    WHERE term = ? AND year = ?;
  `;

  const args = [semesterInput.term, semesterInput.year];
  const db = await dbPromise;
  const result = await db.get(sql, args);

  return result.finalized;
};


const display_allocation = async (semesterInput) => {
  const sql = `
    SELECT
      A.rank AS rank,
      (SELECT DISTINCT(A.student_name)) AS student,
      A.pk AS id,
      (F.first_name || ' ' || F.last_name) AS professor,
      A.assigned_course AS courses
    FROM Faculty F, Assignments A, Semester S
    WHERE A.semester_fk IN (SELECT semester_fk 
                            FROM Assignments, Semester
                            WHERE semester_fk = Semester.pk
                            AND term = ? AND year = ?)
      AND A.faculty_fk = F.pk
    GROUP BY A.student_name
    ORDER BY F.score ASC, professor;
  `;

  const args = [semesterInput.term, semesterInput.year];
  const db = await dbPromise;
  const rows = await db.all(sql, args);

  return rows;
};


app.get('/allocation', async (req, res) => {

  const finalized = await finalized_condition(semesterInput);
  const available = await available_condition(semesterInput);

  if (finalized === 'YES' && available === 'YES') {

    
    const allocation = await display_allocation(semesterInput);
    res.json(allocation);
  } 

  else {

    res.status(400).json({ error: 'Allocation not finalized or not available' });
  }
  
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

