-- ALL queries that are used
--Also has alot of testing queries
--Very disorganized
--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------

-- Gets the total semesters INITIAL
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
                        AND term = 'Summer' AND year = 2021) --Temporary values
    AND A.faculty_fk = F.pk
GROUP BY A.student_name
ORDER BY F.score ASC, professor;
---------------------------------------------------------------
---------------------------------------------------------------
--SQlite queries for inputting data



--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------
-- NOTES:
-- Ask some one to randomly input assignment_fk in Requested_Courses table
-- Why ranked in Requested_Course table?
-- Remove course number from Assignments table
-- Category ANY with any as course number or want all course numbers for assigned courses
-- Percentage in available_courses table?
-- To calculate the number of students assigned, can we have the data or will it start from scratch?
-- How will input be put into database? Frontend question
-- Is it ok if I keep redooing the assignment list, since 1 will always be the second?
-- Compare original database to new database for missing or changed data
-- How are we supposed to know what assignbments grad students had in the past? As team where did they get data for requested courses table.
-- Need semester_fk in Available_courses table?




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
