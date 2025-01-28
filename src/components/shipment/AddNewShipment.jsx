import React, { useEffect, useState } from 'react'
import { PlusCircle, Save, XCircle } from 'lucide-react';

import ShipmentCard from './ShipmentCard';
import { validateShipment } from '@/utlis/shipmentHelper';

function AddNewShipment({productType, setStatus}) {
    const [newShipment, setNewShipment] = useState({orderDate: '', receivedDate: '', location: '', supplier: '', cartons: 0, description: '' });
    const [isMakingNewShipment, setIsMakingNewShipment] = useState(false);

    useEffect(() => {
        setNewShipment({orderDate: '', receivedDate: '', location: '', supplier: '', cartons: 0, description: '' });
    }, [isMakingNewShipment]);

    useEffect(() => {
        setIsMakingNewShipment(false);
    }, [productType]);

    const handleCreateNewBatch = async() => {

        try{
            // validate shipment
            setStatus({ status: 'loading', description: 'Validating Shipment' });
            if (!validateShipment(newShipment)) {
                setStatus({ status: 'error', description: 'Invalid Shipment' });
                return;
            }

            setStatus({ status: 'loading', description: 'Creating Shipment' });
            const response = await fetch(`/api/${productType}-shipment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newShipment)
            });
            const data = await response.json();
            if (data.success) {
                setStatus({ status: 'successful', description: 'Shipment Created. Reload ...' });
            }
            else {
                setStatus({ status: 'error', description: `Error Creating Shipment: ${data.error}` });
            }
        }
        catch(e){
            console.error(e);
            setStatus({ status: 'error', description: e });
        }
    }

    return (
        <div>
            {!isMakingNewShipment ?
                <button className="btn btn-success d-flex gap-2 justify-content-center align-content-center" onClick={() => setIsMakingNewShipment(true)}>
                    <PlusCircle size={20} />Add New Shipment
                </button>
                :
                <>
                    <h1 style={{ fontSize: "1.5rem" }}>New Shipment</h1>
                    <ShipmentCard shipment={newShipment} setShipment={setNewShipment} readOnly={false} />
                    <div className='card-header d-flex gap-5 m-4 mb-0 align-items-center'>
                        <button className='btn btn-primary d-flex align-items-center gap-2' onClick={handleCreateNewBatch}>
                            <Save size={20} /> Save
                        </button>
                        <button className='btn btn-secondary d-flex align-items-center gap-2' onClick={() => setIsMakingNewShipment(false)}>
                            <XCircle size={20} /> Cancel
                        </button>
                    </div>
                </>
            }
        </div>
    )
}

export default AddNewShipment