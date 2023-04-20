import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

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

export default app;
