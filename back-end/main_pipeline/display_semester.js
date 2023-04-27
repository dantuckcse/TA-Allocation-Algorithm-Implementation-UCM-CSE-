exports.available_condition = async (_db, semesterInput) => {
  const sql = `
    SELECT data_available
    FROM Semester
    WHERE term = ? AND year = ?;
  `;

  const args = [semesterInput.term, semesterInput.year];
  const result = await _db.get(sql, args);

  return result.data_available;
};


exports.finalized_condition = async (_db, semesterInput) => {
  const sql = `
    SELECT finalized
    FROM Semester
    WHERE term = ? AND year = ?;
  `;

  const args = [semesterInput.term, semesterInput.year];
  const result = await _db.get(sql, args);

  return result.finalized;
};


exports.display_allocation = async (_db, semesterInput) => {
  const sql = `
    SELECT
      A.rank AS rank,
      A.student_name AS student,
      A.student_id AS id,
      (F.first_name || ' ' || F.last_name) AS professor,
      A.assigned_course AS courses
    FROM Faculty F, Assignments A, Semester S
    WHERE A.semester_fk IN (SELECT DISTINCT semester_fk 
                            FROM Assignments, Semester
                            WHERE semester_fk = Semester.pk
                            AND term = ? AND year = ?)
      AND A.faculty_fk = F.pk
      GROUP BY A.student_name
    ORDER BY A.rank ASC NULLS LAST;
  `;

  const args = [semesterInput.term, semesterInput.year];
  const rows = await _db.all(sql, args);

  return rows;
};