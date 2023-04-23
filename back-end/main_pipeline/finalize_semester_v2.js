import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import semesterInput from '../test_data/test_year.js';


const dbPromise = open({

    filename: '../database/TA_Allocation.db',
    driver: sqlite3.Database
});


const students_finalized = async (semesterInput) => {

    let sql = `
        UPDATE Assignments
        SET finalized = 'YES'
        WHERE rank IS NULL AND assigned_course IS NULL AND semester_fk IN (SELECT A.semester_fk 
                                                                          FROM Assignments A, Semester S 
                                                                          WHERE A.semester_fk = S.pk AND S.term = ? AND S.year = ?);
    `;

    let args = [semesterInput.term, semesterInput.year];
    const db = await dbPromise;
    await db.run(sql, args);
};


const semester_finalized = async (semesterInput) => {

    let sql = `
        UPDATE Semester 
        SET finalized = 'YES', data_available = 'YES'
        WHERE term = ? AND year = ?
    `;

    let args = [semesterInput.term, semesterInput.year];
    const db = await dbPromise;
    await db.run(sql, args);
};

await students_finalized(semesterInput);
await semester_finalized(semesterInput);
