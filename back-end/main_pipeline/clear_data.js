//Only ran if you want to clear the necessary tables for the new semester's TA assignment 

const clearAvailableCourses = async (_db) => {

    let sql = `
    DELETE 
    FROM Available_Courses;
    `;

    await _db.run(sql);
};


const reindexAvailableCourses = async (_db) => {

    let sql = `
    REINDEX Available_Courses;
    `;

    await _db.run(sql);
};


const clearRequestedCourses = async (_db) => {

    let sql = `
    DELETE 
    FROM Requested_Courses;
    `;

    await _db.run(sql);
};


const reindexRequestedCourses = async (_db) => {

    let sql = `
    REINDEX Requested_Courses;
    `;

    await _db.run(sql);
};


const clearStudentRankings = async (_db) => {

    let sql = `
    DELETE 
    FROM Student_Rankings;
    `;

    await _db.run(sql);
};

exports.clear_data = async (_db) => {
    await clearAvailableCourses(_db);
    await reindexAvailableCourses(_db);
    await clearRequestedCourses(_db);
    await reindexRequestedCourses(_db);
    await clearStudentRankings(_db);
}