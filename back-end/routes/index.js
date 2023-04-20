var express = require('express');
var router = express.Router();
let path = require('path')
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

// main_pipeline functions/files imports
let { setup } = require('../main_pipeline/setup');
let { cleanRankings } = require('../main_pipeline/ranking');
let { reranking } = require('../main_pipeline/reranking');

// Global variable for current semester
let currentSemesterId = 27;

// Open the database
let db;
let dbFilePath = path.join(__dirname, '/../database/TA_Allocation.db')
console.log(dbFilePath)
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

const getCurrentSemester = async () => {
  let sql = `
    SELECT *
    FROM Semester
    WHERE pk = ?
  `;
  let args = [currentSemesterId]
  const semester = await db.get(sql, args);
  return semester;
}

const getSemester = async (term, year) => {
  let sql = `
    SELECT *
    FROM Semester
    WHERE term = ?
      AND year = ?
  `;
  args = [term, year];
  const semester = await db.get(sql, args);
  return semester;
}

const generateSemesterId = async () => {
  let sql = `
    SELECT MAX(pk) + 1 AS newId
    FROM Semester;
  `;
  const { newId } = await db.get(sql);
  return newId;
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// Get current Semester
router.get('/current_semester', async function (req, res, next) {
  const semester = await getCurrentSemester()
  return res.json(semester)
});

// Update the current semester in the app
// ie somebody clicks Summer 2021, it should 
// update the currentSemesterId to Summer 2021
router.put('/current_semester/:term/:year', async function (req, res, next) {
  const { term, year } = req.params;
  let sql = `
    SELECT *
    FROM Semester
    WHERE term = ?
      AND year = ? 
  `;
  let args = [term, year];
  const semester = await db.get(sql, args);
  currentSemesterId = semester.pk;
  return res.json({ currentSemesterId, msg: "success" })
});

// Given the current semester, find the amount of space each class has. 
// Also find the total space in all classes
router.get('/total_available/', async function (req, res, next) {
  // Find all the available classes for that semester
  sql = `
    SELECT course_number, percentage
    FROM Available_Courses
    WHERE semester_fk = ?
  `;
  args = [currentSemesterId];
  const availableCourses = await db.all(sql, args);

  // Add up the total number of spaces for the available courses
  sql = `
    SELECT SUM(percentage) AS total_space
    FROM Available_Courses
    WHERE semester_fk = ?
  `;
  args = [currentSemesterId]
  const totalSpace = await db.get(sql, args);

  return res.json({ details: availableCourses, total: totalSpace })
});

// Takes in a new semester as input and creates it in the database
// The input is a json object w/ the following format and is contained in req.body: 
// { term: "fall", year: "2023"}
router.post('/semester', async function (req, res, next) {
  const { term, year } = req.body

  // Check if the semester they put in already exists:
  const semester = await getSemester(term, year);

  let body;

  // If the inputted semester doesn't exist, create it
  if (semester == undefined) {
    let id = await generateSemesterId();
    sql = `
      INSERT INTO Semester (pk, term, year)
      VALUES (?, ?, ?)
    `;
    args = [id, term, year]
    await db.run(sql, args)
    body = { msg: "Created a new semester" }
  }
  // If the inputted semester does exist, send a message saying it does and don't alter the db
  else {
    body = { msg: "Semester already exists" }
  }

  return res.json(body)
});

// Delete a semester (the semester to delete is in the body)
router.delete('/semester', async function (req, res, next) {
  const { term, year } = req.body;

  // Check if semester exists
  const semester = await getSemester(term, year);

  let body = {}
  if (semester == undefined) {
    body = { msg: "Can't delete semester because it doesn't exist" }
  }
  else {
    let sql = `
      DELETE FROM Semester
      WHERE term = ?
        AND year = ?;
    `;
    let args = [term, year];
    await db.run(sql, args)
    body = { msg: `Deleted ${term} ${year} semester` };
  }
  return res.json(body)
});

// Returns the rankings of all the requests
router.get('/rankings', async function (req, res, next) {
  let sql = `
      SELECT * 
      FROM student_rankings;
    `;
  const rows = await db.all(sql);
  const cleanRows = cleanRankings(rows);
  return res.json(cleanRows);
});

// ---------------
// New routes are below, all the routes above might get deleted
// ---------------

router.post('/setup', async function (req, res, next) {
  const semesterInput = req.body
  await setup(db, semesterInput);
  return res.redirect('/rankings')
});

router.put('/reranking', async function (req, res, next) {
  const { assignment, semester } = req.body
  await reranking(db, assignment, semester);
  return res.redirect('/rankings');
});

module.exports = router;
