import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const dbPromise = open({
    filename: 'test.db',
    driver: sqlite3.Database,
});

const setup1 = async () => {
    const db = await dbPromise
    await db.run("UPDATE Faculty SET total_semesters = (CASE WHEN (SELECT ((SELECT MAX(S.pk) FROM Semester S) - Faculty.start_semester_fk) * 1.0) = 0 THEN 0.1 ELSE (SELECT ((SELECT MAX(S.pk) FROM Semester S) - Faculty.start_semester_fk) * 1.0) END) FROM Semester WHERE Faculty.start_semester_fk = Semester.pk;")

}

const setup2 = async () => {
    const db = await dbPromise
    await db.run("UPDATE FACULTY SET score = (CASE WHEN students_assigned / total_semesters = 0.0 THEN ROUND(0.1 / total_semesters, 5) ELSE ROUND(students_assigned / total_semesters, 5) END);")

}

setup1();
setup2();
