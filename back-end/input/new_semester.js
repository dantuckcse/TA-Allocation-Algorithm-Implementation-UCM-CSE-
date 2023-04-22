import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { newSemester } from '../test_data/test_data.js';


const dbPromise = open({

    filename: '../database/TA_Allocation.db',
    driver: sqlite3.Database
});


const addSemester = async (newSemester) => {

    let sql = `
        INSERT INTO Semester (term, year, finalized, data_available, semester_order)
        VALUES (?, ?, 'NO', NULL, (SELECT COALESCE(MAX(semester_order), 0) + 1 FROM Semester));
    `;

    let args = [newSemester.new_term, newSemester.new_year];
    const db = await dbPromise;
    await db.run(sql, args);
};

addSemester(newSemester);
