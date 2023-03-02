import React from "react"
// import "./style.css"
import AddRequests from "./components/AddRequests"
import AddAvailable from "./components/AddAvailable"
import requests from "./requests"
import available from "./available"
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
            <nav className="nav-bar">
                <h1 className="ucm-logo">
                <span className="UC">UC</span>
                    MERCED
                    </h1>
                <h1 id="title">TA ALLOCATION</h1>
                <div className="nav-items">
                    <h3 id="nav-item">YEAR</h3>
                    <h3 id="nav-item">POST ASSIGNMENT</h3>
                    <h3 id="nav-item">FULFULLMENT ORDER</h3>
                    <h3 id="nav-item">LOGOUT</h3>
                </div>
            </nav>
            <div className="drag-and-drop">
                <div className="selected-container">
                    {available_courses}
                </div>
                <div className="unselected-container">
                    {/* <AddAvalable /> */}
                    <DndProvider backend={HTML5Backend}>
                        {user_requests}
                    </DndProvider>
                </div>
            </div>
        </body>
    )
}
