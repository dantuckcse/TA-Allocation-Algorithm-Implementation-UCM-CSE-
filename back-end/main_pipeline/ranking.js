//Modifies the object formatting for front-end

import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();

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


//get call to send the object to front-end
app.get('/rankings', async (req, res, next) => {

    let sql = `
      SELECT * 
      FROM student_rankings;
    `;
    const db = await dbPromise;
    const rows = await db.all(sql);
    const cleanRows = cleanRankings(rows);
    return res.json(cleanRows);
  });

  export default app;


/////////replace previous function with this one if testing using "node ranking.js"
/*
//Comment out to test with front-end
const queryDatabase = async () => {
    let sql = `SELECT * FROM student_rankings;`;
  
    const db = await dbPromise;
    const rows = await db.all(sql);
    const cleanRows = cleanRankings(rows);
  
    console.log(cleanRows);
};

queryDatabase();
*/


//////////////////////////////////Another Version
/*
import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();

const dbPromise = open({
  filename: 'TA_Allocation.db',
  driver: sqlite3.Database,
});

const cleanRankings = (rows) => {
  return rows.map((row) => {
    const courses = row.courses.split(',').map((course) => {
      if (course.includes('<span')) {
        return course;
      } else {
        return parseInt(course);
      }
    });
    return {
      ...row,
      courses
    };
  });
};

app.get('/rankings', async (req, res, next) => {
  try {
    const sql = `
      SELECT * 
      FROM student_rankings;
    `;
    const db = await dbPromise;
    const rows = await db.all(sql);
    const cleanRows = cleanRankings(rows);
    return res.json(cleanRows);
  } catch (err) {
    next(err);
  }
});

export { app };
*/