exports.addSemester = async (_db, newSemester) => {

    let sql = `
        INSERT INTO Semester (term, year, finalized, data_available, semester_order)
        VALUES (?, ?, 'NO', NULL, (SELECT COALESCE(MAX(semester_order), 0) + 1 FROM Semester));
    `;

    let args = [newSemester.new_term, newSemester.new_year];
    await _db.run(sql, args);
};
