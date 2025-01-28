"use client";

import React, { useEffect, useState } from 'react'
import AddNewShipment from './AddNewShipment';
import ManageOldShipments from './ManageOldShipments';
import CurrentStatusComponent from '../helpers/CurrentStatusComponent';
import { formatAllShipmentDates, validateShipment } from '@/utlis/shipmentHelper';


function ManageShipments() {
    const [status, setStatus] = useState({ status: 'hide', description: '' });
    const [shipments, setShipments] = useState(null);
    const [productType, setProductType] = useState("prescription-lens");


    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await fetch(`/api/${productType}-shipment`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (data.success) {
                    const formattedDateShipments = formatAllShipmentDates(data.data);
                    setShipments(formattedDateShipments);
                    console.log('Shipments:', formattedDateShipments);
                    setStatus({ status: 'idle', description: 'Loaded Successfully' });
                }
                else {
                    setStatus({ status: 'error', description: `Error Loading Data: ${data.error}` });
                }

            } catch (e) {
                console.error(e);
                setStatus({ status: 'error', description: e });
            }
        }

        fetchData();
    }, [productType]);

    return (
        <div className='container mt-5 d-flex flex-column align-items-center'>
            <CurrentStatusComponent status={status} setStatus={setStatus} />
            <div className="btn-group w-[80%] mb-4" role="group" aria-label="Lens type selection">
                <button type="button" className={productType == "prescription-lens" ? "btn btn-dark" : "btn btn-outline-dark"} onClick={() => setProductType("prescription-lens")}>Prescription Lens</button>
                <button type="button" className={productType == "contact-lens" ? "btn btn-dark" : "btn btn-outline-dark"} onClick={() => setProductType("contact-lens")}>Contact Lens</button>
            </div>

            <hr className='my-5' style={{ width: "100%" }} />
            {shipments ? <>
                <AddNewShipment productType={productType} setStatus={setStatus} />

                <hr className='my-5 w-[100%]' />

                <ManageOldShipments shipments={shipments} setShipments={setShipments} productType={productType} setStatus={setStatus} />
            </> : productType ? <h3>Loading...</h3> : <p>Select a product</p>}

        </div>

    )
}

export default ManageShipments