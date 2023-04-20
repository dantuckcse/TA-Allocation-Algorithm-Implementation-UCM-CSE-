const courseRestriction = async (_db, course) => {

    let sql = `
        SELECT exclusive
        FROM Available_Courses
        WHERE course_number = ?
    `;

    let args = [course];
    const result = await _db.get(sql, args);

    return result.exclusive;
};


const addAssignmentData = async (_db, student, semester) => {

    let sql = `
        INSERT INTO Assignments (faculty_fk, semester_fk, percentage, student_name, assigned_course, rank, finalized)
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
            NULL, 
            NULL,
            'NO');
    `;

    let args = [student.professor_name, student.professor_name, student.professor_name, student.professor_name, semester.term, semester.year, student.percentage, student.student_name];
    await _db.run(sql, args);
};


const addRequestedData = async (_db, student, semester) => {

    for (let i = 0; i < student.courses.length; i++) {

        let numStr = student.courses[i].toString();
        let course = student.courses[i];

        const exclusive_access = await courseRestriction(_db, course);
        let course_category = '';

        if (exclusive_access == 'YES') {

            if (course == student.exclusive_course) {

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

        let args = [student.student_name, semester.term, semester.year, numStr, course_category];
        await _db.run(sql, args);

    }

};

exports.addStudent = async (_db, student, semester) => {
    await addAssignmentData(_db, student, semester);
    await addRequestedData(_db, student, semester);
}
