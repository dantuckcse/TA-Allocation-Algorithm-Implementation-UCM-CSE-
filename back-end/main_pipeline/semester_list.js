import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';

const dbPromise = open({
  filename: '../database/TA_Allocation.db',
  driver: sqlite3.Database
});


const getList =  async () => {

    let sql = `
        SELECT term, year
        FROM Semester;
    `;

    const db = await dbPromise;
    const rows = await db.all(sql);
    return rows;
};

const app = await getList();
fs.writeFileSync('semester_list.json', JSON.stringify(app,null,2));
export default app;
