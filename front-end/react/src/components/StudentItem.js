import React, {Fragment, useState, useRef} from "react"
import { useDrag, useDrop } from "react-dnd"
import Window from "./Window"
import ITEM_TYPE from "../data/itemType"

const StudentItem = ({ item, index, moveItem, status }) => {
    const ref = useRef(null)

    const [, drop] = useDrop({
        accept: ITEM_TYPE, 
        hover(item, monitor) {
            if (!ref.current) {
                return
            }

            const dragIndex = item.index
            const hoverIndex = index

            moveItem(dragIndex, hoverIndex)
            item.index = hoverIndex
        }
    })

    const [{ isDragging }, drag] = useState({
        item: { type: ITEM_TYPE, ...item, index} ,
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    })

    const [show, setShow] = useState(false)
    const onOpen = () => setShow(true)
    const onClose = () => setShow(false)

    drag(drop(ref))

    return (
        <Fragment>
            <div className="drop-items-here">
                <div className="courses--container">
                    <p>CSE {prop.CSE}</p>
                    <br></br>
                </div>
                {/*FIX HERE*/}
                <div className="slots--container" ref={drop} id = {isOver ? "hover-region" : ""}>
                    {slottedStudents}
                    <p>{prop.slots}</p>
                </div>
            </div>
        </Fragment>
    )
}