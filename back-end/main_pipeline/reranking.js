//Recalculates the ranking of the students

//takes data from fron-end and inputs into table for conditions
const update_student = async (_db, assignment) => {

    let sql = `
    UPDATE Assignments
    SET assigned_course = ?,
        rank = ?
    WHERE
        pk = ?;
    `;

    let args = [assignment.courses, assignment.rank, assignment.id];
    await _db.run(sql, args);
};


//recounts total students for professor
//Note could have done it by simply doing students_assigned = students_assigned + 1, but
//this allows counting for previous semesters. Allows for future modification for real data.
const recount = async (_db, semester) => {

    let sql = `
    UPDATE Faculty
    SET students_assigned = students_assigned + (SELECT COUNT(A.student_name)
                                                FROM Assignments A, Semester S
                                                WHERE A.faculty_fk = Faculty.pk 
                                                    AND A.semester_fk = S.pk 
                                                    AND S.term = ?
                                                    AND S.year = ?
                                                    AND A.assigned_course IS NOT NULL
                                                    AND A.finalized = 'NO')
    WHERE Faculty.pk IN (
        SELECT F.pk
        FROM Faculty F, Assignments A, Semester S
        WHERE A.faculty_fk = F.pk 
            AND A.semester_fk = S.pk 
            AND S.term = ?
            AND S.year = ?
            AND A.assigned_course IS NOT NULL
            AND A.finalized = 'NO'
        GROUP BY (F.first_name || ' ' || F.last_name)
    );
    `;

    let args = [semester.term, semester.year, semester.term, semester.year];
    await _db.run(sql, args);
};


//recalcuates score for professor based on assignment
const rescore = async (_db) => {

    let sql = `
        UPDATE Faculty
        SET score = (CASE WHEN students_assigned / total_semesters = 0.0 THEN ROUND(1 / total_semesters, 5) 
                        ELSE ROUND(students_assigned / total_semesters, 5) 
        END);
    `;

    await _db.run(sql);
};


//finalizes the students assignment for to meet conditions for future iterations
const finalize_student = async (_db) => {

    let sql = `
        UPDATE Assignments
        SET finalized = 'YES'
        WHERE finalized = 'NO' AND assigned_course IS NOT NULL;
    `;

    await _db.run(sql);
};


//clears Student_Rankings table for new recalcuated data
const clearTable = async (_db) => {

    let sql = `
    DELETE 
    FROM Student_Rankings;
    `;

    await _db.run(sql);
};


//reranks the students
//slightly different from the version in setup.js
//This one starts from the rank after the assignment students rank
const rerank = async (_db, semester) => {

    let sql = `
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

    let args = [semester.term, semester.year, semester.term, semester.year];
    await _db.run(sql, args);

};


//runs all functions in order
exports.reranking = async (_db, assignment, semester) => {
    await update_student(_db, assignment);
    await recount(_db, semester);
    await rescore(_db,);
    await finalize_student(_db,);
    await clearTable(_db,);
    await rerank(_db, semester);
}
