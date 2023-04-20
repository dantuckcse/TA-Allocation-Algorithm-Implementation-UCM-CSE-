const insertData = async (_db, semesters, professor) => {

    let sql = `
        INSERT INTO Faculty (first_name, last_name, start_semester_fk, students_assigned, total_semesters, score)
        VALUES (?, ?, ?, 0, 0, 0.0);
    `;

    let args = [professor.first_name, professor.last_name, semesters.num_semesters];
    await _db.run(sql, args);
};



exports.addProfessor = async (_db, professor, semester) => {

    let sql = `
    SELECT 
        (SELECT semester_order
         FROM Semester
         WHERE term = ? AND year = ?) - 
        (SELECT semester_order
         FROM Semester
         WHERE term = ? AND year = ?) AS num_semesters;
    `;

    let args = [semester.term, semester.year, professor.starting_term, professor.starting_year];
    const semesters = await _db.get(sql, args);

    await insertData(_db, semesters, professor);
};