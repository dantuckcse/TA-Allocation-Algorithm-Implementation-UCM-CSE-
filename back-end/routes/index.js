var express = require('express');
var router = express.Router();
let path = require('path')
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

// Open the database
let db;
let dbFilePath = path.join(__dirname, '/../test.db')
const dbOptions = {
  filename: dbFilePath,
  driver: sqlite3.Database
}
const openDb = async () => {
  // open the database
  try {
    db = await open(dbOptions);
    console.log('opened db')
  }
  catch (err) {
    console.error(err)
  }
}
openDb();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// Find total space for 
router.get('/total_available', async function (req, res, next) {
  // Find the id of the semester that user puts in
  let sql = `
    SELECT pk 
    FROM Semester
    WHERE term = ?
      AND year = ?
  `;
  let args = ['Summer', 2021]
  const semester = await db.get(sql, args);
  const semesterPk = semester.pk;

  // Find all the available classes for that semester
  sql = `
    SELECT course_number, percentage
    FROM Available_Courses
    WHERE semester_fk = ?
  `;
  args = [semesterPk];
  const availableCourses = await db.all(sql, args);

  // Add up the total number of spaces for the available courses
  sql = `
    SELECT SUM(percentage) AS total_space
    FROM Available_Courses
    WHERE semester_fk = ?
  `;
  args = [semesterPk]
  const totalSpace = await db.get(sql, args);
  console.log(totalSpace);

  res.json({ details: availableCourses, total: totalSpace })
});

module.exports = router;
