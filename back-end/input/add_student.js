import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { addStudent } from '../test_data/test_data.js';
import semesterInput from '../test_data/test_year.js';


const dbPromise = open({

    filename: '../database/TA_Allocation.db',
    driver: sqlite3.Database
});


const courseRestriction = async (course) => {

    let sql = `
        SELECT exclusive
        FROM Available_Courses
        WHERE course_number = ?
    `;

    let args = [course];
    const db = await dbPromise;
    const result = await db.get(sql, args);
  
    return result.exclusive;
};


const addAssignmentData = async (addStudent, semesterInput) => {

    let sql = `
        INSERT INTO Assignments (faculty_fk, semester_fk, percentage, student_name, student_id, assigned_course, rank, finalized)
        VALUES ( 
            (SELECT pk 
             FROM Faculty 
             WHERE first_name = substr(?, 1, instr(?, ' ') - 1) 
                   AND last_name = substr(?, instr(?, ' ') + 1)),
            (SELECT pk 
             FROM Semester 
             WHERE term = ? AND year = ?), 
            ?, 
            ?, 
            ?,
            NULL, 
            NULL,
            'NO');
    `;

    let args = [addStudent.professor_name, addStudent.professor_name, addStudent.professor_name, addStudent.professor_name, semesterInput.term, semesterInput.year, addStudent.percentage, addStudent.student_name, addStudent.student_id];
    const db = await dbPromise;
    await db.run(sql, args);
};


const addRequestedData = async (addStudent, semesterInput) => {

    for (let i = 0; i < addStudent.courses.length; i++) {

        let numStr = addStudent.courses[i].toString();
        let course = addStudent.courses[i];

        const exclusive_access = await courseRestriction(course);
        let course_category = '';

        if (exclusive_access == 'YES') {
        
            if (course == addStudent.exclusive_course) {

                course_category = 'ensure';
            }

            else {

                course_category = 'prevent';
            }
        }

        else {

            course_category = 'neutral';
        }

        let sql = `
            INSERT INTO Requested_Courses (assignment_fk, course_number, category)
            VALUES (
                (SELECT A.pk 
                FROM Assignments A, Semester S
                WHERE A.semester_fk = S.pk 
                        AND A.student_name = ? 
                        AND S.term = ? 
                        AND S.year = ?),
                ?,
                ?);
        `;

        let args = [addStudent.student_name, semesterInput.term, semesterInput.year, numStr, course_category];
        const db = await dbPromise;
        await db.run(sql, args);
        
    }

};


await addAssignmentData(addStudent, semesterInput);
await addRequestedData(addStudent, semesterInput);
