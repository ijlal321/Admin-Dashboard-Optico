"use client";

import React, { useState, useEffect, use } from 'react'
import ShowSummaryOrder from './ShowSummaryOrder';
import CurrentStatusComponent from '../helpers/CurrentStatusComponent';
import { set } from 'mongoose';



function ManageOrders() {
    const [orders, setOrders] = useState(null);
    const [status, setStatus] = useState({status:'hide', description:''});

    useEffect(() => {
        const fetchLatestOrders = async () => {
            try {
                const response = await fetch('/api/order');
                const data = await response.json();
                if (!data.success) {
                    throw new Error(data.message);
                }
                setOrders(data.data);                
            } catch (error) {
                console.log(error);
                setStatus({status:'error', description: error});
            }

        }

        fetchLatestOrders();
    }, []);

    if (!orders) {
        return <div>Loading...</div>
    }

    return (
        <div className='m-3'>
            <p>later we will have options to sort orders, etc, for now last 10 or 20 orders here</p>
            <div className='d-flex flex-wrap gap-3'>
                {orders.map((order, index) =>
                    <div key={index} className='col-12 col-md-4'>
                        <ShowSummaryOrder order={order} status={status} setStatus={setStatus}  />
                    </div>
                )}
            </div>
            <CurrentStatusComponent status={status} setStatus={setStatus} />
        </div>
    )
}

export default ManageOrders