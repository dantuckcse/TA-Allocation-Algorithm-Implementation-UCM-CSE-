import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import semesterInput from '../test_data/test_year.js';


const dbPromise = open({

    filename: '../database/TA_Allocation.db',
    driver: sqlite3.Database
});


const clearRankings = async () => {

    let sql = `
        DELETE 
        FROM Student_Rankings;
    `;

    const db = await dbPromise;
    await db.run(sql);
};


const insertRankings = async () => {

    let sql = `
        INSERT INTO Student_Rankings (id, rank, professor, student, percentage, courses, finalized)
        SELECT id, rank, professor, student, percentage, courses, finalized
        FROM Student_Rankings_Copy;
    `;

    const db = await dbPromise;
    await db.run(sql);
};

const clearFaculty = async () => {

    let sql = `
        DELETE
        FROM Faculty;
    `;

    const db = await dbPromise;
    await db.run(sql);
};


const insertFaculty = async () => {

    let sql = `
        INSERT INTO Faculty (pk, first_name, last_name, start_semester_fk, students_assigned, total_semesters, score)
        SELECT pk, first_name, last_name, start_semester_fk, students_assigned, total_semesters, score
        FROM Faculty_Copy;
    `;

    const db = await dbPromise
    await db.run(sql);

};


const resetAssignments = async (semesterInput) => {

    let sql = `
    UPDATE Assignments
    SET assigned_course = NULL,
        rank = NULL, 
        finalized = 'NO'
    WHERE Assignments.semester_fk IN (SELECT DISTINCT semester_fk 
                                      FROM Assignments A, Semester S 
                                      WHERE A.semester_fk = S.pk AND S.term = ? AND S.year = ?);
    `;

    let args = [semesterInput.term, semesterInput.year];
        const db = await dbPromise;
        await db.run(sql, args);
};

await clearRankings();
await insertRankings();
await clearFaculty();
await insertFaculty();
await resetAssignments(semesterInput);
