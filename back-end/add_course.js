import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { addCourse } from "./test_data.js"


const dbPromise = open({
    filename: 'TA_Allocation.db',
    driver: sqlite3.Database
});


const addCourseData = async (addCourse) => {

    let sql = `
        INSERT INTO Available_Courses (course_number, percentage)
        VALUES (?, ?);
    `;

    let args = [addCourse.number, addCourse.percentage];
    const db = await dbPromise;
    await db.run(sql, args);
};

addCourseData(addCourse);
