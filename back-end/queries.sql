
-- Gets Numerator for the equation  
UPDATE Faculty
SET total_semesters = (CASE WHEN (SELECT ((SELECT MAX(S.pk) FROM Semester S) - Faculty.start_semester_fk) * 1.0) = 0 THEN 0.1 ELSE (SELECT ((SELECT MAX(S.pk) FROM Semester S) - Faculty.start_semester_fk) * 1.0) END)
FROM Semester
WHERE Faculty.start_semester_fk = Semester.pk


-- calculates score
UPDATE FACULTY
SET score = (CASE WHEN students_assigned / total_semesters = 0.0 THEN ROUND(0.1 / total_semesters, 5) ELSE ROUND(students_assigned / total_semesters, 5) END)


--print ranking order of students (to display only)
SELECT DISTINCT(A.student_name), F.score
FROM Assignments A, Faculty F 
WHERE A.faculty_fk = F.pk
GROUP BY A.student_name
ORDER BY F.score ASC, (F.first_name || ' ' || F.last_name)

----------------------------------------------------------------------------------------------
--USE FOR OBJECTS AND ARRAYS

-- Gets Data for student name and id
SELECT DISTINCT(A.student_name), ROW_NUMBER() OVER(ORDER BY A.student_name) - 1 AS student_id
FROM Assignments A
Group BY A.student_name


-- Get Data for ranking order object
SELECT DISTINCT(A.student_name), ROW_NUMBER() OVER (ORDER BY F.score ASC, (F.first_name || ' ' || F.last_name)) AS rank 
FROM Faculty F, Assignments A
WHERE A.faculty_fk = F.pk
GROUP BY A.student_name
ORDER BY F.score ASC, (F.first_name || ' ' || F.last_name)


-- Get Data for professor object
SELECT (F.first_name || ' ' || F.last_name) AS faculty_name, A.student_name
FROM Faculty F, Assignments A
WHERE A.faculty_fk = F.pk
GROUP BY A.student_name
ORDER BY F.score ASC, (F.first_name || ' ' || F.last_name)


-- Get Data for percent object
SELECT A.percentage, A.student_name
FROM Faculty F, Assignments A
WHERE A.faculty_fk = F.pk
GROUP BY A.student_name
ORDER BY A.student_name


-- Get Data for courses object
SELECT  A.semester_fk, A.student_name
FROM Faculty F, Assignments A
WHERE A.faculty_fk = F.pk
ORDER BY A.student_name
