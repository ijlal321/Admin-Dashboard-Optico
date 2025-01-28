import React from 'react'

function CenterTitle({title}) {
    return (
        <div className="container mt-5">
            <div className="col-md-8 offset-md-2">
                <h1 className="display-4 text-center">{title}</h1>
            </div>
        </div>
    )
}

export default CenterTitle