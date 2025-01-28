import React, { useState } from 'react';
import { Trash2, PlusCircle, Save, XCircle } from 'lucide-react';
import GenericImagesForm2 from '../addStock/GenericImagesForm2';
import { CodeSlash } from 'react-bootstrap-icons';
import { uploadImagesArray, deleteImagesArray } from '@/utlis/uploadImages';
import { set } from 'mongoose';

function CreatenewProduct({ selectedBrand, setSelectedBrand, setStatus }) {
    const [newProduct, setNewProduct] = useState(null);
    const [newImages, setNewImages] = useState([]); // need this because genericImagesForm2 needs a new variable where it makes all the changes to images, 
    // then we will later set the newImages to images, when user clicks save.
    // also its empty initlially, bcz its a new product

    const handleCreateNewProduct = () => {
        setNewProduct({ name: '', description: '', batches: [], images: [] });
    };

    const handleSaveNewProduct = async () => {
        let uploadedImages = [];
        try {
            setStatus({ status: 'loading', description: 'Uploading Images...' });
            const res = await uploadImagesArray(newImages, "prescriptionLens");
            if (!res.success) {
                setStatus({ status: 'error', description: res.message });
            }
            uploadedImages = res.uploadedImages;
            console.log("Uploaded Images", uploadedImages);

            setStatus({ status: 'loading', description: 'Saving Product...' });
            const updatedBrand = { ...selectedBrand, products: [...selectedBrand.products, { ...newProduct, images: uploadedImages }] };

            const response = await fetch('/api/prescriptionLens', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedBrand),
            });
            const data = await response.json();
            if (data.success) {
                setSelectedBrand(data.data);
                setStatus({ status: 'successful', description: 'New product saved successfully' });
            } else {
                throw new Error('Failed to save new product', data.error);
            }
        } catch (error) {
            setStatus({ status: 'error', description: `Failed to save data. Error ${error} ` });
            deleteImagesArray(uploadedImages);
        }
        setNewProduct(null);
        setNewImages([]);
    };

    const handleCancelNewProduct = () => {
        setNewProduct(null);
    };


    return (
        <div>
            <h1 className='mb-4 display-6'>Products</h1>
            {!newProduct && (
                <button className='btn btn-success mb-4 d-flex align-items-center gap-2' onClick={handleCreateNewProduct}>
                    <PlusCircle size={16} /> Create New Product
                </button>
            )}
            <div className='row'>
                {newProduct && (
                    <div className='card col-md-4 m-2'>
                        <div className='card-body'>
                            <div className='mb-3'>
                                <label>Name</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                />
                            </div>
                            <div className='mb-3'>
                                <label>Description</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                />
                            </div>

                            <GenericImagesForm2 newImages={newImages} setNewImages={setNewImages} />

                            <div className='d-flex gap-2'>
                                <button className='btn btn-primary mr-2 d-flex align-items-center gap-2' onClick={handleSaveNewProduct}>
                                    <Save size={16} /> Save
                                </button>
                                <button className='btn btn-secondary d-flex align-items-center gap-2' onClick={handleCancelNewProduct}>
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

export default CreatenewProduct