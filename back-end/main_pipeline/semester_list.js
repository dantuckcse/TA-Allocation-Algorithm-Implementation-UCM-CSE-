let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

const getList = async (_db) => {

  let sql = `
        SELECT term, year
        FROM Semester;
    `;

  const rows = await _db.all(sql);
  return rows;
};

exports.app = getList;