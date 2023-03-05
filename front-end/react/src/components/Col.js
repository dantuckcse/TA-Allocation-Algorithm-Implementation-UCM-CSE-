import React from "react"

/* 
This will highlight any portion that you're dragging an item over,
indicating that it will drop there when released.
*/
export default function Co({isOver, children}) {
    const className = isOver ? "highlight-region" : ""
    return (
        <div className= {`col${className}`}>
            {children}
        </div>
    )
}