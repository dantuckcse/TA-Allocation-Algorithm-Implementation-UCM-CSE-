//Calculates the initial ranks of the students

const starting = async (_db, semesterInput) => {

    const clearStudentRanking = async (_db) => {

        let sql = `
            DELETE FROM Student_Rankings;
        `;

        await _db.run(sql);
    };

    //calculates the total semesters a professor has been at UCM
    const totalSemesters = async (_db, semesterInput) => {

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
        await _db.run(sql, args);
    };


    //calculates the score of each professor
    const calcScore = async (_db) => {

        let sql = `
            UPDATE Faculty
            SET score = (CASE WHEN students_assigned / total_semesters = 0.0 THEN ROUND(1 / total_semesters, 5) 
                            ELSE ROUND(students_assigned / total_semesters, 5) 
            END);
        `;

        await _db.run(sql);

    };


    //calculates rank
    const initalRank = async (_db, semesterInput) => {

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

        try {
            await _db.run(sql, args);
        }
        catch (error) {
            if (error.errno === 19 && error.code == 'SQLITE_CONSTRAINT') {
                console.log("User tried to insert duplicates into Student_Rankings (initialRank). Didn't let them");
            }
            else {
                console.error(error);
            }
        }

    };


    const clearCopyRank = async (_db) => {

        let sql = `
            DELETE 
            FROM Student_Rankings_Copy;
        `;

        await _db.run(sql);

    };


    const clearCopyFaculty = async (_db) => {

        let sql = `
            DELETE 
            FROM Faculty_Copy;
        `;

        await _db.run(sql);

    };


    const copyRank = async (_db, semesterInput) => {

        let sql = `
        INSERT INTO Student_Rankings_Copy (id, rank, professor, student, percentage, courses, finalized)
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

        try {
            await _db.run(sql, args);
        }
        catch (error) {
            if (error.errno === 19 && error.code == 'SQLITE_CONSTRAINT') {
                console.log("User tried to insert duplicates into Student_Rankings_Copy. Didn't let them");
            }
            else {
                console.error(error);
            }
        }

    };


    const copyFaculty = async (_db) => {

        let sql = `
            INSERT INTO Faculty_Copy (pk, first_name, last_name, start_semester_fk, students_assigned, total_semester, score)
            SELECT pk, first_name, last_name, start_semester_fk, students_assigned, total_semesters, score
            FROM Faculty;
        `;

        try {
            await _db.run(sql);
        }
        catch (error) {
            if (error.errno === 19 && error.code == 'SQLITE_CONSTRAINT') {
                console.log("User tried to insert duplicates into Faculty_Copy. Didn't let them");
            }
            else {
                console.error(error);
            }
        }

    };


    //runs all functions in order
    await clearStudentRanking(_db);
    await totalSemesters(_db, semesterInput);
    await calcScore(_db);
    await initalRank(_db, semesterInput);
    await clearCopyRank(_db);
    await clearCopyFaculty(_db);
    await copyRank(_db, semesterInput);
    await copyFaculty(_db);
};


const clearTable = async (_db) => {


    let sql = `
    DELETE 
    FROM Student_Rankings;
    `;

    await _db.run(sql)
};


const continuing = async (_db, semesterInput) => {

    await clearTable(_db);

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

    let args = [semesterInput.term, semesterInput.year, semesterInput.term, semesterInput.year];

    try {
        await _db.run(sql, args)
    }
    catch (error) {
        if (error.errno === 19 && error.code == 'SQLITE_CONSTRAINT') {
            console.log("User tried to insert duplicates into Student_Rankings (continuing). Didn't let them");
        }
        else {
            console.error(error);
        }
    }
};


const save_condition = async (_db, semesterInput) => {

    let sql = `
            SELECT MAX(rank) AS max 
            FROM Assignments A, Semester S
            WHERE A.semester_fk = S.pk AND S.term = ? AND year = ?;
        `;

    let args = [semesterInput.term, semesterInput.year];
    const maximum = await _db.get(sql, args);

    return maximum.max;
};


exports.setup = async (_db, semesterInput) => {

    const condition = await save_condition(_db, semesterInput);

    if (condition == null) {

        await starting(_db, semesterInput);
    }

    else {

        await continuing(_db, semesterInput);
    }
};
