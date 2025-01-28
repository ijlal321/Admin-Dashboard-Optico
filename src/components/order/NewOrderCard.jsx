"use client";

import React, { useState, useEffect } from 'react'
import { Card } from 'react-bootstrap';
import OrderForm from './OrderForm';
import { Button } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import CurrentStatusComponent from '../helpers/CurrentStatusComponent';
import { validateNewOrder } from '@/utlis/orderHelper';
import OrderStatus from '@/data/order/orderStatus.json'
import { updateBoughtProductData } from '@/utlis/orderHelper';

const newOrder = {
    orderNumber: "",
    customerId: "",
    prescriptionId: "",
    orderDate: new Date(),
    deliveryDate: new Date(),
    status: OrderStatus[0],
    items: []
}


function NewOrderCard({ customerId, prescriptionId }) {
    const [status, setStatus] = useState({ status: 'hide', description: '' });
    const [currentOrder, setCurrentOrder] = useState(newOrder);
    // this is like the head, we will always change it when saving and wont touch the order from parent.
    const [editing, setEditing] = useState(true);

    useEffect(() => {
        setCurrentOrder({
            ...currentOrder,
            customerId: customerId,
            prescriptionId: prescriptionId
        })
    }, [customerId, prescriptionId])

    const handleSaveClick = async () => {

        try {
            let toBeSavedOrder = { ...currentOrder }; // making in case we need to make some changesm like delivery date and status below

            const validateResult = validateNewOrder(toBeSavedOrder);
            if (!validateResult.success) {
                setStatus({ status: 'error', description: validateResult.error });
                return;
            }
            // if status is delivered, then mark deliver date as today
            if (toBeSavedOrder.status.toLowerCase() === 'delivered') {
                toBeSavedOrder.deliveryDate = new Date();
            }

            setStatus({ status: 'loading', description: 'Saving order' });
            console.log(toBeSavedOrder);
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(toBeSavedOrder)
            });
            const data = await response.json();
            if (!data.success) {
                console.log(data);  
                setStatus({ status: 'error', description: data.error });
                return;
            }
            console.log(data);
            setStatus({ status: 'successful', description: 'Order saved successfully' });
            setEditing(false);
        } catch (error) {
            console.log(error);
            setStatus({ status: 'error', description: 'Error saving order' });
        }
    }


    return (
        <Card>
            <Card.Header className='d-flex justify-content-between align-items-center'>
                <h3>Creating New Order</h3>

                {/* button for saving new order*/}
                { editing && <Button variant="success" onClick={handleSaveClick}>Save</Button>}

            </Card.Header>
            <Card.Body>

                <OrderForm order={currentOrder} setOrder={setCurrentOrder} isEditable={editing} />
            </Card.Body>
            <CurrentStatusComponent status={status} setStatus={setStatus} />
        </Card>
    )
}

export default NewOrderCard