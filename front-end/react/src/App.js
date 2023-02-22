import React from "react"
import AddRequests from "./components/AddRequests"
import AddAvalable from "./components/AddAvailable"
import requests from "./requests"
//import available from "./available"

export default function App() {
    const user_requests = requests.map(item => {
        return (
            <AddRequests 
                key = {item}
                {...item}
            />
        )
    })
    
    return (
        <div className="container">
            {/* <AddAvalable /> */}
            <section>
                {user_requests}
            </section>
        </div>
    )
}
