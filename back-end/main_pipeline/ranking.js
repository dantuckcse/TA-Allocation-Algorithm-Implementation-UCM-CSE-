//Modifies the object formatting for front-end

//Changes numbers from string to int
//If they have the prevent or any category, then don't change
exports.cleanRankings = (rows) => {

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


/////////replace previous function with this one if testing using "node ranking.js"
/*
//Comment out to test with front-end
const queryDatabase = async () => {
    let sql = `SELECT * FROM student_rankings;`;

    const db = await dbPromise;
    const rows = await db.all(sql);
    const cleanRows = cleanRankings(rows);
sdvswvvsdvvssdvsdsvsdv@
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