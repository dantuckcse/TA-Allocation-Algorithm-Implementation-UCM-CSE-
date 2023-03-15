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

// Given a semester, find the amount of space each class has. 
// Also find the total space in all classes
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

  return res.json({ details: availableCourses, total: totalSpace })
});

// Takes in a new semester as input and creates it in the database
// The input is a json object w/ the following format and is contained in req.body: 
// { term: "fall", year: "2023"}
router.post('/semester', async function (req, res, next) {
  const { term, year } = req.body

  // Check if the semester they put in already exists:
  let sql = `
    SELECT *
    FROM Semester
    WHERE term = ?
      AND year = ?
  `;
  args = [term, year]
  const semester = await db.get(sql, args)

  let body;

  // If the inputted semester doesn't exist, create it
  if (semester == undefined) {
    sql = `
      INSERT INTO Semester (term, year)
      VALUES (?, ?)
    `;
    args = [term, year]
    await db.run(sql, args)
    body = { msg: "Created a new semester" }
  }
  // If the inputted semester does exist, send a message saying it does and don't alter the db
  else {
    body = { msg: "Semester already exists" }
  }

  return res.json(body)
});

module.exports = router;
