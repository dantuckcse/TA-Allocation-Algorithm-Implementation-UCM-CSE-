var express = require('express');
var router = express.Router();
let path = require('path')
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

// main_pipeline functions/files imports
let { setup } = require('../main_pipeline/setup');
let { cleanRankings } = require('../main_pipeline/ranking');
let { reranking } = require('../main_pipeline/reranking');
let { getList } = require('../main_pipeline/semester_list');
let { addCourseData } = require('../input/add_course');
let { addStudent } = require('../input/add_student');
let { addProfessor } = require('../input/new_professor');
let { addSemester } = require('../input/new_semester');
let { finalize_semester_v2 } = require('../main_pipeline/finalize_semester_v2');
let { available_condition, finalized_condition, display_allocation } = require('../main_pipeline/display_semester');
let { clear_data } = require('../main_pipeline/clear_data');
let { reset } = require('../main_pipeline/reset');

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


// Function that gets a semester based on term and year
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


// Find all the classes and how much space they have
router.get('/available_courses/', async function (req, res, next) {
  // Find all the available classes
  let sql = `
    SELECT 
      pk as id, 
      course_number AS CSE,
      percentage AS slots
    FROM Available_Courses
  `;

  let availableCourses;
  try {
    availableCourses = await db.all(sql);
    let cleanAvailableCourses = availableCourses.map(course => ({ ...course, CSE: parseInt(course.CSE) }));
    return res.json(cleanAvailableCourses);
  }
  catch (error) {
    console.error(error);
    return res.json("Error executing available_courses route");
  }
});


// Delete a semester: (it takes in the term & year of the semester to delete)
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


// Delete all ranking information
const deleteSemesters = async (_db) => {

  let sql = `DELETE FROM Student_Rankings`
  await _db.run(sql);
};


// A route that runs when the drag & drop page is loaded to calculate the initial ranks of TAs
router.post('/setup', async function (req, res, next) {
  const semesterInput = req.body;
  let response;
  try {
    await deleteSemesters(db)
    await setup(db, semesterInput);
    response = 'setup was run successfully'
  }
  catch (error) {
    console.error(error);
    response = 'Error: Setup did not run properly';
  }
  console.log('setup response: ', response)
  return res.json(response);
});


// A route that runs after a TA is drag & dropped to a specific course. 
// This recalculates the scores for all TAs 
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


// A route that returns a list of all semesters.
// Runs when the user has to choose what semester they want
router.get('/allSemesters', async function (req, res, next) {
  let semesters = await getList(db);
  return res.json(semesters);
});


// Add a new course to the db
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


// Add a new student to the db
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


// Add a new professor to the db
router.post('/professor', async function (req, res, next) {
  const { professor, semester } = req.body;

  try {
    await addProfessor(db, professor);
    return res.json("Added Professor");
  }
  catch (error) {
    console.error(error)
    return res.json("Error: Couldn't Add Professor")
  }
});


// Add a new semester to the db
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


// Finalizes all the TA assignments for a semester
router.put('/finalized', async (req, res) => {
  const semester = req.body;
  try {
    await finalize_semester_v2(db, semester);
    await clear_data(db);
    return res.json('finalize successful');
  }
  catch (error) {
    console.error(error);
    return res.json('error: finalize unsuccessful');
  }

});


// Runs after assignments for a semester are finalized & the user wants to display them
router.put('/allocation', async (req, res) => {
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


// Resets all TA assignments for a given semester
router.put('/reset', async (req, res, next) => {
  const semester = req.body;
  let response;
  try {
    await reset(db, semester);
    response = 'successfully reset';
  }
  catch (error) {
    console.error(error);
    response = 'Error: unable to reset'
  }
  return res.json(response);
})

module.exports = router;
