var express = require('express');
var router = express.Router();
let path = require('path')
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

// main_pipeline functions/files imports
let { setup } = require('../main_pipeline/setup');
let { cleanRankings } = require('../main_pipeline/ranking');
let { reranking } = require('../main_pipeline/reranking');
// let { getList } = require('../main_pipeline/semester_list');
let { addCourseData } = require('../input/add_course');
let { addStudent } = require('../input/add_student');
let { addProfessor } = require('../input/new_professor');
let { addSemester } = require('../input/new_semester');
let { finalize_semester, finalized_confirmation } = require('../main_pipeline/finalize_semester');
let { available_condition, finalized_condition, display_allocation } = require('../main_pipeline/display_semester');
let { clear_data } = require('../main_pipeline/clear_data');

// Global variable for current semester
let currentSemesterId = 27;

// Open the database
let db;
let dbFilePath = path.join(__dirname, '/../database/TA_Allocation.db')
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
  const semesterInput = req.body;
  try {
    await setup(db, semesterInput);
    return res.json('setup was run successfully');
  }
  catch (error) {
    console.error(error);
    return res.json('Error: Setup did not run properly');
  }
});

router.put('/reranking', async function (req, res, next) {
  let { assignment, semester } = req.body
  let courseListString = assignment.courses.toString();
  assignment = {
    ...assignment,
    courses: courseListString
  }
  try {
    await reranking(db, assignment, semester);
    return res.json("reranking was run");
  }
  catch (error) {
    console.error(error);
    return res.json("Error: reranking was not run properly");
  }
});

router.get('/allSemesters', async function (req, res, next) {
  let semesters = await getList(db);
  return res.json(semesters);
});

router.post('/course', async function (req, res, next) {
  let course = req.body;
  try {
    await addCourseData(db, course);
    return res.json("Added course");
  }
  catch (error) {
    console.error(error);
    return res.json("Error: Couldn't add course")
  }
});

router.post('/student', async function (req, res, next) {
  let { student, semester } = req.body;

  try {
    await addStudent(db, student, semester);
    return res.json("Added student");
  }
  catch (error) {
    console.error(error)
    return res.json("Error: Couldn't add student")
  }

});

router.post('/professor', async function (req, res, next) {
  const { professor, semester } = req.body;

  try {
    await addProfessor(db, professor, semester);
    return res.json("Added Professor");
  }
  catch (error) {
    console.error(error)
    return res.json("Error: Couldn't Add Professor")
  }
});

router.post('/semester', async function (req, res, next) {
  const semester = req.body;
  try {
    await addSemester(db, semester);
    return res.json('Added Semester');
  }
  catch (error) {
    console.error(error);
    return res.json("Error: Couldn't add semester");
  }
});

router.get('/finalized', async (req, res) => {
  const semester = req.body;

  try {
    await finalize_semester(db, semester); //This used to be middleware, do I keep it like that?
  }
  catch (error) {
    console.error(error);
    return res.json("Error: Couldn't execute finalized route")
  }

  //runs after finalize_semester middleware and returns messages for whatever front-end wants when finalizing TA allocation
  let finalized;
  try {
    finalized = await finalized_confirmation(db, semester);
  }
  catch (error) {
    console.error(error);
    return res.json("Error: Couldn't execute finalized route")
  }

  if (finalized === 'YES') {
    return res.json("Finalization completed");
  }
  else {
    return res.json("Not all students have been finalized");
  }
});

router.get('/allocation', async (req, res) => {
  const semesterInput = req.body;

  let finalized, available;

  try {
    finalized = await finalized_condition(db, semesterInput);
    available = await available_condition(db, semesterInput);
  }
  catch (error) {
    console.error(error);
    return res.json("Error: Couldn't execute allocation route");
  }

  if (finalized === 'YES' && available === 'YES') {
    let allocation;
    try {
      allocation = await display_allocation(db, semesterInput);
      return res.json(allocation);
    }
    catch (error) {
      console.error(error);
      return res.json("Error: Couldn't execute allocation route");
    }
  }
  else {
    res.status(400).json({ error: 'Allocation not finalized or not available' });
  }
});

module.exports = router;
