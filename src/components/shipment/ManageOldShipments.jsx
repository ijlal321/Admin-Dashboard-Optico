import React, { useEffect, useState } from 'react'
import ShipmentCard from './ShipmentCard';
import { Edit, X, Save, Trash2 } from 'lucide-react';
import { validateShipment } from '@/utlis/shipmentHelper';


function ManageOldShipments({ shipments, setShipments, setStatus, productType }) {

    const [editingShipment, setEditingShipment] = useState(null);

    useEffect(() => {
        setEditingShipment(null);
    }, [shipments]);

    const handleEditSaveShipment = async () => {
        try {
            setStatus({ status: 'loading', description: 'Updating Shipment...' });
            // validate the shipment
            const validation = validateShipment(editingShipment);
            if (!validation) {
                setStatus({ status: 'error', description: 'Fill all details Properly' });
                return;
            }
            // call backend to update the shipment
            const response = await fetch(`/api/${productType}-shipment`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingShipment)
            });
            const data = await response.json();
            if (data.success) {
                setStatus({ status: 'successful', description: 'Shipment Updated Successfully' });
                setShipments(shipments.map(s => s._id == editingShipment._id ? editingShipment : s));
            }
            else {
                setStatus({ status: 'error', description: `Error Updating Data: ${data.error}` });
            }
        }
        catch (error) {
            console.error(error);
            setStatus({ status: 'error', description: error });
        }
        setEditingShipment(null);
    }

    const handleEditClick = (shipment) => {
        // if already selected , then show on window that already selected some, cancel that first
        if (editingShipment) {
            alert('Please save or cancel the current edit first');
            return;
        }
        setEditingShipment(shipment);
    }

    const handleDeleteShipment = async(shipment) => {
        // window.mesage that it would also remove all the stock of this shipment
        if (window.confirm('Are you sure you want to delete this shipment?')) {
            try {
                setStatus({ status: 'loading', description: 'Deleting Shipment...' });

                const response = await fetch(`/api/${productType}-shipment`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ _id: shipment._id })
                });
                const data = await response.json();
                if (!data.success) {
                    setStatus({ status: 'error', description: `Error Deleting Data: ${data.error}` });
                    return;
                }
                setShipments(shipments.filter(s => s._id != shipment._id));
                setStatus({ status: 'successful', description: 'Shipment Deleted Successfully' });
            } catch (error) {
                console.error(error);
                setStatus({ status: 'error', description: error });
            }
        }
    }



    return (
        <div>
            <h1 className='mb-4' style={{ fontSize: "1.8rem" }}>Manage Previous Shipments</h1>
            {editingShipment && <div className='my-3'>
                <ShipmentCard shipment={editingShipment} setShipment={setEditingShipment} readOnly={false} />
                <div className='d-flex justify-content-center gap-3 my-3'>
                    <button className='btn btn-success d-flex gap-1 justify-content-center align-items-center' onClick={handleEditSaveShipment}>
                        <Save size={16} /> Save
                    </button>
                    <button className='btn btn-secondary d-flex gap-1 justify-content-center align-items-center' onClick={() => setEditingShipment(null)}>
                        <X size={16} /> Cancel
                    </button>
                </div>
                <hr className='my-2' />
            </div>
            }
            <div className='row'>
                {shipments.map((shipment, idx) => (
                    (!editingShipment || shipment._id != editingShipment._id) && (
                        <div className='col-lg-4 col-md-6 mb-4' key={idx}>

                            {/* card header with title and buttons */}
                            <div className='card'>
                                <div className='card-header m-0 row align-items-center'>
                                    <h5 className='col-md-6'>{new Date(shipment.receivedDate).toLocaleDateString()} ; {shipment.cartons} Cartons</h5>
                                    <div className='col-md-6 d-flex gap-2 justify-content-end'>
                                        <button className='btn btn-primary' onClick={() => handleEditClick(shipment)}>
                                            <Edit size={16} />
                                        </button>
                                        <button className='btn btn-danger' onClick={() => handleDeleteShipment(shipment)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* card body */}
                                <div className='card-body'>
                                    <p>Order Date: {shipment.orderDate}</p>
                                    <p>Received Date: {shipment.receivedDate}</p>
                                    <p>Location: {shipment.location}</p>
                                    <p>Supplier: {shipment.supplier}</p>
                                    <p>Cartons: {shipment.cartons}</p>
                                    <p>Description: {shipment.description}</p>
                                </div>
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    )
}

export default ManageOldShipments