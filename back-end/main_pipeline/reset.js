const clearRankings = async (_db) => {

    let sql = `
        DELETE 
        FROM Student_Rankings;
    `;

    await _db.run(sql);
};


const insertRankings = async (_db) => {

    let sql = `
        INSERT INTO Student_Rankings (id, rank, professor, student, percentage, courses, finalized)
        SELECT id, rank, professor, student, percentage, courses, finalized
        FROM Student_Rankings_Copy;
    `;

    await _db.run(sql);
};

const clearFaculty = async (_db) => {

    let sql = `
        DELETE
        FROM Faculty;
    `;

    await _db.run(sql);
};


const insertFaculty = async (_db) => {

    let sql = `
        INSERT INTO Faculty (pk, first_name, last_name, start_semester_fk, students_assigned, total_semesters, score)
        SELECT pk, first_name, last_name, start_semester_fk, students_assigned, total_semesters, score
        FROM Faculty_Copy;
    `;

    await _db.run(sql);

};


const resetAssignments = async (_db, semesterInput) => {

    let sql = `
    UPDATE Assignments
    SET assigned_course = NULL,
        rank = NULL, 
        finalized = 'NO'
    WHERE Assignments.semester_fk IN (SELECT DISTINCT semester_fk 
                                      FROM Assignments A, Semester S 
                                      WHERE A.semester_fk = S.pk AND S.term = ? AND S.year = ?);
    `;

    let args = [semesterInput.term, semesterInput.year];
    await _db.run(sql, args);
};

exports.reset = async (_db, semesterInput) => {
    await clearRankings(_db);
    await insertRankings(_db);
    await clearFaculty(_db);
    await insertFaculty(_db);
    await resetAssignments(_db, semesterInput);
}