import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';


const dbPromise = open({

  filename: '../database/TA_Allocation.db',
  driver: sqlite3.Database
});


//Changes numbers from string to int
//If they have the prevent or any category, then don't change
const cleanRankings = (rows) => {

    return rows.map((row) => {
        
      const courses = row.courses.split(',').map((course) => {

        if (course.includes('<span') || course.includes('ANY')) {

          return course;

        } 

        else {

          return parseInt(course);
        }

      });

      return {

        ...row,
        courses

      };
    });
  };


//Comment out to test with front-end
const queryDatabase = async () => {
    let sql = `SELECT * FROM student_rankings;`;
  
    const db = await dbPromise;
    const rows = await db.all(sql);
    const cleanRows = cleanRankings(rows);

    return cleanRows;
  
};

const app = await queryDatabase();
fs.writeFileSync('allocation_list.json', JSON.stringify(app, null, 2));
export default app;


