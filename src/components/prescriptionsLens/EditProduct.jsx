import React, { useState } from 'react';
import { Trash2, PlusCircle, Save, XCircle } from 'lucide-react';
import GenericImagesForm2 from '../addStock/GenericImagesForm2';
import { CodeSlash } from 'react-bootstrap-icons';
import { updateBrand } from '@/utlis/prescriptionLensHelper';
import { deleteImagesArray, uploadImagesArray } from '@/utlis/uploadImages';
import { set } from 'mongoose';


function CreatenewProduct({ brand, product, status, setStatus }) {
    const [newProduct, setNewProduct] = useState(product);
    const [newImages, setNewImages] = useState(product.images); // need this because genericImagesForm2 needs a new variable where it makes all the changes to images, 
    // then we will later set the newImages to images, when user clicks save.
    // also its empty initlially, bcz its a new product
    const [isEditing, setIsEditing] = useState(false);

    const handleDeleteProduct = async () => {
        try {
            if (window.confirm('Are you sure you want to delete this product?')) {

                // delete images from db
                setStatus({ status: 'loading', description: 'Deleting product images...' });
                const unSuccessful = await deleteImagesArray(product.images);
                if (unSuccessful > 0) {
                    throw new Error(`Failed to delete ${unSuccessful} images. try again`);
                }

                setStatus({ status: 'loading', description: 'Deleting product...' });
                // filter product from brands
                const updatedBrand = { ...brand, products: brand.products.filter(p => p.id !== product.id) };
                const data = await updateBrand(updatedBrand);
                if (data.success) {
                    setStatus({ status: 'successful', description: 'Product deleted successfully' });
                } else {
                    throw new Error(data.error);
                }

            }
        } catch (error) {
            setStatus({ status: 'error', description: error });
            console.error('Error deleting product:', error);
        }
    }

    const handleProductUpdate = async () => {


        try {
            // update new images on server
            setStatus({ status: 'loading', description: 'Updating images...' });
            let data = await uploadImagesArray(newImages, "prescriptionLens");
            if (!data.success) {
                throw new Error(`Failed to upload images. Reason: ${data.error}`);
            }
            const newUploadedImages = data.uploadedImages;

            // update product on server
            const updatedBrand = { ...brand, products: brand.products.map(p => p.id === product.id ? { ...p, ...newProduct, images: newUploadedImages } : p) };
            data = await updateBrand(updatedBrand);
            if (!data.success) {
                throw new Error(data.error);
            }

            // delete old images from server
            setStatus({ status: 'loading', description: 'Deleting old images...' });
            const toBeDelete = product.images.filter(img => !newUploadedImages.includes(img));
            const unSuccessful = await deleteImagesArray(toBeDelete);
            if (unSuccessful > 0) {
                throw new Error(`Data saved, but Failed to delete ${unSuccessful} old images. try again`);
            }
            setIsEditing(false);
            setStatus({ status: 'finished', description: 'Product updated successfully' });
        } catch (error) {
            setStatus({ status: 'error', description: error });
            console.error('Error updating product:', error);
        }
    }

    const handleCancelUpdate = () => {
        setNewProduct(product);
        setNewImages(product.images);
        setIsEditing(false);
    }

    return (
        <div className='card m-7'>
            {!isEditing ? (
                <div className='d-flex gap-5 m-4 mb-0 justify-space-between'>
                    <button className='btn btn-warning d-flex align-items-center gap-2' onClick={() => setIsEditing(true)}>
                        <CodeSlash size={16} /> Edit Product
                    </button>
                    <button className='btn btn-danger d-flex align-items-center gap-2' onClick={handleDeleteProduct}>
                        <Trash2 size={16} /> Delete Product
                    </button>
                </div>
            ) :
                <div className='d-flex gap-5 m-4 mb-0 justify-space-between'>
                    <button className='btn btn-primary d-flex align-items-center gap-2' onClick={handleProductUpdate}>
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
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            readOnly={!isEditing}
                        />
                    </div>
                    <div className='mb-3'>
                        <label>Description</label>
                        <input
                            type='text'
                            className='form-control'
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            readOnly={!isEditing}
                        />
                    </div>
                </div>
                <div className='col-md-6'>
                    <GenericImagesForm2 newImages={newImages} setNewImages={setNewImages} isEditable={isEditing} />
                </div>
            </div>
        </div>
    );
}

export default CreatenewProduct