import React, { useState } from 'react';

const FieldWithOptionsInput = ({ inputValue, properties, updateField }) => {
    const [curInput, setCurInput] = useState('');
    const handleButtonClick = (e, item) => {
        e.preventDefault();

        let newInput;
        if (properties.multi == false) {
            if (properties.type == "number") {
                newInput = parseInt(item);
            }
            else {
                newInput = item;
            }
        }
        else {
            // if it is already in the array, then remove it
            if (inputValue.includes(item.trim())) {
                newInput = inputValue.filter((value) => value !== item.trim());
            }
            else {
                newInput = [...inputValue, item.trim()];
            }
        }
        updateField(newInput);
    }

    const removeFromMultiArray = (e, item) => {
        e.preventDefault();
        const newInput = inputValue.filter((value) => value !== item);
        updateField(newInput);
    }

    return (
        // each div contains half screen on medium, col-md-6
        <div className="col-md-6 mb-3">

            {/* flex needed, bcz if it is multi, then needed half screen for displaying selected strings */}
            <div className='d-flex '>

                {/* left side  */}
                <div style={{ width: properties.multi ? "50%" : "100%" }}>
                    <label>{properties.displayName}</label>

                    {/* input, with diffferent function calls for multi or not multi. we could duplicate code below, but i thought this is much more cleaner */}
                    <div className="input-group">
                        <input
                            type={properties.type}
                            className="form-control"
                            value={properties.multi ? curInput : inputValue}
                            onChange={(e) => {
                                if (properties.multi) {
                                    setCurInput(e.target.value)
                                }
                                else {
                                    updateField(e.target.value);
                                }
                            }}
                            placeholder={`Enter ${properties.displayName}`}
                            // only for multi to select tag on enter
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleButtonClick(e, curInput);
                                    setCurInput('');
                                }
                            }}
                        />
                    </div>
                    {/* show helper options */}
                    <div className="d-flex flex-wrap gap-2 justify-content-start mt-1">
                        {properties.options.map((item, index) => (
                            <button className="btn btn-outline-dark rounded-pill py-1 px-3 hover-shadow" key={index} onClick={(e) => handleButtonClick(e, item)}>
                                {item}
                            </button>
                        ))}
                    </div>
                </div>

                {/* show selected strings */}
                {properties.multi && <div style={{ width: "50%", borderLeft: "1px solid #ccc", paddingLeft: "10px", marginLeft: "10px"
                // , maxHeight: "100px", overflowY: "auto"  // optional overflow scroll, if needed
                }}>
                    <label style={{ textDecoration: "underline" }}>Selected {properties.displayName}</label>
                    <div className="d-flex flex-wrap gap-2 justify-content-start mt-1">
                        {inputValue.map((item, index) => (
                            <button className="btn btn-light rounded-pill py-1 px-3 hover-shadow" key={index} onClick={(e) => removeFromMultiArray(e, item)}>
                                {item}
                            </button>
                        ))}
                    </div>
                </div>}
            </div>
        </div>
    );
}

export default FieldWithOptionsInput;