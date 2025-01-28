import React, { useState } from 'react';
import { Trash2, PlusCircle, Save, XCircle } from 'lucide-react';
import GenericImagesForm2 from '../../addStock/GenericImagesForm2';
import { deleteImagesArray, uploadImagesArray } from '@/utlis/uploadImages';
import { updateBrand } from '@/utlis/contactLensHelper';    
import { CodeSlash } from 'react-bootstrap-icons';

import lifeTimes from '@/data/contactLens/lifeTimes.json';

function EditColor({ brand, color, status, setStatus }) {
    const [newColor, setNewColor] = useState(color);
    const [newImages, setNewImages] = useState(color.images); // need this because genericImagesForm2 needs a new variable where it makes all the changes to images, 
    // then we will later set the newImages to images, when user clicks save.
    // also its empty initlially, bcz its a new color
    const [isEditing, setIsEditing] = useState(false);


    const handleDeleteColor = async () => {
        try {
            if (window.confirm('Are you sure you want to delete this color?')) {

                // delete images from db
                setStatus({ status: 'loading', description: 'Deleting color images...' });
                const unSuccessful = await deleteImagesArray(color.images);
                if (unSuccessful > 0) {
                    throw new Error(`Failed to delete ${unSuccessful} images. try again`);
                }

                setStatus({ status: 'loading', description: 'Deleting color...' });
                // filter color from brand
                const updatedBrand = { ...brand, colors: brand.colors.filter(c => c.id !== color.id) };
                const data = await updateBrand(updatedBrand);
                if (data.success) {
                    setStatus({ status: 'successful', description: 'Color deleted successfully' });
                } else {
                    throw new Error(data.error);
                }

            }
        } catch (error) {
            setStatus({ status: 'error', description: error.message });
            console.error('Error deleting color:', error);
        }
    }

    const handleColorUpdate = async () => {
        try {
            // update new images on server
            setStatus({ status: 'loading', description: 'Updating images...' });
            let data = await uploadImagesArray(newImages, "contactLens");
            if (!data.success) {
                throw new Error(`Failed to upload images. Reason: ${data.error}`);
            }
            const newUploadedImages = data.uploadedImages;

            // update color on server
            const updatedBrand = { ...brand, colors: brand.colors.map(c => c.id === color.id ? { ...c, ...newColor, images: newUploadedImages } : c) };
            data = await updateBrand(updatedBrand);
            if (!data.success) {
                throw new Error(data.error);
            }

            // delete old images from server
            setStatus({ status: 'loading', description: 'Deleting old images...' });
            const toBeDelete = color.images.filter(img => !newUploadedImages.includes(img));
            const unSuccessful = await deleteImagesArray(toBeDelete);
            if (unSuccessful > 0) {
                throw new Error(`Data saved, but Failed to delete ${unSuccessful} old images. try again`);
            }
            setIsEditing(false);
            setStatus({ status: 'finished', description: 'Color updated successfully' });
        } catch (error) {
            setStatus({ status: 'error', description: error.message });
            console.error('Error updating color:', error);
        }
    }

    const handleCancelUpdate = () => {
        setNewColor(color);
        setNewImages(color.images);
        setIsEditing(false);
    }

    return (
        <div className='card m-7'>
            {!isEditing ? (
                <div className='d-flex gap-5 m-4 mb-0 justify-space-between'>
                    <button className='btn btn-warning d-flex align-items-center gap-2' onClick={() => setIsEditing(true)}>
                        <CodeSlash size={16} /> Edit color
                    </button>
                    <button className='btn btn-danger d-flex align-items-center gap-2' onClick={handleDeleteColor}>
                        <Trash2 size={16} /> Delete color
                    </button>
                </div>
            ) :
                <div className='d-flex gap-5 m-4 mb-0 justify-space-between'>
                    <button className='btn btn-primary d-flex align-items-center gap-2' onClick={handleColorUpdate}>
                        <Save size={16} /> Update
                    </button>
                    <button className='btn btn-secondary d-flex align-items-center gap-2' onClick={handleCancelUpdate}>
                        <XCircle size={16} /> Cancel
                    </button>
                </div>
            }
            <div className='card-body row'>
                <div className='col-md-6'>
                    <div className='mb-3'>
                        <label>Name</label>
                        <input
                            type='text'
                            className='form-control'
                            value={newColor.name}
                            onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                            readOnly={!isEditing}
                        />
                    </div>
                    <div className='mb-3'>
                        <label>Color Tags</label>
                        <input
                            type='text'
                            className='form-control'
                            value={newColor.colorTags.join(', ')}
                            onChange={(e) => setNewColor({ ...newColor, colorTags: e.target.value.split(',').map(tag => tag.trim()) })}
                            readOnly={!isEditing}
                        />
                    </div>
                    <div className='mb-3'>
                        <label>Description</label>
                        <input
                            type='text'
                            className='form-control'
                            value={newColor.description}
                            onChange={(e) => setNewColor({ ...newColor, description: e.target.value })}
                            readOnly={!isEditing}
                        />
                    </div>
                    <div className='mb-3'>
                        <label>Life Time</label>
                        <select
                            className='form-control'
                            value={newColor.lifeTime}
                            onChange={(e) => setNewColor({ ...newColor, lifeTime: e.target.value })}
                            disabled={!isEditing}
                        >
                            {lifeTimes.map((lifeTime) => (
                                <option key={lifeTime} value={lifeTime}>
                                    {lifeTime}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='col-md-6'>
                    <GenericImagesForm2 newImages={newImages} setNewImages={setNewImages} isEditable={isEditing} />
                </div>
            </div>
        </div>
    );
}

export default EditColor