import React from "react";
import './edit.css';

const Edit = () => {
    return (
        <header>
            <div className="container edit__container">
                <h5>Edit</h5>
                <h1>your meme</h1>
                <h5 className="text-light">Add custom quotes, etc.</h5>
                
                <div className="cta">
                <a href="" download className="btn btn-primary">Download</a>
                <a href="" className="btn">Reset</a>
            </div>
            </div>
        </header>
    )
}

export default Edit