exports.getList = async (_db) => {

  let sql = `
        SELECT term, year
        FROM Semester;
    `;

  const rows = await _db.all(sql);
  return rows;
};
