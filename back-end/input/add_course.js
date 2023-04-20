exports.addCourseData = async (_db, addCourse) => {

    let sql = `
        INSERT INTO Available_Courses (course_number, percentage, exclusive)
        VALUES (?, ?, ?);
    `;

    let args = [addCourse.number, addCourse.percentage, addCourse.exclusive];
    await _db.run(sql, args);
};