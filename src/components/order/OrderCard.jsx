import React, { useState, useEffect } from 'react'
import { Card } from 'react-bootstrap';
import OrderForm from './OrderForm';
import { Button } from 'react-bootstrap';

const dummyOrders = [
    {
        id: 1,
        orderNumber: "12345", // from physical store
        customerId: "cust001",
        prescriptionId: "presc001",
        orderDate: new Date(),
        deliveryDate: new Date(),
        status: "Pending",
        items: [
            {
                id: "item001",
                itemType: "Sunglass",
                itemId: "1",
                variantId: "1",
                inventoryId: "1",
                customLens: true,
                sunglassPrice: 100,
                lensPrice: 50,
                lensType: "Polarized",
                description: "Polarized Sunglasses"
            },
            {
                id: "item002",
                itemType: "Prescription Glasses",
                itemId: "prescGlasses001",
                variantId: "var002",
                inventoryId: "1",
                lensType: "Single Vision",
                framePrice: 150,
                lensPrice: 75,
                description: "Blue light blocking glasses"
            },
            {
                id: "item003",
                itemType: "Contact Lens",
                brandId: "1",
                colorId: "1",
                batchId: "1",
                inventoryId: "1",
                kit: "Monthly",
                price: 60,
                quantity: 2,
                description: "Monthly disposable contact lenses"
            },
            {
                id: "1",
                itemType: "Reading Glasses",
                itemId: "1",
                variantId: "1",
                inventoryId:"1",
                price: 50,
                description: "Reading glasses blue"
            },
            {
                id: "item005",
                itemType: "Other",
                description: "Cleaning Kit",
                price: 20
            }
        ]
    }
]

function OrderCard({order, setOrder, status, setStatus}) {

    const [currentOrder, setCurrentOrder] = useState(order); 
    // this is like the head, we will always change it when saving and wont touch the order from parent.
    const [editing, setEditing] = useState(false);

    const handleDeleteOrder = () => {
        console.log('Delete order');
    }

    const handleSaveClick = () => {
        console.log('Save order');
        setEditing(false);
    }

    const handleEditCancel = () => {
        setCurrentOrder(order);
        setEditing(false);
    }   

    const handleOrderStatusUpdate = async() => {
        try {
            setStatus({ status: 'loading', description: 'Updating order status' });
            const updatedOrder = { ...currentOrder, status: 'Delivered', deliveryDate: new Date() };    
            const response = await fetch(`/api/order`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedOrder)
            });
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.error);
            }
            setOrder(updatedOrder);
            setStatus({ status: 'successful', description: 'Order status updated successfully' });
        } catch (error) {
            console.log(error);
            setStatus({ status: 'error', description: error });
        }

    }



    return (
        <Card>
            <Card.Header className='d-flex justify-content-between align-items-center'>
                <h3 style={{fontSize:"18px"}}>Order Date: {currentOrder.orderDate ? new Date(currentOrder.orderDate).toLocaleDateString() : 'N/A'}</h3>
                {order.status.toLowerCase() == 'delivered' ?
                    <h3 style={{fontSize:"18px"}}>Dekivery Date: {currentOrder.deliveryDate ? new Date(currentOrder.deliveryDate).toLocaleDateString() : 'N/A'}</h3>
                : <button className='btn btn-success' onClick={handleOrderStatusUpdate}>Mark Delivered</button>
                }

                {/* give button  for edit and delete if not editing, cancel and save if editing, use lucid react */}
                {/* {!editing ? (
                    <div className='d-flex gap-4'>
                        <Button variant="primary" onClick={() => setEditing(true)}>Edit</Button>
                        <Button variant="danger" onClick={handleDeleteOrder}>Delete</Button>
                    </div>
                ) : (
                    <div className='d-flex gap-4'>
                        <Button variant="success" onClick={handleSaveClick}>Save</Button>
                        <Button variant="secondary" onClick={handleEditCancel}>Cancel</Button>
                    </div>
                )} */}
            </Card.Header>
            <Card.Body>

                <OrderForm order={currentOrder} setOrder={setCurrentOrder} isEditable={editing} />
            </Card.Body>
        </Card>
    )
}

export default OrderCard