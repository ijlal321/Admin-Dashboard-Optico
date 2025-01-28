import React, { useState } from 'react';
import { Trash2, PlusCircle, Save, XCircle } from 'lucide-react';
import GenericImagesForm2 from '../../addStock/GenericImagesForm2';
import { CodeSlash } from 'react-bootstrap-icons';
import { uploadImagesArray, deleteImagesArray } from '@/utlis/uploadImages';

// const lifeTimes = ['1 day', '1 month', '6 months', '1 year'];
import lifeTimes from '@/data/contactLens/lifeTimes.json';

function CreatenewColor({ selectedBrand, setSelectedBrand, setStatus }) {
    const [newColor, setNewColor] = useState(null);
    const [newImages, setNewImages] = useState([]); // need this because genericImagesForm2 needs a new variable where it makes all the changes to images, 
    // then we will later set the newImages to images, when user clicks save.
    // also its empty initlially, bcz its a new Color

    const handleCreateNewColor = () => {
        setNewColor({ name: '', colorTags: [], lifeTime: lifeTimes[0], planoPrice: '', powerPrice: '', description: '', batches: [], images: [] });
    };

    const handleSaveNewColor = async () => {
        let uploadedImages = [];
        try {
            setStatus({ status: 'loading', description: 'Uploading Images...' });
            const res = await uploadImagesArray(newImages, "contactLens");
            if (!res.success) {
                setStatus({ status: 'error', description: res.message });
            }
            uploadedImages = res.uploadedImages;
            console.log("Uploaded Images", uploadedImages);

            setStatus({ status: 'loading', description: 'Saving Color...' });
            // const updatedBrand = { ...selectedBrand, colors: [...selectedBrand.products, { ...newProduct, images: uploadedImages }] };
            const updatedBrand = { ...selectedBrand, colors: [...selectedBrand.colors, { ...newColor, images: uploadedImages }] };
            const response = await fetch('/api/contactLens', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedBrand),
            });
            const data = await response.json();
            if (data.success) {
                setSelectedBrand(data.data);
                setStatus({ status: 'successful', description: 'New color saved successfully' });
            } else {
                throw new Error('Failed to save new color', data.error);
            }
        } catch (error) {
            setStatus({ status: 'error', description: `Failed to save data. Error ${error} ` });
            deleteImagesArray(uploadedImages);
        }
        setNewColor(null);
        setNewImages([]);
    };

    const handleCancelNewColor = () => {
        setNewColor(null);
    };



    return (
        <div>
            <h1 className='mb-4 display-6'>Colors</h1>
            {!newColor && (
                <button className='btn btn-success mb-4 d-flex align-items-center gap-2' onClick={handleCreateNewColor}>
                    <PlusCircle size={16} /> Create New Color
                </button>
            )}
            <div className='row'>
                {newColor && (
                    <div className='card col-md-4 m-2'>
                        <div className='card-body'>
                            <div className='mb-3'>
                                <label>Name</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={newColor.name}
                                    onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                                />
                            </div>
                            <div className='mb-3'>
                                <label>Color Tags</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={newColor.colorTags.join(', ')}
                                    onChange={(e) => setNewColor({ ...newColor, colorTags: e.target.value.split(',').map(tag => tag.trim()) })}
                                />
                            </div>
                            <div className='mb-3'>
                                <label>Description</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={newColor.description}
                                    onChange={(e) => setNewColor({ ...newColor, description: e.target.value })}
                                />
                            </div>
                            <div className='mb-3'>
                                <label>Life Time</label>
                                <select
                                    className='form-control'
                                    value={newColor.lifeTime}
                                    onChange={(e) => setNewColor({ ...newColor, lifeTime: e.target.value })}
                                >
                                    {lifeTimes.map((lifeTime) => (
                                        <option key={lifeTime} value={lifeTime}>
                                            {lifeTime}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='mb-3'>
                                <label>Plano Price</label>
                                <input
                                    type='number'
                                    className='form-control'
                                    value={newColor.planoPrice}
                                    onChange={(e) => setNewColor({ ...newColor, planoPrice: e.target.value })}
                                />
                            </div>
                            <div className='mb-3'>
                                <label>Power Price</label>
                                <input
                                    type='number'
                                    className='form-control'
                                    value={newColor.powerPrice}
                                    onChange={(e) => setNewColor({ ...newColor, powerPrice: e.target.value })}
                                />
                            </div>
                            <GenericImagesForm2 newImages={newImages} setNewImages={setNewImages} />

                            <div className='d-flex gap-2'>
                                <button className='btn btn-primary mr-2 d-flex align-items-center gap-2' onClick={handleSaveNewColor}>
                                    <Save size={16} /> Save
                                </button>
                                <button className='btn btn-secondary d-flex align-items-center gap-2' onClick={handleCancelNewColor}>
                                    <XCircle size={16} /> Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreatenewColor