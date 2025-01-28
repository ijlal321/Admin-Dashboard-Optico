import React, { useState, useRef } from 'react'
import { Trash2 } from 'lucide-react';

function GenericImagesForm2({ newImages, setNewImages, isEditable = true }) {

    const fileInputRef = useRef(null);

    const setStoredImg = (imageFile) => {
        if (!isEditable) {
            return;
        }
        setNewImages([...newImages, imageFile]); // Store the image file in the state
    }

    const removeImage = (index) => {
        if (!isEditable) {
            return;
        }
        const images = newImages.filter((image, i) => i !== index);
        setNewImages(images);
    }

    const handleDrop = (event) => {
        event.preventDefault(); // Prevent default behavior
        const files = event.dataTransfer.files; // Get the dropped files

        if (files && files[0]) {
            const imageFile = files[0];

            setStoredImg(imageFile); // Store the image file in the state
        }
    };

    // Allow the div to accept drops
    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDivClick = () => {
        fileInputRef.current.click(); // Programmatically trigger the file input click
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0]; // Get the selected file

        if (file && file.type.startsWith('image/')) {
            setStoredImg(file); // Store the image file in the state
        } else {
            alert('Please select a valid image file!');
        }
    };

    return (
        <div>
            {isEditable && (<>
                <label>Upload Images here</label>
                <div
                    onClick={handleDivClick}
                    onDrop={handleDrop} // Handle drop
                    onDragOver={handleDragOver} // Allow drag over event
                    style={{
                        border: '2px dashed #ccc',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '20px',
                    }}
                >
                    <p className="m-1">Drag and drop an image here</p>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}  // Hide the file input
                    onChange={handleFileSelect}  // Handle file selection
                    accept="image/*"  // Only accept image files
                />
            </>)}
            {/* preview images */}
            <div className='row'>
                {newImages.map((image, index) => (
                    <div key={index} className='col-md-4 mb-3 d-flex flex-column align-items-center justify-content-center' >
                        {/* button in center of img */}
                        {isEditable && (
                            <button
                                className='btn btn-danger'
                                onClick={() => removeImage(index)}
                                style={{ position: 'absolute'}}
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                        <p>{index == 0 ? "Front Image" : index == 1 ? "Side Image" : `Image No. ${index}`}</p>
                        {typeof image === 'string' ? (
                            <img src={image} alt="Stored Image" />
                        ) : (
                            <>
                                <img
                                    src={URL.createObjectURL(image)} // Temporarily display the image
                                    alt="Dropped"
                                    style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px' }}
                                />
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GenericImagesForm2