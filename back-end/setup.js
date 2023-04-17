//Calculates the initial ranks of the students


import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import semesterInput from "./test_year.js"

const dbPromise = open({
    filename: 'TA_Allocation.db',
    driver: sqlite3.Database,
});


//calculates the total semesters a professor has been at UCM
const totalSemesters = async (semesterInput) => {

    let sql = `
    UPDATE Faculty
    SET total_semesters = (CASE 
        WHEN ((SELECT ((SELECT S.semester_order 
                        FROM Semester S 
                        WHERE S.term = ? AND S.year = ?) - SS.semester_order) * 1.0 
            FROM Semester SS
            WHERE SS.pk = Faculty.start_semester_fk) = 0) 
        THEN 1.0 
        ELSE (SELECT ((SELECT S.semester_order 
                        FROM Semester S 
                        WHERE S.term = ? AND S.year = ?) - SS.semester_order) * 1.0 
            FROM Semester SS
            WHERE SS.pk = Faculty.start_semester_fk) 
        END)
    WHERE EXISTS (
        SELECT 1
        FROM Semester S
        WHERE S.term = ? AND S.year = ? AND S.semester_order > (
            SELECT SS.semester_order
            FROM Semester SS
            WHERE SS.pk = Faculty.start_semester_fk
        )
    );
    `;

    let args = [semesterInput.term, semesterInput.year, semesterInput.term, semesterInput.year, semesterInput.term, semesterInput.year];
    const db = await dbPromise;
    await db.run(sql, args);
};


//calculates the score of each professor
const calcScore = async () => {

    let sql = `
        UPDATE Faculty
        SET score = (CASE WHEN students_assigned / total_semesters = 0.0 THEN ROUND(1 / total_semesters, 5) 
                        ELSE ROUND(students_assigned / total_semesters, 5) 
        END);
    `;

    const db = await dbPromise;
    await db.run(sql);

};


//calculates rank
const initalRank = async (semesterInput) => {

    let sql = `
    INSERT INTO Student_Rankings (id, rank, professor, student, percentage, courses, finalized)
    SELECT
        A.pk AS id,
        ROW_NUMBER() OVER (ORDER BY F.score ASC, (F.first_name || ' ' || F.last_name)) AS rank,
        (F.first_name || ' ' || F.last_name) AS professor,
        (SELECT DISTINCT(A.student_name)) AS student,
        A.percentage AS percentage,
        T.course_list AS courses,
        A.finalized as finalized
    FROM
        Faculty F
        INNER JOIN Assignments A ON A.faculty_fk = F.pk
        INNER JOIN
        (SELECT
            T.SN, 
            GROUP_CONCAT(CASE WHEN T.cat = 'prevent' THEN '<span class="prevent">' || T.CN || '</span>' 
                            WHEN T.cat = 'ensure' THEN '<span class="ensure">' || T.CN || '</span>' 
                            ELSE T.CN END, ',') as course_list
        FROM
            (SELECT DISTINCT
                A.student_name AS SN, RC.course_number AS CN, RC.category AS cat
            FROM
                Requested_Courses RC
                INNER JOIN Requested_Courses CR ON RC.pk = CR.pk
                INNER JOIN Assignments A ON RC.assignment_fk = A.pk
            ORDER BY cast(RC.course_number AS INTEGER) ASC) AS T
        GROUP BY T.SN) T ON A.student_name = T.SN
    WHERE A.semester_fk IN (SELECT semester_fk 
                            FROM Assignments, Semester
                            WHERE semester_fk = Semester.pk
                            AND term = ? AND year = ?)
        AND A.finalized = 'NO'
    GROUP BY A.student_name
    ORDER BY F.score ASC, (F.first_name || ' ' || F.last_name);
    `;

    let args = [semesterInput.term, semesterInput.year];
    const db = await dbPromise
    await db.run(sql, args);

};

//runs all functions in order
await totalSemesters(semesterInput);
await calcScore();
await initalRank(semesterInput);
