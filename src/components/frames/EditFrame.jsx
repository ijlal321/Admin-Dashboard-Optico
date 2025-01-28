"use client"

import React, { useState, useEffect } from 'react'
import BasicAtributesForm from '../addStock/BasicAtributesForm';
import FrameVariant from './FrameVariant';
import { ValidateAllFrameData } from '@/utlis/validator/frameValidator';
import generateQRCode from '@/utlis/qrCodeHandler';
import CurrentStatusComponent from '../helpers/CurrentStatusComponent';
import { uploadImagesSequentially, cleanUpNewImages, cleanUpOldImages } from '@/utlis/uploadImages';

import { prepareNewFrameData } from '@/utlis/frameHelper';
import basicAttributesData from '@/data/frame/basicAttributesData.json';



function EditFrame({ frameId }) {
    const [frame, setFrame] = useState(null);
    const [basicAttributes, setBasicAttributes] = useState(null);
    const [variants, setVariants] = useState(null);
    const [images, setImages] = useState(null);
    const [status, setStatus] = useState({ status: 'idle', description: "Upload status will show here" });
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        setStatus({ status: 'hide', description: "Upload status will show here" });
    }, [basicAttributes, variants]);


    // load frame data from backend api
    useEffect(() => {
        const fetchFrameData = async (frameId) => {
            setStatus({ status: 'loading', description: 'Loading data...' });
            // fetch frame data
            const result = await fetch(`/api/frames/${frameId}`);
            const data = await result.json();
            if (data.success) {
                setFrame(data.data);
                setStatus({ status: 'info', description: "Data loaded successfully" });
            } else {
                setStatus({ status: 'error', description: `Error fetching Frame: ${data.error}` });
            }
        }
        fetchFrameData(frameId);
    }, [frameId])

    // use frame data to fill the attributes that fill form
    useEffect(() => {
        loadFrameAttributes();
        const loadQRCode = async () => {
            try {
                setQrCodeUrl(await generateQRCode(frame.id))
            } catch (error) {
                setStatus({ status: 'error', description: 'Error generating QR Code' });
            }
        }
        if (frame) {
            loadQRCode();
        }
    }, [frame])

    // load frame attributes to the form
    const loadFrameAttributes = () => {
        if (frame) {
            setBasicAttributes({
                brand: frame.brand,
                shape: frame.shape,
                material: frame.material,
                sex: frame.sex,
                tags: frame.tags,
                price: frame.price,
                discount: frame.discount
            });
            setImages(frame.variants.map(variant => variant.images));
            setVariants(frame.variants.map(({ images, ...rest }) => rest));

        }
    }


    const handleUpdateClick = async () => {

        try {

            setStatus({ status: 'loading', description: 'validating Data...' });

            // validate all the data
            const validationResult = ValidateAllFrameData(basicAttributes, variants, images);
            if (!validationResult.isValid) {
                setStatus({ status: 'error', description: validationResult.message });
                return
            }

            // set ui to start updating data
            setStatus({ status: 'loading', description: 'Updating Images...' });

            // upload all the images
            const imagesUploadResponse = await uploadImagesSequentially(images, 'frames');
            if (!imagesUploadResponse.success) {
                setStatus({ status: 'error', description: imagesUploadResponse.message });
                return
            }
            const newImages = imagesUploadResponse.uploadedImages;

            const preparedData = await prepareNewFrameData(basicAttributes, variants, newImages);
            // save the frame data
            const response = await fetch(`/api/frames/${frameId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preparedData),
            });

            const result = await response.json();

            if (!result.success) {
                // delete only new images, which were uploaded
                const tresult = await cleanUpNewImages(frame, newImages); 
                // delet all that are in NewImages, but not in images
                if (tresult.unSuccessful > 0) {
                    setStatus({ status: 'finished', description: 'Error updating frame. Rolling back... Some new Images were uploaded in updated data were not removed properly.' });
                }
                else {
                    setStatus({ status: 'finished', description: 'Error updating frame. Rolling back successful' });
                }
                return;
            }
            // todo, delete images that are removed from previous images array
            const tresult = await cleanUpOldImages(frame, newImages);
            // delet all that are in images, but not in newImages (i.e old images)
            if (tresult.unSuccessful > 0) {
                setStatus({ status: 'finished', description: 'Data updated is successful, but some old images were not claned up properly.' });
            }
            const id = result.data.id;

            const qrResult = await generateQRCode(id);
            setQrCodeUrl(qrResult);
            setImages(newImages);
            setStatus({ status: 'finished', description: 'Frame updated successfully' });
        } catch (error) {
            setStatus({ status: 'error', description: 'Unknown Error Updating Data' });
        }

    }

    if (!frame || !basicAttributes || !variants || !images) {
        return <div>
            {status == "hide" ? "Loading..." :
            <CurrentStatusComponent status={status} setStatus={setStatus} />}
        </div>
    }

    return (
        <div className='container mt-5'>
            <BasicAtributesForm basicAttributesData={basicAttributesData} basicAttributes={basicAttributes} setBasicAttributes={setBasicAttributes} />

            <hr className="my-4" />

            <FrameVariant data={{ variants, setVariants, images, setImages }} />

            <hr className="my-4" />

            {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" />}

            <CurrentStatusComponent status={status} setStatus={setStatus} />

            <div className='d-flex mx-auto' style={{ justifyContent: "space-around" }}>
                <button className="btn btn-primary w-[25%]" onClick={handleUpdateClick}>Update</button>
                <button className="btn btn-danger w-[25%]" onClick={loadFrameAttributes}>Cancel</button>
            </div>
        </div>
    )
}

export default EditFrame