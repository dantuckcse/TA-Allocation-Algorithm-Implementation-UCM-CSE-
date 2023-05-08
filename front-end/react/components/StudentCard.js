import { useDrag } from "react-dnd"
import  itemTypes  from "../utils/itemType"

export const assigned_student = {}
export default function StudentCard(prop){

    const [{ isDragging }, drag] = useDrag(() => ({ // react-dnd's drag state
        type: itemTypes.UNSLOTTED_STUDENT, // type is required as it's used by the "accept" specification of drop targets.
        item: {
            id: prop.id,
            student: prop.student,
            rank: prop.rank,
            courses: prop.courses
        },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult()
            if (item && dropResult) {
             assigned_student.id = dropResult.id
             assigned_student.rank = dropResult.rank
             assigned_student.courses = dropResult.courses
            }
        },
        // "collect" utilizes a "monitor" instance to pull important pieces of state from the DnD systems
        collect: monitor => ({
            isDragging: !!monitor.isDragging()
        })
    }))

    
    return (
        <div className="requests--container" ref={drag} id = {isDragging ? "dragging-item" : ""}>
            <div className="student--info">
                <p id="student-item" className="student-txt">{prop.student}</p>
                <p id="student-item" className="course-txt"> Desired Courses: {prop.courses.map(course => typeof course === 'string' ? <span dangerouslySetInnerHTML={{ __html: course }} /> : `CSE ${course}`).reduce((prev, curr) => [prev, ', ', curr])} </p>
                <p id="student-item">{prop.professor} - {prop.percentage}</p>
                <br></br>
            </div>



            <div className="student--slots"></div>
        </div>
    )
}