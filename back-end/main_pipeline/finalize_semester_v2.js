
const students_finalized = async (_db, semesterInput) => {

    let sql = `
        UPDATE Assignments
        SET finalized = 'YES'
        WHERE rank IS NULL AND assigned_course IS NULL AND semester_fk IN (SELECT A.semester_fk 
                                                                          FROM Assignments A, Semester S 
                                                                          WHERE A.semester_fk = S.pk AND S.term = ? AND S.year = ?);
    `;

    let args = [semesterInput.term, semesterInput.year];
    await _db.run(sql, args);
};


const semester_finalized = async (_db, semesterInput) => {

    let sql = `
        UPDATE Semester 
        SET finalized = 'YES', data_available = 'YES'
        WHERE term = ? AND year = ?;
    `;

    let args = [semesterInput.term, semesterInput.year];

    await _db.run(sql, args);
};

exports.finalize_semester_v2 = async (_db, semesterInput) => {
    await students_finalized(_db, semesterInput);
    await semester_finalized(_db, semesterInput);

}