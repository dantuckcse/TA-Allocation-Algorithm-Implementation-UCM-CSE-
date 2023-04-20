//DOES NOT WORK

import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import semesterInput from "./test_year.js"


const dbPromise = open({
    filename: 'TA_Allocation.db',
    driver: sqlite3.Database,
});


const redoStudentCount = async (semesterInput) => {

    let sql = `
        UPDATE Faculty
        SET students_assigned = students_assigned - 1
        FROM Assignments
        WHERE Faculty.pk = Assignments.faculty_fk AND Assignments.rank = (SELECT MAX(rank) FROM Assignments A, Semester S WHERE A.semester_fk = S.pk AND S.term = ? AND S.year = ?);
    `;

    let args = [semesterInput.term, semesterInput.year];
    const db = await dbPromise;
    await db.run(sql, args);

};


const recalculateScore = async () => {

    let sql = `
        UPDATE Faculty
        SET score = (CASE WHEN students_assigned / total_semesters = 0.0 THEN ROUND(1 / total_semesters, 5) 
                        ELSE ROUND(students_assigned / total_semesters, 5) 
        END);
    `;

    const db = await dbPromise
    await db.run(sql);

};


const removeData = async (semesterInput) => {

    let sql = `
        UPDATE Assignments
        SET finalized = 'NO',
            rank = NULL,
            assigned_course = NULL
        WHERE rank = (SELECT MAX(rank) FROM Assignments A, Semester S WHERE A.semester_fk = S.pk AND S.term = ? AND S.year = ?);
    `;

    let args = [semesterInput.term, semesterInput.year];
    const db = await dbPromise;
    await db.run(sql, args);
};

const isFirst = async (semesterInput) => {

    let sql = `
        SELECT MAX(rank) AS maximum
        FROM Assignments A, Semester S 
        WHERE A.semester_fk = S.pk AND S.term = ? AND S.year = ?
    `

    let args = [semesterInput.term, semesterInput.year];
    const db = await dbPromise;
    const result = await db.get(sql, args);
  
    return result.maximum;
};


const clearTable = async () => {

    let sql = `
    DELETE 
    FROM Student_Rankings;
    `;

    const db = await dbPromise;
    await db.run(sql);
};


const rerank = async (semesterInput) => {

    const zero = await isFirst(semesterInput);
    let sql = ``;

    console.log(zero);

    if (zero == 1 || zero == null) {

        sql = `
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
    }

    else {

        sql = `
            INSERT INTO Student_Rankings (id, rank, professor, student, percentage, courses, finalized)
            SELECT
                A.pk AS id,
                ROW_NUMBER() OVER (ORDER BY F.score ASC, (F.first_name || ' ' || F.last_name)) + R.previous AS rank,
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
                GROUP BY T.SN) T ON A.student_name = T.SN,
                (SELECT
                    Max(A.rank) AS previous
                FROM
                    Assignments A, 
                    Semester S
                WHERE 
                    A.semester_fk = S.pk AND S.term = ? AND year = ?) R
            WHERE A.semester_fk IN (SELECT semester_fk 
                                    FROM Assignments, Semester
                                    WHERE semester_fk = Semester.pk
                                    AND term = ? AND year = ?)
                AND A.finalized = 'NO'
            GROUP BY A.student_name
            ORDER BY F.score ASC, (F.first_name || ' ' || F.last_name) + R.previous;
            `;
    }


    let args = [semesterInput.term, semesterInput.year, semesterInput.term, semesterInput.year];
    const db = await dbPromise
    await db.run(sql, args);

};


await redoStudentCount(semesterInput);
await recalculateScore();
//await removeData(semesterInput);
//await clearTable();
//await rerank(semesterInput);
