import React from 'react'
import { Trash2 } from 'lucide-react';
import { deleteImagesArray } from '@/utlis/uploadImages';
import { updateBrand } from '@/utlis/prescriptionLensHelper';

function ShowProducts({ selectedBrand, setSelectedBrand, setStatus }) {

    const handleDeleteProduct = async (product) => {
        try {
            // window ask if want to delete
            if (!window.confirm('Are you sure you want to delete this product?')) {
                return;
            }

            // deleting images
            setStatus({ status: 'loading', description: 'Deleting Images...' });
            const unSuccessful = await deleteImagesArray(product.images);
            if (unSuccessful > 0) {
                setStatus({ status: 'finished', description: 'Failed to delete images' });
                return;
            }


            setStatus({ status: 'loading', description: ' Deleting Product...' });

            const updatedBrand = { ...selectedBrand, products: selectedBrand.products.filter(p => p.id !== product.id) };
            const data = await updateBrand(updatedBrand);
            if (data.success) {
                setSelectedBrand(data.data);
                setStatus({ status: 'successful', description: 'Product deleted successfully' });
            } else {
                setStatus({ status: 'error', description: data.error });
            }

        } catch (error) {
            setStatus({ status: 'error', description: 'Failed to save new product' });
        }

    }

    const handleClickManage = (product) => {
        // navigate to /prescriptions-lens/manage-product
        window.location.href = `manage-prescription-lens-product/${selectedBrand.id}/${product.id}`;
    }


    return (
        <div>
            <h1 className='mb-4 display-6'>Products</h1>
            <div className='row'>
                {selectedBrand.products.map(product => (
                    <div key={product.id} className='card col-md-4 m-2'>
                        <div className='card-body'>
                            <button className='btn btn-danger btn-sm position-absolute' style={{ top: '10px', right: '10px' }} onClick={() => handleDeleteProduct(product)}>
                                <Trash2 size={16} />
                            </button>
                            <div className='d-flex mb-3'>
                                <h5 style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Name: </h5>
                                <h5 style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{product.name}</h5>
                            </div>
                            <h5 style={{ fontSize: '1.0rem' }}>{product.description}</h5>
                            <div className='card-images my-3'>
                                <div className='d-flex flex-wrap'>
                                    {product.images.slice(0, 2).map((image, index) => (
                                        <img key={index} src={image} alt={`${product.name} image ${index + 1}`} className='img-thumbnail' style={{ maxHeight: "200px" }} />
                                    ))}
                                </div>
                            </div>
                            <button className='btn btn-primary mt-3' onClick={() => handleClickManage(product)}>Manage</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ShowProducts