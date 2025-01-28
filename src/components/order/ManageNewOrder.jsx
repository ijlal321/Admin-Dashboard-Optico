"use client";

import React, { useEffect, useState } from 'react'
import LoadCustomer from '../customers/LoadCustomer';
import EditCustomer from '../customers/EditCustomer';
import ManagePrescriptions from '../prescriptions/ManagePrescriptions';
import AddNewPrescription from '../prescriptions/AddNewPrescription';
import EditablePrescriptionCard from '../prescriptions/EditablePrescriptionCard';
import CurrentStatusComponent from '../helpers/CurrentStatusComponent';
import { updateCustomer } from '@/utlis/customerHelper';


function ManageNewOrder() {
    const [customer, setCustomer] = useState(null);
    const [latestPresccription, setLatestPrescription] = useState(null);
    const [status, setStatus] = useState({status: "hide", description: ""});

    useEffect(() => {
        const fetchLatestPrescription = async () => {
            if (customer && customer.prescriptions && customer.prescriptions.length > 0) {
                // find prescription with latest date
                let latestPrescription = customer.prescriptions[0];
                customer.prescriptions.forEach(prescription => {
                    if (new Date(prescription.date) > new Date(latestPrescription.date)) {
                        latestPrescription = prescription;
                    }
                });
                setLatestPrescription(latestPrescription);
            }
            else{
                setLatestPrescription(null);
            }

        }
        fetchLatestPrescription();
    }, [customer]);

    const gotoNewOrderPage = () => {
        // navigate to manage-orders/new
        window.location.href = `/manage-orders/new/${customer.id}/${latestPresccription.id}`;
    }

    const gotoNewOrderPageWithoutPrescription = () => {
        window.location.href = `/manage-orders/new/${customer.id}/-1`;
    }

    const updateCustomerPrescription = async (updatedPrescription) => {
        // update customer prescription
        setStatus({ status: 'loading', description: 'Updating prescription' });
        const updatedCustomer = { ...customer, prescriptions: customer.prescriptions.map(prescription => prescription.id === updatedPrescription.id ? updatedPrescription : prescription) };
        const data = await updateCustomer(updatedCustomer);
        if (!data.success) {
            setStatus({ status: 'error', description: 'Error saving prescription' });
            return;
        }
        setCustomer(updatedCustomer);
        setStatus({ status: 'successful', description: 'Prescription updated successfully' });
    }

    const deleteCustomerPrescription = async () => {
        const prescriptionId = latestPresccription.id;
        console.log("Deleting prescription", prescriptionId);
        console.log("Customer", customer);
        setStatus({ status: 'loading', description: 'Deleting prescription' });
        // delete customer prescription
        const updatedCustomer = { ...customer, prescriptions: customer.prescriptions.filter(prescription => prescription.id !== prescriptionId) };
        const data = await updateCustomer(updatedCustomer);
        if (!data.success) {
            setStatus({ status: 'error', description: 'Error deleting prescription' });
            return;
        }
        setCustomer(updatedCustomer);
        setStatus({ status: 'successful', description: 'Prescription deleted successfully' });
    }



    return (
        <div className="container mt-3">
            {/* load customer -> it would load customer from db or create new, by any method -> it would bring us a customer we can show and edit etc*/}
            {!customer ? <LoadCustomer setCustomer={setCustomer} />
                : <>

                    <EditCustomer customer={customer} setCustomer={setCustomer} setStatus={setStatus} isEditAble={false} />

                    {/* button that goes to order page (after we have selected user and prescription) */}
                    <div className='d-flex justify-content-center gap-3'>
                        {customer && latestPresccription && <button className="btn btn-primary my-2" onClick={gotoNewOrderPage}>Use Latest Prescription</button>}
                        {customer && <button className="btn btn-primary my-2" onClick={gotoNewOrderPageWithoutPrescription}>No Prescription</button> }
                    </div>

                    <hr />

                    <AddNewPrescription customer={customer} setCustomer={setCustomer} setStatus={setStatus} />

                    <hr />
                    <h1 style={{ fontSize: "2rem", textAlign: "Left" }} className='m-4'  >Latest Prescription</h1>
                    {latestPresccription && <EditablePrescriptionCard prescription={latestPresccription} customer={customer} isEditAble={true} updateCustomerPrescription={updateCustomerPrescription} deleteCustomerPrescription={deleteCustomerPrescription}  />}
                </>}

                <CurrentStatusComponent status={status} setStatus={setStatus} />
        </div>
    )
}

export default ManageNewOrder