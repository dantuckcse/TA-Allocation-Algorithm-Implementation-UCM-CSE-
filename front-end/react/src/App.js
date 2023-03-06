import React from "react"
// import "./style.css"
import Header from "./components/Header"
import AddRequests from "./components/AddRequests"
import AddAvailable from "./components/AddAvailable"
import requests from "./data/requests"
import available from "./data/available"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from 'react-dnd-html5-backend'

export default function App() {
    const user_requests = requests.map(item => {
        return (
            <AddRequests 
                key = {item}
                {...item}
            />
        )
    })
    const available_courses = available.map(item => {
        return (
            <AddAvailable 
                key = {item}
                {...item}
            />
        )
    })
    
    return (
        <body>
            <Header />

            <div className="drag-and-drop">
                <div className="selected-container">
                    <DndProvider backend={HTML5Backend}>
                        {available_courses}
                    </DndProvider>
                </div>
                <div className="unselected-container">
                    <DndProvider backend={HTML5Backend}>
                        {user_requests}
                    </DndProvider>
                </div>
            </div>
        </body>
    )
}
