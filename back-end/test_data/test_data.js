//test file for inputting data

const newSemester = {
    new_term: "Fall",
    new_year: 2023
};

//For any semester
const newProfessor = {
    first_name: "Bobby",
    last_name: "Jones",
    starting_term: "Fall",
    starting_year: 2019
};

//Only for the current semester
//NOTE: exclusive are for courses that are reserved for specific students
const addCourse = {
    number: 188,
    percentage: 1.25,
    exclusive: 'NO'
};

//Only for the current semester
//NOTE!!: exclusive_courses is the course that the professor guarantees for the student. Using
//this object as an example, Professor Wan Du is teaching CSE 185 and wants to reserve TA spots 
//for his graduate students, such Bobby Hill. So the exclusive course is 185. 
//Otherwise make it empty, exclusive_courses: []
const addStudent = {
    professor_name: "Wan Du",
    student_name: "Bobby Hill",
    courses: [5,15,20,30,31,100,165,185],
    exclusive_course: 185,
    percentage: 0.5
};

//This is semester that the TA allocation is happening for
//This should be sent with all the other objects
const currentSemester = {
    term: "Spring",
    year: 2023
}

export {newSemester, newProfessor, addCourse, addStudent};
