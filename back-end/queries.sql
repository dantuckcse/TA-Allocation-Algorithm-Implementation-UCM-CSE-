DROP TABLE student_rankings;

CREATE TABLE IF NOT EXISTS student_rankings (
	id INTEGER NOT NULL,
	rank INTEGER NOT NULL,
	professor TEXT NOT NULL,
	student TEXT NOT NULL,
	percentage REAL NOT NULL,
    courses TEXT NOT NULL,
	finalized TEXT NOT NULL
);

-- Gets the total semesters 
UPDATE Faculty
SET total_semesters = (CASE WHEN (SELECT ((SELECT MAX(S.pk)
    FROM Semester S) - Faculty.start_semester_fk) * 1.0) = 0 THEN 0.1 ELSE (SELECT ((SELECT MAX(S.pk)
    FROM Semester S) - Faculty.start_semester_fk) * 1.0) END)
FROM Semester
WHERE Faculty.start_semester_fk = Semester.pk


-- calculates score for ranking
UPDATE FACULTY
SET score = (CASE WHEN students_assigned / total_semesters = 0.0 THEN ROUND(0.1 / total_semesters, 5) ELSE ROUND(students_assigned / total_semesters, 5) END)


--QUERY TO GET ALL REQUIRED DATA and store into student_rankings table
INSERT INTO student_rankings (id, rank, professor, student, percentage, courses, finalized)
SELECT
    ROW_NUMBER() OVER(ORDER BY A.student_name) - 1 AS id,
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
        T.SN, GROUP_CONCAT(T.CN,',') course_list
    FROM
        (SELECT DISTINCT
            A.student_name AS SN, A.course_number AS CN
        FROM
            Assignments A
            INNER JOIN Assignments AA ON A.student_name = AA.student_name
            INNER JOIN Faculty F ON A.faculty_fk = F.pk
        ORDER BY cast(A.course_number AS INTEGER) ASC) AS T
    GROUP BY T.SN) T ON A.student_name = T.SN
GROUP BY A.student_name
ORDER BY F.score ASC, professor