"use client"

import React, { useState, useEffect } from 'react'
import BasicAtributesForm from '../addStock/BasicAtributesForm';
import FrameVariant from './FrameVariant';
import { ValidateAllFrameData } from '@/utlis/validator/frameValidator';
import generateQRCode from '@/utlis/qrCodeHandler';
import CurrentStatusComponent from '../helpers/CurrentStatusComponent';
import { uploadImagesSequentially, deleteImagesArray } from '@/utlis/uploadImages';

import { prepareNewFrameData } from '@/utlis/frameHelper';
import basicAttributesData from '@/data/frame/basicAttributesData.json';


function AddNewFrame() {

    const [basicAttributes, setBasicAttributes] = useState({});
    const [variants, setVariants] = useState([
        { color: [], inventory: [{ stock: 0, location: "" }] }
    ]);
    const [images, setImages] = useState([[]]);
    const [status, setStatus] = useState({ status: 'idle', description: "Upload status will show here" });
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        setStatus({ status: 'hide', description: "Upload status will show here" });
    }, [basicAttributes, variants]);





    // save frame
    const handleSaveFrame = async () => {
        if (qrCodeUrl){
            setStatus({ status: 'finished', description: 'Frame already saved. Refresh to add more.' });
            return;
        }
        try {

            setStatus({ status: 'loading', description: 'Validating Data...' });
            
            // validate all the data
            const validationResult = ValidateAllFrameData(basicAttributes, variants, images);
            if (!validationResult.isValid) {
                setStatus({ status: 'error', description: validationResult.message });
                return
            }

            // set ui to start saving data
            setStatus({ status: 'saving', description: 'Saving Images...' });

            // upload all the images
            const imagesUploadResponse = await uploadImagesSequentially(images, 'frames');
            if (!imagesUploadResponse.success) {
                setStatus({ status: 'error', description: imagesUploadResponse.message });
                return
            }
            const newImages = imagesUploadResponse.uploadedImages;

            const preparedData = await prepareNewFrameData(basicAttributes, variants, newImages);
            // save the frame data
            const response = await fetch('/api/frames', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preparedData),
            });

            const result = await response.json();

            if (!result.success) {
                // delete images, which were uploaded
                const result = await deleteImagesArray(newImages);
                if (result !== 0) {
                    setStatus({ status: 'error', description: `Error saving new Frame. Some images not cleaned up properly x${result}.` });
                }
                else{
                    setStatus({ status: 'error', description: 'Error saving new Frame. Cleanup completed properly.' });
                }
                return;
            }

            const id = result.data.id;

            const qrResult = await generateQRCode(id);
            setQrCodeUrl(qrResult);
            setImages(newImages);
            setStatus({ status: 'successful', description: 'Frame saved successfully. Refresh to add more.' });
        } catch (error) {
            setStatus({ status: 'error', description: 'Unknown Error Saving Data' });
        }

    }

    return (
        <div className='container mt-5'>
            <BasicAtributesForm basicAttributesData={basicAttributesData} basicAttributes={basicAttributes} setBasicAttributes={setBasicAttributes} />
            <hr className="my-4" />

            <FrameVariant data={{ variants, setVariants, images, setImages }} />

            <hr className="my-4" />

            {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" />}

            <CurrentStatusComponent status={status} setStatus={setStatus} />

            <button className="btn btn-primary" onClick={handleSaveFrame}>Submit</button>

        </div>
    )
}

export default AddNewFrame