import React, { use, useEffect, useState } from 'react'
import OrderCard from './OrderCard'
import CurrentStatusComponent from '../helpers/CurrentStatusComponent';
import CustomerForm from '../customers/CustomerForm';
import { Card } from 'react-bootstrap';
import PrescriptionForm from '../prescriptions/PrescriptionForm';


function ManageSingleOrderDetailed({ orderId }) {
    const [order, setOrder] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [prescription, setPrescription] = useState(null);
    const [status, setStatus] = useState({ status: 'hide', description: '' });

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setStatus({ status: 'loading', description: 'Fetching order details' });
                const response = await fetch(`/api/order/${orderId}`);
                const data = await response.json();
                if (!data.success) {
                    throw new Error(data.message);
                }
                setOrder(data.data);
                setStatus({ status: 'successful', description: 'Order details fetched successfully' });
            } catch (error) {
                console.log(error);
                setStatus({ status: 'error', description: error });
            }
        }
        fetchOrderDetails();
    }, [])

    // fetch customer details
    useEffect(() => {
        const fetchCustomerDetails = async () => {
            try {
                setStatus({ status: 'loading', description: 'Fetching customer details' });
                const response = await fetch(`/api/customer/${order.customerId}`);
                const data = await response.json();
                if (!data.success) {
                    throw new Error(data.message);
                }
                setCustomer(data.data);
                setStatus({ status: 'successful', description: 'Details fetched successfully' });
                setPrescription(data.data.prescriptions.find(prescription => prescription.id == order.prescriptionId));
            } catch (error) {
                console.log(error);
                setStatus({ status: 'error', description: error });
            }
        }
        if (order && order.customerId) {
            fetchCustomerDetails();
        }
    }, [order])

    if (!order) {
        return <div className='m-4'>Loading...</div>
    }

    return (
        <div className='m-4'>
        <div className='mb-4'>
            {customer &&
                <Card className='m-4 p-4'>
                    <CustomerForm customer={customer} setCustomer={setCustomer} isEditable={false} />
                </Card>
            }
            {prescription && 
            <PrescriptionForm prescription={prescription} setPrescription={setPrescription} isEditable={false} />
            }
        </div>
            {order && <OrderCard order={order} setOrder={setOrder} status={status} setStatus={setStatus} />}
            <CurrentStatusComponent status={status} setStatus={setStatus} />
        </div >
    )
}

export default ManageSingleOrderDetailed