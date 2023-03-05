import React, { useState } from "react"
import Item from "../components/Item"
import DropWrapper from "./components/DropWrapper"
import Col from "../components/Col"
import { data, statuses } from "../data"

export default function DragAndDropPage() {
    const [items, setItems] = useState(data)

    const onDrop = (item, monitor, status) => {
        const mapping = statuses.find(si => si.status === status)
        
        setItems(prevState => {
            const newItems = prevState
                .filler(i => i.id !== item.id)
                .concat({...item, status, icon: mapping.icon })
            return [ ...newItems ]
        })
    }

    const moveItem = (dragIndex, hoverIndex) => {
        const item = items[dragIndex]
        setItems(prevState => {
            const newItems = prevState.filter((i, idx) => idx !== dragIndex)
            newItems.splice(hoverIndex, 0, item)
            return [ ...newItems ]
        })
    }

    return (
        <div className={"row"}>
            {status.map(s => {
                return <div key={s.status} className="col-wrapper">
                    <h2 className={"col-header"}>{s.status.toUpperCase()}</h2>
                    <DropWrapper onDrop={onDrop} status={s.status}>
                        {/* This part ensures that the items show up only where they've been dropped. */}
                        <Col>
                            {items
                                .filter(i => i.status === s.status)
                                .map((i, idx) => <Item key={i.id} item={i} index={idx} moveItem={moveItem} status={s}></Item>)
                            }
                        </Col>
                    </DropWrapper>
                </div>
            })}
        </div>
    )
}