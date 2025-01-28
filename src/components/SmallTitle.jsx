import React from 'react'

function SmallTitle({ title }) {
    return (
        <div className="container mt-5">
            <div className="">
                <h1 className="mb-3" style={{ fontSize: '1.5rem' }}>{title}</h1>
            </div>
        </div>
    )
}

export default SmallTitle