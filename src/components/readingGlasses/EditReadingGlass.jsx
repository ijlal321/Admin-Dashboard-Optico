"use client"

import React, { useState, useEffect } from 'react'
import BasicAtributesForm from '../addStock/BasicAtributesForm';
import ReadingGlassVariant from './ReadingGlassVariant';
import { ValidateAllReadingGlassData } from '@/utlis/validator/readingGlassValidator';
import generateQRCode from '@/utlis/qrCodeHandler';
import CurrentStatusComponent from '../helpers/CurrentStatusComponent';
import { uploadImagesSequentially, cleanUpNewImages, cleanUpOldImages } from '@/utlis/uploadImages';

import { prepareNewReadingGlassData } from '@/utlis/readingGlassHelper';
import basicAttributesData from '@/data/readingGlass/basicAttributesData.json';




function EditReadingGlass({ readingGlassId }) {
    const [readingGlass, setReadingGlass] = useState(null);
    const [basicAttributes, setBasicAttributes] = useState(null);
    const [variants, setVariants] = useState(null);
    const [images, setImages] = useState([[]]);
    const [status, setStatus] = useState({ status: 'idle', description: "Upload status will show here" });
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        setStatus({ status: 'hide', description: "Upload status will show here" });
    }, [basicAttributes, variants]);


    // load readingGlass data from backend api
    useEffect(() => {
        const fetchReadingGlassData = async (readingGlassId) => {
            setStatus({ status: 'loading', description: 'Loading data...' });
            // fetch readingGlass data
            const result = await fetch(`/api/readingGlass/${readingGlassId}`);
            const data = await result.json();
            if (data.success) {
                setReadingGlass(data.data);
                setStatus({ status: 'info', description: "Data loaded successfully" });
            } else {
                setStatus({ status: 'error', description: `Error fetching ReadingGlass: ${data.error}` });
            }
        }
        fetchReadingGlassData(readingGlassId);
    }, [readingGlassId])

    // use readingGlass data to fill the attributes that fill form
    useEffect(() => {
        loadReadingGlassAttributes();
        const loadQRCode = async () => {
            try {
                setQrCodeUrl(await generateQRCode(readingGlass.id))
            } catch (error) {
                setStatus({ status: 'error', description: 'Error generating QR Code' });
            }
        }
        if (readingGlass) {
            loadQRCode();
        }
    }, [readingGlass])

    // load readingGlass attributes to the form
    const loadReadingGlassAttributes = () => {
        if (readingGlass) {
            setBasicAttributes({
                brand: readingGlass.brand,
                shape: readingGlass.shape,
                material: readingGlass.material,
                sex: readingGlass.sex,
                tags: readingGlass.tags,
                price: readingGlass.price,
                discount: readingGlass.discount,
            });
            setImages(readingGlass.variants.map(variant => variant.images));
            setVariants(readingGlass.variants.map(({ images, ...rest }) => rest));

        }
    }

    const handleUpdateClick = async () => {

        try {

            setStatus({ status: 'loading', description: 'Validating Data...' });

            // validate all the data
            const validationResult = ValidateAllReadingGlassData(basicAttributes, variants, images);
            if (!validationResult.isValid) {
                setStatus({ status: 'error', description: validationResult.message });
                return
            }

            // set ui to start updating data
            setStatus({ status: 'loading', description: 'Updating Images...' });

            // upload all the images
            const imagesUploadResponse = await uploadImagesSequentially(images, 'reading-glasses');
            if (!imagesUploadResponse.success) {
                setStatus({ status: 'error', description: imagesUploadResponse.message });
                return
            }
            const newImages = imagesUploadResponse.uploadedImages;

            const preparedData = await prepareNewReadingGlassData(basicAttributes, variants, newImages);
            // save the Reading Glass data
            const response = await fetch(`/api/readingGlass/${readingGlassId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preparedData),
            });

            const result = await response.json();

            if (!result.success) {
                // todo, delete only new images, which were uploaded
                const tresult = await cleanUpNewImages(readingGlass, newImages);
                // delet all that are in NewImages, but not in images
                if (tresult.unSuccessful > 0) {
                    setStatus({ status: 'finished', description: 'Error updating frame. Rolling back... Some new Images were uploaded in updated data were not removed properly.' });
                }
                else{
                    setStatus({ status: 'finished', description: 'Error updating frame. Rolling back successful' });
                }
                return;
            }
            // todo, delete images that are removed from previous images array
            const tresult = await cleanUpOldImages(readingGlass, newImages);
            // delet all that are in images, but not in newImages
            if (tresult.unSuccessful > 0) {
                setStatus({ status: 'finished', description: 'Data updated is successful, but some old images were not claned up properly.' });
            }
            const id = result.data.id;

            const qrResult = await generateQRCode(id);
            setQrCodeUrl(qrResult);
            setImages(newImages);
            setStatus({ status: 'finished', description: 'Reading Glass updated successfully' });
        } catch (error) {
            setStatus({ status: 'error', description: 'Unknown Error Updating Data' });
        }

    }

    if (!readingGlass || !basicAttributes || !variants || !images) {
        return <div>
            {status == "hide" ? "Loading..." :
            <CurrentStatusComponent status={status} setStatus={setStatus} />}
        </div>
    }

    return (
        <div className='container mt-5'>
            <BasicAtributesForm basicAttributesData={basicAttributesData} basicAttributes={basicAttributes} setBasicAttributes={setBasicAttributes} />

            <hr className="my-4" />

            <ReadingGlassVariant data={{ variants, setVariants, images, setImages }} />

            <hr className="my-4" />

            {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" />}

            <CurrentStatusComponent status={status} setStatus={setStatus} />

            <div className='d-flex mx-auto' style={{ justifyContent: "space-around" }}>
                <button className="btn btn-primary w-[25%]" onClick={handleUpdateClick}>Update</button>
                <button className="btn btn-danger w-[25%]" onClick={loadReadingGlassAttributes}>Cancel</button>
            </div>
        </div>
    )
}

export default EditReadingGlass