"use client"

import React, { useState, useEffect } from 'react'
import BasicAtributesForm from '../addStock/BasicAtributesForm';
import SunglassVariant from './SunglassVariant';
import { ValidateAllSunglassData } from '@/utlis/validator/sunglassValidator';
import generateQRCode from '@/utlis/qrCodeHandler';
import CurrentStatusComponent from '../helpers/CurrentStatusComponent';
import { uploadImagesSequentially, cleanUpNewImages, cleanUpOldImages } from '@/utlis/uploadImages';

import { prepareNewSunglassData } from '@/utlis/sunglassHelper';
import basicAttributesData from '@/data/sunglass/basicAttributesData.json';


function EditSunglass({ sunglassId }) {
    const [sunglass, setSunglass] = useState(null);
    const [basicAttributes, setBasicAttributes] = useState(null);
    const [variants, setVariants] = useState(null);
    const [images, setImages] = useState([null]);
    const [status, setStatus] = useState({ status: 'idle', description: "Upload status will show here" });
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        setStatus({ status: 'hide', description: "Upload status will show here" });
    }, [basicAttributes, variants]);

    // load sunglass data from backend api
    useEffect(() => {
        const fetchSunglassData = async (sunglassId) => {
            setStatus({ status: 'loading', description: 'Loading data...' });
            // fetch sunglass data
            const result = await fetch(`/api/sunglass/${sunglassId}`);
            const data = await result.json();
            if (data.success) {
                setSunglass(data.data);
                setStatus({ status: 'info', description: "Data loaded successfully" });
            } else {
                setStatus({ status: 'error', description: `Error fetching Sunglass: ${data.error}` });
            }
        }
        fetchSunglassData(sunglassId);
    }, [sunglassId])

    // use sunglass data to fill the attributes that fill form
    useEffect(() => {
        loadSunglassAttributes();
        const loadQRCode = async () => {
            try {
                setQrCodeUrl(await generateQRCode(sunglass.id))
            } catch (error) {
                setStatus({ status: 'error', description: 'Error generating QR Code' });
            }
        }
        if (sunglass) {
            loadQRCode();
        }
    }, [sunglass])

    // load sunglass attributes to the form
    const loadSunglassAttributes = () => {
        if (sunglass) {
            setBasicAttributes({
                brand: sunglass.brand,
                shape: sunglass.shape,
                material: sunglass.material,
                sex: sunglass.sex,
                tags: sunglass.tags,
                price: sunglass.price,
                discount: sunglass.discount,
                lens_type: sunglass.lens_type,
                lens_material: sunglass.lens_material,
                prescription_possible: sunglass.prescription_possible,
                copy_type: sunglass.copy_type
            });
            setImages(sunglass.variants.map(variant => variant.images));
            setVariants(sunglass.variants.map(({ images, ...rest }) => rest));

        }
    }

    const handleUpdateClick = async () => {

        try {

            setStatus({ status: 'loading', description: 'validating Data...' });

            // validate all the data
            const validationResult = ValidateAllSunglassData(basicAttributes, variants, images);
            if (!validationResult.isValid) {
                setStatus({ status: 'error', description: validationResult.message });
                return
            }

            // set ui to start updating data
            setStatus({ status: 'loading', description: 'Updating Images...' });

            // upload all the images
            const imagesUploadResponse = await uploadImagesSequentially(images, 'sunglass');
            if (!imagesUploadResponse.success) {
                setStatus({ status: 'error', description: imagesUploadResponse.message });
                return
            }
            const newImages = imagesUploadResponse.uploadedImages;

            const preparedData = await prepareNewSunglassData(basicAttributes, variants, newImages);
            // save the sunglass data
            const response = await fetch(`/api/sunglass/${sunglassId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preparedData),
            });

            const result = await response.json();

            if (!result.success) {
                // delete only new images, which were uploaded
                const tresult = await cleanUpNewImages(sunglass, newImages); 
                // delet all that are in NewImages, but not in images
                if (tresult.unSuccessful > 0) {
                    setStatus({ status: 'finished', description: 'Error updating Sunglass. Rolling back... Some new Images were uploaded in updated data were not removed properly.' });
                }
                else{
                    setStatus({ status: 'finished', description: 'Error updating Sunglass. Rolling back successful' });
                }
                return;
            }
            const tresult = await cleanUpOldImages(sunglass, newImages);
            // delet all that are in images, but not in newImages (i.e old images)
            if (tresult.unSuccessful > 0) {
                setStatus({ status: 'idle', description: 'Data updated is successful, but some old images were not claned up properly.' });
            }
            const id = result.data.id;

            const qrResult = await generateQRCode(id);
            setQrCodeUrl(qrResult);
            setImages(newImages);
            setStatus({ status: 'finished', description: 'Sunglass updated successfully' });
        } catch (error) {
            setStatus({ status: 'error', description: `Unknown Error Updating Data: ${error}` });
            console.error('Error Updating Sunglass:', error);
        }

    }

    if (!sunglass || !basicAttributes || !variants || !images) {
        return <CurrentStatusComponent status={status} setStatus={setStatus} />
    }


    return (
        <div className='container mt-5'>
            <BasicAtributesForm basicAttributesData={basicAttributesData} basicAttributes={basicAttributes} setBasicAttributes={setBasicAttributes} />
            <button onClick={()=>console.log(basicAttributes)}>Check</button>
            <hr className="my-4" />

            <SunglassVariant data={{ variants, setVariants, images, setImages }} />

            <hr className="my-4" />

            {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" />}

            <CurrentStatusComponent status={status} setStatus={setStatus} />

            <div className='d-flex mx-auto' style={{ justifyContent: "space-around" }}>
                <button className="btn btn-primary w-[25%]" onClick={handleUpdateClick}>Update</button>
                <button className="btn btn-danger w-[25%]" onClick={loadSunglassAttributes}>Cancel</button>
            </div>
        </div>
    )
}

export default EditSunglass