import React, { Fragment, useState, useRef } from "react"
import AddRequests from "./components/AddRequests"
import { useDrag, useDrop } from "react-dnd"
import Window from "./Window"
import ITEM_TYPE from "../data/types"

/*
The item is responsible for moving the item within the container
and to the other columns.
 */
const Item = ({ item, index, moveItem, status }) => {
    const ref = useRef(null)
    
    // Function for hovering over a column.
    const [, drop] = useDrop({
        accept: ITEM_TYPE,
        hover(item, monitor) {
            if (!ref.current){
                return
            }

            const dragIndex = item.index
            const hoverIndex = index // Index of what we're hovering over

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoveredReact = current.getBoundClientReact();
            const hoverMiddleY = (hoveredReact.bottom = hoveredRect.top) / 2
            const mousePosition = monitor.getClientOffset() // Where we're dragging our items on the screen
            const hoverClientY = mousePosition.y - hoveredReact.top;

            /*
            These functions makes it so that when we hover over a different item, 
            those two items will switch places upon release.
            *** Note: Might need to change this to only work with items that are
                already placed in the 'courses' drop section. They'll also need 
                swap places vertically, rather than horizontally -- or simply
                be replaced entirely (?)
            */
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY){
                return
            }

            if (dragIndex > hoverIndes && hoverClientY < hoverMiddleY){
                return
            }
            // This callback will allows us to change where the card is in the same column. 
            moveItem(dragIndex, hoverIndex)
            item.index = hoverIndex
        }
    })

    const [{ isDragging }, drag] = useDrag({
        item: {type: ITEM_TYPE, ...item, index},
        /* 
        The collect callback gives us with props and data that react dnd supplies for us.
        One of these is the monitor, which is a copy of the screen.
        */
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
            <div
            ref={ref}
            style={{ opacity: isDragging ? 0 : 1}}
            className={"item"}
            onClick={onOpen}
            >
                <AddRequests />
                {/* <div className={"color-bar"} style={{ backgroundColor: status.color }}></div>
                <p className={"item-title"}>{item.content}</p>
                <p className={"item-status"}>{item.icon}</p> */}
            </div>
            <Window 
                item={item}
                onClose={onClose}
                show={show}
            />
        </Fragment>
    )
}

export default Item