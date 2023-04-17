import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { addCourse } from '../test_data/test_data.js';


const dbPromise = open({

    filename: '../database/TA_Allocation.db',
    driver: sqlite3.Database
});


const addCourseData = async (addCourse) => {

    let sql = `
        INSERT INTO Available_Courses (course_number, percentage, exclusive)
        VALUES (?, ?, ?);
    `;

    let args = [addCourse.number, addCourse.percentage, addCourse.exclusive];
    const db = await dbPromise;
    await db.run(sql, args);
};


addCourseData(addCourse);
