import React from "react"

export default function Header() {
    return (
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
    )
}