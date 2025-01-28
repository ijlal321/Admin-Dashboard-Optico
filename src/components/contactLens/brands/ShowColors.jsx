import React from 'react'
import { Trash2 } from 'lucide-react';
import { deleteImagesArray } from '@/utlis/uploadImages';
import { updateBrand } from '@/utlis/contactLensHelper';

function ShowColors({ selectedBrand, setSelectedBrand, setStatus }) {

    const handleDeleteColor = async (color) => {
        try {
            // window ask if want to delete
            if (!window.confirm('Are you sure you want to delete this color?')) {
                return;
            }

            // deleting images
            setStatus({ status: 'loading', description: 'Deleting Images...' });
            const unSuccessful = await deleteImagesArray(color.images);
            if (unSuccessful > 0) {
                setStatus({ status: 'finished', description: 'Failed to delete images' });
                return;
            }


            setStatus({ status: 'loading', description: ' Deleting Color...' });

            const updatedBrand = { ...selectedBrand, colors: selectedBrand.colors.filter(p => p.id !== color.id) };
            const data = await updateBrand(updatedBrand);
            if (data.success) {
                setSelectedBrand(data.data);
                setStatus({ status: 'successful', description: 'Color deleted successfully' });
            } else {
                setStatus({ status: 'error', description: data.error });
            }

        } catch (error) {
            setStatus({ status: 'error', description: 'Failed to save new color' });
        }

    }

    const handleClickManage = (color) => {
        // navigate to /prescriptions-lens/manage-color
        window.location.href = `manage-contact-lens/color/${selectedBrand.id}/${color.id}`;
    }


    return (
        <div>
            <h1 className='mb-4 display-6'>Colors</h1>
            <div className='row'>
                {selectedBrand.colors.map(color => (
                    <div key={color.id} className='card col-md-5 m-2'>
                        <div className='card-body'>
                            <button className='btn btn-danger btn-sm position-absolute' style={{ top: '10px', right: '10px' }} onClick={() => handleDeleteColor(color)}>
                                <Trash2 size={16} />
                            </button>
                            <h5 className='my-2' style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{color.name}</h5>
                            <h5 className='my-2' style={{ fontSize: '1.2rem' }}>Life Time: {color.lifeTime}</h5>
                            <h5 className='my-2' style={{ fontSize: '1.2rem' }}>Tags: {color.colorTags.join(', ')}</h5>
                            <h5 className='my-2' style={{ fontSize: '1.2rem' }}>Plano Price: {color.planoPrice}</h5>
                            <h5 className='my-2' style={{ fontSize: '1.2rem' }}>Power Price: {color.powerPrice}</h5>
                            <div className='card-images my-3'>
                                <div className='d-flex flex-wrap'>
                                    {color.images.slice(0, 2).map((image, index) => (
                                        <img key={index} src={image} alt={`${color.name} image ${index + 1}`} className='img-thumbnail' style={{ maxHeight: "200px" }} />
                                    ))}
                                </div>
                            </div>
                            <button className='btn btn-primary mt-3' onClick={() => handleClickManage(color)}>Manage</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ShowColors