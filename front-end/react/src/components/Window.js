import React from "react"
import Modal from "react-modal"
import "./comp-style.css"

Modal.setAppElement("#app")

const Window = ({ show, onClose, item}) => {
    return (
        <Modal
        isOpen={show}
        onRequestClose={onClose}
        className={"modal"}
        overlayClassName={"overlay"}
        >
            <div className="requests--container">
                <div className="student--info">
                    <p id="student-item" className="student-txt">{item.student}</p>
                    <p id="student-item" className="course-txt">CSE {item.courses + " "}</p>
                    <p id="student-item">{item.professor} - {item.percentage}</p>
                    <br></br>
                </div>

                <div className="student--slots"></div>
            </div>
        </Modal>
    )
}

export default Window