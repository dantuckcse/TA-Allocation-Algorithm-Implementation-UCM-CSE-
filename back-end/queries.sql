-- ALL queries that are used
-- Also has alot of testing queries
-- Very disorganized
--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------

-- Gets the total semesters INITIAL
UPDATE Faculty
SET total_semesters = (CASE 
    WHEN ((SELECT ((SELECT S.semester_order 
                    FROM Semester S 
                    WHERE S.term = 'Summer' AND S.year = 2021) - SS.semester_order) * 1.0 
           FROM Semester SS
           WHERE SS.pk = Faculty.start_semester_fk) = 0) 
    THEN 1.0 
    ELSE (SELECT ((SELECT S.semester_order 
                    FROM Semester S 
                    WHERE S.term = 'Summer' AND S.year = 2021) - SS.semester_order) * 1.0 
          FROM Semester SS
          WHERE SS.pk = Faculty.start_semester_fk) 
    END)
WHERE EXISTS (
    SELECT 1
    FROM Semester S
    WHERE S.term = 'Summer' AND S.year = 2021 AND S.semester_order > (
        SELECT SS.semester_order
        FROM Semester SS
        WHERE SS.pk = Faculty.start_semester_fk
    )
);



--USE THIS TO CALCULATE THE INITIAL TOTAL NUMBER OF STUDENTS A PROFESSOR HAS ASSIGNED IN ASS PASSED SEMESTER
--TEMP values should be the current term you are going to start assigning position for and NOT Null for terms after the current term
UPDATE Faculty
SET students_assigned = students_assigned + (SELECT COUNT(A.student_name)
                                             FROM Assignments A, Semester S
                                             WHERE A.faculty_fk = Faculty.pk 
                                                AND A.semester_fk = S.pk 
                                                AND S.term != 'Summer' --Temporary values
                                                AND S.year != 2021 --Temporary values
                                                AND S.finalized != 'NO')
WHERE Faculty.pk IN (
    SELECT F.pk
    FROM Faculty F, Assignments A, Semester S
    WHERE A.faculty_fk = F.pk 
        AND A.semester_fk = S.pk 
        AND S.term != 'Summer' --Temporary values
        AND S.year != 2021 --Temporary values
        AND S.finalized != 'NO'
    GROUP BY (F.first_name || ' ' || F.last_name)
);



-- calculates score for ranking LOOP AND INITIAL
UPDATE Faculty
SET score = (CASE WHEN students_assigned / total_semesters = 0.0 THEN ROUND(1 / total_semesters, 5) 
            ELSE ROUND(students_assigned / total_semesters, 5) 
            END);


--QUERY TO GET ALL REQUIRED DATA and store into student_rankings table
-- Main WHERE clause has a temp term and year for inputs
--V1
INSERT INTO Student_Rankings (id, rank, professor, student, percentage, courses, finalized)
SELECT
    ROW_NUMBER() OVER(ORDER BY A.student_name) - 1 AS id,
    ROW_NUMBER() OVER (ORDER BY F.score ASC, (F.first_name || ' ' || F.last_name)) AS rank,
    (F.first_name || ' ' || F.last_name) AS professor,
    (SELECT DISTINCT(A.student_name)) AS student,
    A.percentage AS percentage,
    "No" AS finalized
FROM
    Faculty F,
    Assignments A
    
WHERE A.semester_fk IN (SELECT semester_fk 
                        FROM Assignments, Semester
                        WHERE semester_fk = Semester.pk
                        AND term = 'Summer' AND year = 2021) --Temporary values
    AND A.faculty_fk = F.pk
GROUP BY A.student_name
ORDER BY F.score ASC, (F.first_name || ' ' || F.last_name);


--V2
INSERT INTO Student_Rankings (id, rank, professor, student, percentage, courses, finalized)
SELECT
    A.pk AS id,
    ROW_NUMBER() OVER (ORDER BY F.score ASC, (F.first_name || ' ' || F.last_name)) AS rank,
    (F.first_name || ' ' || F.last_name) AS professor,
    (SELECT DISTINCT(A.student_name)) AS student,
    A.percentage AS percentage,
    T.course_list AS courses,
    "No" AS finalized
FROM
    Faculty F
    INNER JOIN Assignments A ON A.faculty_fk = F.pk
    INNER JOIN
    (SELECT
        T.SN, 
        CASE 
            WHEN GROUP_CONCAT(T.CN,',') LIKE '%ANY%' THEN 'ANY' ELSE GROUP_CONCAT(T.CN,',')
        END AS course_list
    FROM
        (SELECT DISTINCT
            A.student_name AS SN, RC.course_number AS CN
        FROM
            Requested_Courses RC
            INNER JOIN Requested_Courses CR ON RC.pk = CR.pk
            INNER JOIN Assignments A ON RC.assignment_fk = A.pk
        ORDER BY cast(RC.course_number AS INTEGER) ASC) AS T
    GROUP BY T.SN) T ON A.student_name = T.SN
WHERE A.semester_fk IN (SELECT semester_fk 
                        FROM Assignments, Semester
                        WHERE semester_fk = Semester.pk
                        AND term = 'Summer' AND year = 2021) --Temporary values
GROUP BY A.student_name
ORDER BY F.score ASC, (F.first_name || ' ' || F.last_name);


--V3
INSERT INTO Student_Rankings (id, rank, professor, student, percentage, courses, finalized)
SELECT
    A.pk AS id,
    ROW_NUMBER() OVER (ORDER BY F.score ASC, (F.first_name || ' ' || F.last_name)) AS rank,
    (F.first_name || ' ' || F.last_name) AS professor,
    (SELECT DISTINCT(A.student_name)) AS student,
    A.percentage AS percentage,
    T.course_list AS courses,
    A.finalized as finalized
FROM
    Faculty F
    INNER JOIN Assignments A ON A.faculty_fk = F.pk
    INNER JOIN
    (SELECT
        T.SN, 
        CASE 
            WHEN GROUP_CONCAT(T.CN,',') LIKE '%ANY%' THEN 'ANY'
            ELSE GROUP_CONCAT(CASE WHEN T.cat = 'prevent' THEN '<span class="prevent">' || T.CN || '</span>' ELSE T.CN END, ',')
        END AS course_list
    FROM
        (SELECT DISTINCT
            A.student_name AS SN, RC.course_number AS CN, RC.category AS cat
        FROM
            Requested_Courses RC
            INNER JOIN Requested_Courses CR ON RC.pk = CR.pk
            INNER JOIN Assignments A ON RC.assignment_fk = A.pk
        ORDER BY cast(RC.course_number AS INTEGER) ASC) AS T
    GROUP BY T.SN) T ON A.student_name = T.SN
WHERE A.semester_fk IN (SELECT semester_fk 
                        FROM Assignments, Semester
                        WHERE semester_fk = Semester.pk
                        AND term = 'Summer' AND year = 2021) --Temporary values
    AND A.finalized = 'NO'
GROUP BY A.student_name --Temporary just for testing
ORDER BY F.score ASC, (F.first_name || ' ' || F.last_name);


--V4
SELECT
        A.pk AS id,
        ROW_NUMBER() OVER (ORDER BY F.score ASC, (F.first_name || ' ' || F.last_name)) AS rank,
        (F.first_name || ' ' || F.last_name) AS professor,
        (SELECT DISTINCT(A.student_name)) AS student,
        A.percentage AS percentage,
        T.course_list AS courses,
        A.finalized as finalized
    FROM
        Faculty F
        INNER JOIN Assignments A ON A.faculty_fk = F.pk
        INNER JOIN
        (SELECT
            T.SN, 
            GROUP_CONCAT(CASE WHEN T.cat = 'prevent' THEN '<span class="prevent">' || T.CN || '</span>' 
                            WHEN T.cat = 'ensure' THEN '<span class="ensure">' || T.CN || '</span>' 
                            ELSE T.CN END, ',') as course_list
        FROM
            (SELECT DISTINCT
                A.student_name AS SN, RC.course_number AS CN, RC.category AS cat
            FROM
                Requested_Courses RC
                INNER JOIN Requested_Courses CR ON RC.pk = CR.pk
                INNER JOIN Assignments A ON RC.assignment_fk = A.pk
            ORDER BY cast(RC.course_number AS INTEGER) ASC) AS T
        GROUP BY T.SN) T ON A.student_name = T.SN
    WHERE A.semester_fk IN (SELECT semester_fk 
                            FROM Assignments, Semester
                            WHERE semester_fk = Semester.pk
                            AND term = 'Summer' AND year = 2021)
        AND A.finalized = 'NO'
    GROUP BY A.student_name
    ORDER BY F.score ASC, (F.first_name || ' ' || F.last_name);



--Query to set the assigned course and rank, and adds functionality for NULL if student was not assigned
-- WARNING: USE STUDENT NAME INSTEAD OF PK FOR TESTING PURPOSES
UPDATE Assignments
SET assigned_course = '5,31', --temporary value
    rank = 1 --temporary value (can be null)
WHERE
    pk = 345; --temporary value


--Calculate students_assigned LOOP
--ALSO recalculates ranking
--Sets the students_assigned as finalized
UPDATE Faculty
SET students_assigned = students_assigned + (SELECT COUNT(A.student_name)
                                             FROM Assignments A, Semester S
                                             WHERE A.faculty_fk = Faculty.pk 
                                                AND A.semester_fk = S.pk 
                                                AND S.term = 'Summer'--Temporary values
                                                AND S.year = 2021 --Temporary values
                                                AND A.assigned_course IS NOT NULL
                                                AND A.finalized = 'NO')
WHERE Faculty.pk IN (
    SELECT F.pk
    FROM Faculty F, Assignments A, Semester S
    WHERE A.faculty_fk = F.pk 
        AND A.semester_fk = S.pk 
        AND S.term = 'Summer' --Temporary values
        AND S.year = 2021 --Temporary values
        AND A.assigned_course IS NOT NULL
        AND A.finalized = 'NO'
    GROUP BY (F.first_name || ' ' || F.last_name)
);


UPDATE Assignments
SET finalized = 'YES'
WHERE finalized = 'NO' AND assigned_course IS NOT NULL;


--Reranks students
SELECT
        A.pk AS id,
        ROW_NUMBER() OVER (ORDER BY F.score ASC, (F.first_name || ' ' || F.last_name)) + R.previous AS rank,
        (F.first_name || ' ' || F.last_name) AS professor,
        (SELECT DISTINCT(A.student_name)) AS student,
        A.percentage AS percentage,
        T.course_list AS courses,
        A.finalized as finalized
    FROM
        Faculty F
        INNER JOIN Assignments A ON A.faculty_fk = F.pk
        INNER JOIN
        (SELECT
            T.SN, 
            GROUP_CONCAT(CASE WHEN T.cat = 'prevent' THEN '<span class="prevent">' || T.CN || '</span>' 
                            WHEN T.cat = 'ensure' THEN '<span class="ensure">' || T.CN || '</span>' 
                            ELSE T.CN END, ',') as course_list
        FROM
            (SELECT DISTINCT
                A.student_name AS SN, RC.course_number AS CN, RC.category AS cat
            FROM
                Requested_Courses RC
                INNER JOIN Requested_Courses CR ON RC.pk = CR.pk
                INNER JOIN Assignments A ON RC.assignment_fk = A.pk
            ORDER BY cast(RC.course_number AS INTEGER) ASC) AS T
        GROUP BY T.SN) T ON A.student_name = T.SN,
        (SELECT
            Max(A.rank) AS previous
        FROM
            Assignments A, 
            Semester S
        WHERE 
            A.semester_fk = S.pk AND S.term = 'Summer' AND year = 2021) R
    WHERE A.semester_fk IN (SELECT semester_fk 
                            FROM Assignments, Semester
                            WHERE semester_fk = Semester.pk
                            AND term = 'Summer' AND year = 2021)
        AND A.finalized = 'NO'
    GROUP BY A.student_name
    ORDER BY F.score ASC, (F.first_name || ' ' || F.last_name) + R.previous;



--Set Semester to finalized
--Automatically set to finalized
UPDATE Semester 
SET finalized = (SELECT
    CASE 
        WHEN INSTR(GROUP_CONCAT(T.CN,' ') , 'NO') = 0 THEN 'YES' ELSE 'NO'
        END AS finalized
    FROM
        (SELECT 
            A.finalized AS CN
        FROM
            Assignments A
            INNER JOIN Assignments AA ON A.student_name = AA.student_name
            INNER JOIN Semester S ON A.semester_fk = S.pk
        WHERE S.year = 2021 AND S.term = 'Summer') AS T) --Temporary values
WHERE year = 2021 AND term = 'Summer'; --Temporary values

--Manually set to finalized 
UPDATE Semester
SET finalized = 'YES'
WHERE S.year = 2021 AND S.term = 'Summer'


--Query to display ranking assignment after all assignments have been completed (previous assignment semesters)
SELECT finalized
FROM Semester
WHERE term = 'Summer' AND year = 2021 AND (data_available = 'YES' OR data_available IS NOT NULL); --Temporary values

SELECT
    A.rank AS rank,
    (SELECT DISTINCT(A.student_name)) AS student,
    A.pk AS id,
    (F.first_name || ' ' || F.last_name) AS professor,
    A.assigned_course AS courses
FROM Faculty F, Assignments A, Semester S
WHERE A.semester_fk IN (SELECT semester_fk 
                        FROM Assignments, Semester
                        WHERE semester_fk = Semester.pk
                        AND term = 'Summer' AND year = 2021) 
    AND A.faculty_fk = F.pk
GROUP BY A.student_name
ORDER BY F.score ASC, professor;


--SQlite queries for inputting data



--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------
-- Back-end Notes:
-- Category ANY with any as course number or want all course numbers for assigned courses [ASKING]
------ Can have ANY with pther course numbers as priority: (ANY, 15, 31, 120) or (15, 31, 120, ANY) [ASKING]
-- Confirm categories for courses (ensure, prevent, neutral, any?) [ASKING]
-- Percentage in available_courses table? [ASKING]
-- How will input be put into database? New courses, new students, new professor, next semesters courses, etc... [WAITING]
-- Implement files into routes or keep files [WAITING]
-- Update main query for slot indexes and new format for object that front-end needs [WAITING]
-- Make sure database is set back to normal after testing is done [WORKING]
-- Firebase implementation [NOT ME]
-- Make sure all table are backed-up before initial assignment [WORKING]
-- Optional: Undo/redo 1 assignment at a time, export results, TA assignment status, calculations page [WORKING]
------ Ask what is TA assignment status and make file for it if its easy [ASKING]
------ What is calculations page? [ASKING]
-- Undo/redo can be done using the ranks that are assigned in assignments:





---------Testing queries------------

--displays number of students assigned for professor
SELECT (F.first_name || ' ' || F.last_name) AS professor, COUNT(A.student_name) AS total_students
FROM Assignments A, Faculty F, Semester S
WHERE A.faculty_fk = F.pk 
    AND A.semester_fk = S.pk 
    AND S.term = 'Summer' 
    AND S.year = 2021 
    AND (A.assigned_course != 0 OR A.assigned_course IS NOT NULL)
    AND A.finalized != 'YES'
GROUP BY (F.first_name || ' ' || F.last_name)


DROP TABLE Student_Rankings;

CREATE TABLE IF NOT EXISTS Student_Rankings (
	id INTEGER NOT NULL,
	rank INTEGER NOT NULL,
	professor TEXT NOT NULL,
	student TEXT NOT NULL,
	percentage REAL NOT NULL,
    courses TEXT NOT NULL,
	finalized TEXT NOT NULL
);


--RESET COLUMNS
UPDATE Assignments
SET assigned_course = 0,
    rank = 0
WHERE
    pk > 0;

UPDATE Semester
SET finalized = 'YES'
WHERE pk < 27

UPDATE Assignments
SET finalized = 'NO'
WHERE pk > 0


--Query for testing functionality of recalculating score
UPDATE Assignments
SET assigned_course = 0
WHERE pk = 2712;


--Resets students assigned column TEMP
UPDATE Faculty
SET students_assigned = 0
WHERE pk > 0;

UPDATE Faculty
SET score = 0.0,
    total_semesters = 0
WHERE pk > 0



CREATE TABLE IF NOT EXISTS Requested_Courses_Copy (
	pk INTEGER PRIMARY KEY,
	assignment_fk INTEGER NOT NULL,
	course_number TEXT NOT NULL,
	category TEXT NOT NULL
);

INSERT INTO Requested_Courses_Copy (pk, assignment_fk, course_number, category)
SELECT pk, assignment_fk, course_number, category 
FROM Requested_Courses;

DROP TABLE IF EXISTS Requested_Courses;

ALTER TABLE Requested_Courses_Copy
RENAME TO Requested_Courses;



CREATE TABLE IF NOT EXISTS Assignments_Copy(
	pk INTEGER PRIMARY KEY,
	faculty_fk INTEGER NOT NULL,
	semester_fk INTEGER NOT NULL,
    percentage REAL NOT NULL,
	student_name TEXT NOT NULL,
    assigned_course TEXT,
    rank INTEGER,
	finalized TEXT NOT NULL
);

INSERT INTO Assignments_Copy (faculty_fk,semester_fk,percentage,student_name,rank,finalized)
SELECT faculty_fk,semester_fk,percentage,student_name,rank,finalized
FROM Assignments;

DROP TABLE IF EXISTS Assignments;

ALTER TABLE Assignments_Copy
RENAME TO Assignments;

UPDATE Assignments
SET pk = pk + 1
WHERE pk > 417

UPDATE Semester
SET data_available = 'YES'
WHERE pk = 31;


UPDATE Assignments
SET finalized = 'YES'
WHERE semester_fk != 27


SELECT
        T.SN, 
        CASE 
            WHEN GROUP_CONCAT(T.CN,',') LIKE '%ANY%' THEN 'ANY' ELSE GROUP_CONCAT(T.CN,',')
        END AS course_list
    FROM
        (SELECT DISTINCT
            A.student_name AS SN, RC.course_number AS CN
        FROM
            Requested_Courses RC
            INNER JOIN Requested_Courses CR ON RC.pk = CR.pk
            INNER JOIN Assignments A ON RC.assignment_fk = A.pk
        ORDER BY cast(RC.course_number AS INTEGER) ASC) AS T
    GROUP BY T.SN


    SELECT DISTINCT
            A.student_name AS SN, RC.course_number AS CN
        FROM
            Requested_Courses RC
            INNER JOIN Requested_Courses CR ON RC.pk = CR.pk
            INNER JOIN Assignments A ON RC.assignment_fk = A.pk
        ORDER BY cast(RC.course_number AS INTEGER) ASC


UPDATE Requested_Courses
SET assignment_fk = ABS(RANDOM())%(513-483) + 483
WHERE pk > 0;


UPDATE Faculty 
SET total_semesters = 0,
    score = 0
WHERE pk > 0;


CREATE TABLE IF NOT EXISTS Course_Slots (
	pk INTEGER PRIMARY KEY,
    space REAL NOT NULL,
    course_fk INTEGER NOT NULL
);

UPDATE Faculty
SET total_semesters = 0
WHERE pk > 0;


DROP TABLE Student_Rankings;


CREATE TABLE IF NOT EXISTS Student_Rankings (
	id INTEGER NOT NULL,
	rank INTEGER NOT NULL,
	professor TEXT NOT NULL,
	student TEXT NOT NULL,
	percentage REAL NOT NULL,
    courses TEXT NOT NULL,
	finalized TEXT NOT NULL
);

UPDATE Assignments
SET finalized = "NO",
    assigned_course = NULL,
    rank = NULL
WHERE pk = 490;


DELETE FROM Semester
WHERE pk = 33;



Select currentSem - startSem
FROM 
    (SELECT COUNT(*) FROM Semester WHERE term = "Summer" AND year = 2021) currentSem,
    (SELECT COUNT(*) FROM Semester WHERE term = "Spring" AND year = 2018) startSem;


SELECT row_number() OVER (ORDER BY pk) as row_num
FROM Semester
WHERE term = 'Summer' AND year = 2021;


SELECT row_number() OVER (ORDER BY pk) as row_num, pk
FROM (
    SELECT S.pk
    FROM Semester S 
    WHERE S.term = 'Summer' AND S.year = 2021
);

SELECT COUNT(*) 
FROM Semester, 
WHERE (term < 'Summer' OR (term = 'Summer' AND year < 2021));

Faculty.start_semester_fk


SELECT COUNT(*)
FROM Semester S, Faculty F
WHERE F.start_semester_fk = S.pk

--------------------------------------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS Semester_Copy (
	pk INTEGER PRIMARY KEY,
	term TEXT NOT NULL,
    year INTEGER NOT NULL,
	finalized TEXT NOT NULL,
	data_available TEXT,
    semester_order INTEGER NOT NULL
);

INSERT INTO Semester_Copy (term, year, finalized, data_available, semester_order)
SELECT term, year, finalized, data_available, ROW_NUMBER() OVER (ORDER BY pk)
FROM Semester;

DROP TABLE IF EXISTS Semester;

ALTER TABLE Semester_Copy
RENAME TO Semester;

--------------------------------------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS Requested_Courses_Copy (
	pk INTEGER PRIMARY KEY,
	assignment_fk INTEGER NOT NULL,
	course_number TEXT NOT NULL,
	category TEXT NOT NULL
);

INSERT INTO Requested_Courses_Copy ()
SELECT pk, assignment_fk, course_number, category 
FROM Requested_Courses;

DROP TABLE IF EXISTS Requested_Courses;

ALTER TABLE Requested_Courses_Copy
RENAME TO Requested_Courses;

--------------------------------------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS Requested_Courses_Copy (
	pk INTEGER PRIMARY KEY,
	assignment_fk INTEGER NOT NULL,
	course_number TEXT NOT NULL,
	category TEXT NOT NULL
);

INSERT INTO Requested_Courses_Copy ()
SELECT pk, assignment_fk, course_number, category 
FROM Requested_Courses;

DROP TABLE IF EXISTS Requested_Courses;

ALTER TABLE Requested_Courses_Copy
RENAME TO Requested_Courses;

--------------------------------------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS Requested_Courses_Copy (
	pk INTEGER PRIMARY KEY,
	assignment_fk INTEGER NOT NULL,
	course_number TEXT NOT NULL,
	category TEXT NOT NULL
);

INSERT INTO Requested_Courses_Copy ()
SELECT pk, assignment_fk, course_number, category 
FROM Requested_Courses;

DROP TABLE IF EXISTS Requested_Courses;

ALTER TABLE Requested_Courses_Copy
RENAME TO Requested_Courses;

--------------------------------------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS Assignments_Copy(
	pk INTEGER PRIMARY KEY,
	faculty_fk INTEGER NOT NULL,
	semester_fk INTEGER NOT NULL,
    percentage REAL NOT NULL,
	student_name TEXT NOT NULL,
    student_id INTEGER DEFAULT -1,
    assigned_course TEXT,
    rank INTEGER,
	finalized TEXT NOT NULL
);

INSERT INTO Assignments_Copy (pk, faculty_fk, semester_fk, percentage, student_name, assigned_course, rank, finalized)
SELECT pk, faculty_fk, semester_fk, percentage, student_name, assigned_course, rank, finalized
FROM Assignments;

DROP TABLE IF EXISTS Assignments;

ALTER TABLE Assignments_Copy
RENAME TO Assignments;

--------------------------------------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS Available_Courses_Copy (
	pk INTEGER PRIMARY KEY,
	course_number TEXT NOT NULL,
	percentage REAL NOT NULL,
    exclusive TEXT NOT NULL
);

INSERT INTO Available_Courses_Copy (course_number, percentage, exclusive)
SELECT course_number, percentage, 'NO' 
FROM Available_Courses;

DROP TABLE IF EXISTS Available_Courses;

ALTER TABLE Available_Courses_Copy
RENAME TO Available_Courses;

--------------------------------------------------------------------------------------------------------------------------------


-- Gets the total semesters INITIAL (OLD VERSION)
UPDATE Faculty
SET total_semesters = (CASE WHEN (SELECT ((SELECT S.pk 
                                            FROM Semester S 
                                            WHERE S.term = 'Summer' AND S.year = 2021) - Faculty.start_semester_fk) * 1.0) = 0 THEN 1.0 
                            ELSE (SELECT ((SELECT S.pk 
                                            FROM Semester S 
                                            WHERE S.term = 'Summer' AND S.year = 2021) - Faculty.start_semester_fk) * 1.0) 
                            END)
FROM Semester
WHERE Faculty.start_semester_fk = Semester.pk;



SELECT A.pk 
                FROM Assignments A, Semester S
                WHERE A.semester_fk = S.pk 
                        AND A.student_name = "Bobby Hill"
                        AND S.term = "Summer"
                        AND S.year = 2021

DELETE FROM Requested_Courses
WHERE assignment_fk = 514;



INSERT INTO Requested_Courses (assignment_fk, course_number, category)
            VALUES (
                (SELECT A.pk 
                FROM Assignments A, Semester S
                WHERE A.semester_fk = S.pk 
                        AND A.student_name = "Bobby Hill"
                        AND S.term = "Summer"
                        AND S.year = 2021),
                '1677',
                'neutral')


     DELETE 
    FROM Student_Rankings;



--Only to make temp student id values
CREATE TABLE temp (
  id INTEGER PRIMARY KEY,
  random_value INTEGER UNIQUE
);

DROP TABLE IF EXISTS temp;

INSERT INTO temp (random_value)
SELECT random_value FROM (
  SELECT ABS(RANDOM()) % (1000000000-100000000) + 100000000 AS random_value
  UNION SELECT ABS(RANDOM()) % (1000000000-100000000) + 100000000 AS random_value
  UNION SELECT ABS(RANDOM()) % (1000000000-100000000) + 100000000 AS random_value
  UNION SELECT ABS(RANDOM()) % (1000000000-100000000) + 100000000 AS random_value
  UNION SELECT ABS(RANDOM()) % (1000000000-100000000) + 100000000 AS random_value
  UNION SELECT ABS(RANDOM()) % (1000000000-100000000) + 100000000 AS random_value
  UNION SELECT ABS(RANDOM()) % (1000000000-100000000) + 100000000 AS random_value
  UNION SELECT ABS(RANDOM()) % (1000000000-100000000) + 100000000 AS random_value
  UNION SELECT ABS(RANDOM()) % (1000000000-100000000) + 100000000 AS random_value
)
WHERE random_value NOT IN (SELECT random_value FROM temp)
LIMIT 137;

UPDATE Assignments
SET student_id = (
  SELECT random_value FROM (
    SELECT ROW_NUMBER() OVER () AS row_num, student_name FROM (
      SELECT DISTINCT student_name FROM Assignments
    )
  ) a
  JOIN (
    SELECT ROW_NUMBER() OVER () AS row_num, random_value FROM temp
  ) t ON a.row_num = t.row_num
  WHERE a.student_name = Assignments.student_name
)
WHERE student_name IN (
  SELECT DISTINCT student_name FROM Assignments
);