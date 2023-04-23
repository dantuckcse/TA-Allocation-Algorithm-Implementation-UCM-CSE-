//This function sets and checks to see if a semester has been finalized


//finalizes semester if all studens were finalized
exports.finalize_semester = async (_db, semesterInput) => {

    let sql = `
        UPDATE Semester 
        SET finalized = (SELECT
            CASE 
                WHEN INSTR(GROUP_CONCAT(T.CN,' ') , 'NO') = 0 THEN 'YES' ELSE 'NO'
                END AS finalized
            FROM
                (SELECT 
                    A.finalized AS CN
                FROM
                    Assignments A
                    INNER JOIN Assignments AA ON A.student_name = AA.student_name
                    INNER JOIN Semester S ON A.semester_fk = S.pk
                WHERE S.term = ? AND S.year = ?) AS T),
            data_available = (SELECT
            CASE 
                WHEN INSTR(GROUP_CONCAT(T.CN,' ') , 'NO') = 0 THEN 'YES' ELSE NULL
                END AS finalized
            FROM
                (SELECT 
                    A.finalized AS CN
                FROM
                    Assignments A
                    INNER JOIN Assignments AA ON A.student_name = AA.student_name
                    INNER JOIN Semester S ON A.semester_fk = S.pk
                WHERE S.term = ? AND S.year = ?) AS T)
        WHERE term = ? AND year = ?;
    `;

    let args = [semesterInput.term, semesterInput.year, semesterInput.term, semesterInput.year, semesterInput.term, semesterInput.year];
    await _db.run(sql, args);
};


//checks to see if semester is finalized based on students status
exports.finalized_confirmation = async (_db, semesterInput) => {

    const sql = `
      SELECT finalized
      FROM Semester
      WHERE term = ? AND year = ?
    `;

    const args = [semesterInput.term, semesterInput.year];
    const result = await _db.get(sql, args);

    return result.finalized;
};