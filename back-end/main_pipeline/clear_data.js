//Only ran if you want to clear the necessary tables for the new semester's TA assignment 

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';


const dbPromise = open({

    filename: '../database/TA_Allocation.db',
    driver: sqlite3.Database
});


const clearAvailableCourses = async () => {

    let sql = `
    DELETE 
    FROM Available_Courses;
    `;

    const db = await dbPromise;
    await db.run(sql);
};


const reindexAvailableCourses = async () => {

    let sql = `
    REINDEX Available_Courses;
    `;

    const db = await dbPromise;
    await db.run(sql);
};


const clearRequestedCourses = async () => {

    let sql = `
    DELETE 
    FROM Requested_Courses;
    `;

    const db = await dbPromise;
    await db.run(sql);
};


const reindexRequestedCourses = async () => {

    let sql = `
    REINDEX Requested_Courses;
    `;

    const db = await dbPromise;
    await db.run(sql);
};


const clearStudentRankings = async () => {

    let sql = `
    DELETE 
    FROM Student_Rankings;
    `;

    const db = await dbPromise;
    await db.run(sql);
};

await clearAvailableCourses();
await reindexAvailableCourses();
await clearRequestedCourses();
await reindexRequestedCourses();
await clearStudentRankings();