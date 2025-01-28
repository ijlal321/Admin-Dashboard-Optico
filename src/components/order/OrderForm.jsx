"use client";

import React, { useState, useEffect } from 'react'
import { Card } from 'react-bootstrap';
import { PlusCircle } from 'lucide-react';

import ItemCard from './item/ItemCard';

import orderStatuses from '@/data/order/orderStatus.json'
import { v4 as uuidv4 } from 'uuid';

import CurrentStatusComponent from '../helpers/CurrentStatusComponent';

function OrderForm({ order, setOrder, isEditable }) {
    const [status, setStatus] = React.useState({status: 'hide', description: ''});
    const [contactLensData, setContactLensData] = useState(null);

    useEffect(() => {
        const loadContactLensData = async () => {
            try {
                const response = await fetch(`/api/contactLens`);
                const data = await response.json();
                if (!data.success) {
                    setStatus({ status: 'error', description: "Contact lens not found" });
                    console.log(data.error);
                    setContactLensData(null);
                    return;
                }
                setContactLensData(data.data);
            } catch (error) {
                console.log(error);
                setStatus({ status: 'error', description: "Error loading contact lens" });
                
            }
        }
        loadContactLensData();
    }, []);

    const updateOrderItem = (item) => {
        // api call + remove from UI here, 
        if (item.delete) {
            // remove item from order with id as item.id
            const filteredItems = order.items.filter(orderItem => orderItem.id != item.id);
            setOrder({ ...order, items: filteredItems });
            return;
        }
        const updatedItems = order.items.map((orderItem) => {
            if (orderItem.id === item.id) {
                return item;
            }
            return orderItem;
        });
        setOrder({ ...order, items: updatedItems });
    }
    const AddNewFrame = () => {
        const newFrame = {
            id: uuidv4(),
            itemType: "Prescription Glasses",
            itemId: "",
            variantId: "",
            inventoryId: "",
            lensType: "",
            framePrice: 0,
            lensPrice: 0,
            description: ""
        }
        setOrder({ ...order, items: [...order.items, newFrame] });
    }

    const AddNewSunglass = () => {
        const newSunglass = {
            id: uuidv4(),
            itemType: "Sunglass",
            itemId: "",
            variantId: "",
            inventoryId: "",
            customLens: false,
            sunglassPrice: 0,
            lensPrice: 0,
            lensType: "",
            description: ""
        }
        setOrder({ ...order, items: [...order.items, newSunglass] });
    }

    const AddNewContactLens = () => {
        const newContactLens = {
            id: uuidv4(),
            itemType: "Contact Lens",
            brandId: "",
            colorId: "",
            power: "0.00",
            kit: "",
            price: 0,
            quantity: 0,
            description: ""
        }
        setOrder({ ...order, items: [...order.items, newContactLens] });
    }

    const AddNewReadingGlass = () => {
        const newReadingGlass = {
            id: uuidv4(),
            itemType: "Reading Glasses",
            itemId: "",
            variantId: "",
            inventoryId: "",
            price: 0,
            description: ""
        }
        setOrder({ ...order, items: [...order.items, newReadingGlass] });
    }

    const AddNewOther = () => {
        const newOther = {
            id: uuidv4(),
            itemType: "Other",
            description: "",
            price: 0
        }
        setOrder({ ...order, items: [...order.items, newOther] });
    }



    return (
        <div className='row gap-4 w-[90%] mx-auto'>
            <div className='col-md-5'>
                <div className='input-group'>
                    <span className='input-group-text'>Order Number</span>
                    <input type="text" className='form-control' onChange={(e) => setOrder({ ...order, orderNumber: e.target.value })} value={order.orderNumber} disabled={!isEditable} placeholder="Order Number" />
                </div>
            </div>
            {/* <div className='col-md-5'>
                <div className='input-group'>
                    <span className='input-group-text'>Delivery Date</span>
                    <input type="date" className='form-control' onChange={(e) => setOrder({ ...order, deliveryDate: e.target.value })} value={order.deliveryDate.toISOString().split('T')[0]} disabled={!isEditable} placeholder="Delivery Date" />
                </div>
            </div> */}
            <div className='col-md-5'>
                <div className='input-group'>
                    <span className='input-group-text'>Status</span>
                    <select className='form-control' onChange={(e) => setOrder({ ...order, status: e.target.value })} value={order.status} disabled={!isEditable}>
                        {orderStatuses.map((status, index) => (
                            <option key={index} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>

            {isEditable &&
                <div className='d-flex gap-4 flex-wrap'>
                    <button className='btn btn-success d-flex gap-2' onClick={AddNewFrame}><PlusCircle />Add New Prescription Glasses</button>
                    <button className='btn btn-success d-flex gap-2' onClick={AddNewSunglass}><PlusCircle />Add New Sunglass</button>
                    <button className='btn btn-success d-flex gap-2' onClick={AddNewContactLens}><PlusCircle />Add New ContactLens</button>
                    <button className='btn btn-success d-flex gap-2' onClick={AddNewReadingGlass}><PlusCircle />Add New ReadingGlass</button>
                    <button className='btn btn-success d-flex gap-2' onClick={AddNewOther}><PlusCircle />Add New Other</button>
                </div>
            }

            {order.items.map((item, index) => (
                <ItemCard key={index} item={item} setItem={updateOrderItem} isEditable={isEditable} status={status} setStatus={setStatus} contactLensData={contactLensData} />
            ))}

            <CurrentStatusComponent status={status} setStatus={setStatus} />
        </div>
    )
}

export default OrderForm
