"use client"

import React, { useEffect, useState } from 'react'
import BatchForm from '../helpers/BatchForm'
import CurrentStatusComponent from '../helpers/CurrentStatusComponent';
import ContactLensForm from './ContactLensForm';
import { ContantLensValidation } from '@/utlis/formValidate';


function AddNewContactLens() {
    const [batchInfo, setBatchInfo] = useState({id:1});
    const [lens, setLens] = useState({
        brand: '',
        life: '',
        expiryDate: '',
        tags: [],
        description: '',
        colors: [
          {
            name: '',
            tags: [],
            planoPrice: '',
            powerPrice: '',
            inventory: [{ power: '0.00', stock: '0' }]
          }
        ]
      })
    const [images, setImages] = useState([[]]);
    const [status, setStatus] = useState({ status: 'idle', description: "Upload status will show here" });

    const handleSaveContactLens = async (e) => {
        e.preventDefault();
        
        try {
            // validate colors must be more than 1
            if (!ContantLensValidation(lens)) {
                setStatus({ status: 'error', description: 'Please add at least one color' });
                return;
            }
        } catch (error) {
            throw(error);
        }
        // save the frame data
        try {
            setStatus({ status: 'loading', description: 'Submitting data...' });
        
            // dummy waiting for 2 seconds
            await new Promise(resolve => setTimeout(resolve, 2000));
        
            // throw({ type: 'upload' });

            // const result = saveFrameData();
            const result = { id: '123', qrCodeLink: "123" };
            if (result.error) {
                throw({ type: 'save' });
            } else {
                const id = result.id;
            }
            setStatus({ status: 'successful', description: 'Frame saved successfully' });
            console.log('Submitting lens:', lens)
            console.log('Batch Info:', batchInfo)
        } catch (error) {
            if (error.type === 'upload') {
                setStatus({ status: 'error', description: 'Error uploading image. Frame saved successfully' });
            }
            else if (error.type === 'save') {
                setStatus({ status: 'error', description: 'Error saving frame' });
            }
        }

    }

    useEffect(()=>{
        setStatus({ status: 'idle', description: "Upload status will show here" });
    }, [lens, images]);

    return (
        <div className='container mt-5'>
            {!batchInfo.id && <BatchForm batchInfo={batchInfo} setBatchInfo={setBatchInfo} />}
            {batchInfo.id && <>

                <ContactLensForm lens={lens} setLens={setLens} images={images} setImages={setImages} handleSaveContactLens={handleSaveContactLens}  />

                <CurrentStatusComponent status={status} setStatus={setStatus} />

                {/* <button className="btn btn-primary" onClick={handleSaveContactLens}>Submit</button> */}

            </>}
        </div>
    )
}

export default AddNewContactLens