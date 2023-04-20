import { currentSemesterData } from "../Data-Form";
import { courseDetailData } from "../Data-Form";
import { professorDetailData } from "../Data-Form";
import { studentDetailData } from "../Data-Form";


export default function currentSemesterFunction() {
    console.log(currentSemesterData);
    // {term: 'Spring', year: 2022}
    console.log(courseDetailData);
    // {courseNumber: '420', courseUnit: '3.5', exclusive: 'NO'}
    console.log(professorDetailData);
    //{FirstName: 'Micheal', LastName: 'Scott', StartingTerm: 'Spring', StartingYear: '2003'}
    console.log(studentDetailData);
    //{associatedProfessorName: 'Micheal Scott', fullName: 'Dwight Schrute', studentCourses: Array(4), studentExclusiveCourses: '100', studentTAUnit: '0.25'}
}   // i.e: studentCourses: [120, 100, 420, 360]

