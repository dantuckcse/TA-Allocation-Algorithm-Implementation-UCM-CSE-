import React from "react"

export default function addRequests(prop){
    return (
        <div className="request--container">
            <div>
                <h3>Student: {prop.student}</h3>
                <p>Rank: {prop.rank}</p>
                <p>Professor: {prop.professor}</p>
                <p>Percentage: {prop.percentage}</p>
                <p>Courses: {prop.courses + " "}</p>
            </div>
        </div>
    )
}