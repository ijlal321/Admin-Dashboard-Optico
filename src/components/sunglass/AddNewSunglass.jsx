"use client"

import React, { useState, useEffect } from 'react'
import BasicAtributesForm from '../addStock/BasicAtributesForm';
import SunglassVariant from './SunglassVariant';
import { ValidateAllSunglassData } from '@/utlis/validator/sunglassValidator';
import generateQRCode from '@/utlis/qrCodeHandler';
import CurrentStatusComponent from '../helpers/CurrentStatusComponent';

import { uploadImagesSequentially, deleteImagesArray } from '@/utlis/uploadImages';

import { prepareNewSunglassData } from '@/utlis/sunglassHelper';
import basicAttributesData from '@/data/sunglass/basicAttributesData.json';



function AddNewSunglass() {

    const [basicAttributes, setBasicAttributes] = useState({});
    const [variants, setVariants] = useState([
        { color: [], lensColor:[], inventory: [{ stock: 0, location: "" }] }
    ]);
    const [images, setImages] = useState([[]]);
    const [status, setStatus] = useState({ status: 'idle', description: "Upload status will show here" });
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        setStatus({ status: 'hide', description: "Upload status will show here" });
    }, [basicAttributes, variants]);



    const handleSaveSunglass = async () => {
        if (qrCodeUrl){
            setStatus({ status: 'finished', description: 'Sunglasss already saved. Refresh to add more.' });
            return;
        }
         try {
            setStatus({ status: 'loading', description: 'Validating Data...' });

            // validate all the data
            const validationResult = await ValidateAllSunglassData(basicAttributes, variants, images);
            if (!validationResult.isValid) {
                setStatus({ status: 'error', description: validationResult.message });
                return
            }

            // set ui to start saving data
            setStatus({ status: 'saving', description: 'Saving Images...' });

            // upload all the images
            const imagesUploadResponse = await uploadImagesSequentially(images, 'sunglass');
            if (!imagesUploadResponse.success) {
                setStatus({ status: 'error', description: imagesUploadResponse.message });
                return
            }
            const newImages = imagesUploadResponse.uploadedImages;

            const preparedData = await prepareNewSunglassData(basicAttributes, variants, newImages);
            if (!preparedData) {
                setStatus({ status: 'error', description: 'Error preparing data' });
                return;
            }

            // save the sunglass data
            const response = await fetch('/api/sunglass', {
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
                    setStatus({ status: 'error', description: `Error saving new Reading Glass. Some images not cleaned up properly x${result}.` });
                }
                else{
                    setStatus({ status: 'error', description: 'Error saving new Reading Glass. Cleanup completed properly.' });
                }
                return;
            }

            const id = result.data.id;

            const qrResult = await generateQRCode(id);
            setQrCodeUrl(qrResult);
            setImages(newImages);
            setStatus({ status: 'successful', description: 'Sunglass saved successfully. Refresh to add more.' });
        } catch (error) {
            setStatus({ status: 'error', description: 'Unknown Error Saving Data' });
        }

    }

    return (
        <div className='container mt-5'>
            <BasicAtributesForm basicAttributesData={basicAttributesData} basicAttributes={basicAttributes} setBasicAttributes={setBasicAttributes} />

            <hr className="my-4" />

            <SunglassVariant data={{ variants, setVariants, images, setImages }} />

            <hr className="my-4" />

            {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" />}
            
            <CurrentStatusComponent status={status} setStatus={setStatus} />
            
            <button className="btn btn-primary" onClick={handleSaveSunglass}>Submit</button>

        </div>
    )
}

export default AddNewSunglass