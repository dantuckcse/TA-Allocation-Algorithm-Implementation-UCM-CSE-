const insertData = async (_db, semesters, professor) => {

    let sql = `
        INSERT INTO Faculty (first_name, last_name, start_semester_fk, students_assigned, total_semesters, score)
        VALUES (?, ?, ?, 0, 0, 0.0);
    `;

    let args = [professor.FirstName, professor.LastName, semesters.num_semesters];
    await _db.run(sql, args);
};



exports.addProfessor = async (_db, professor) => {

    let sql = `
        SELECT pk as num_semesters
        FROM Semester
        WHERE term = ? AND year = ?;
    `;

    let args = [professor.StartingTerm, professor.StartingYear];
    const semesters = await _db.get(sql, args);

    await insertData(_db, semesters, professor);
};