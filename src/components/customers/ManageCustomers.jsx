"use client";

import React, { useEffect, useState } from 'react'
import LoadCustomer from './LoadCustomer';
import EditCustomer from './EditCustomer';
import PrescriptionForm from '../prescriptions/PrescriptionForm';
import ManagePrescriptions from '../prescriptions/ManagePrescriptions';
import AddNewPrescription from '../prescriptions/AddNewPrescription';

import CurrentStatusComponent from '../helpers/CurrentStatusComponent';

function ManageCustomers() {
    const [customer, setCustomer] = useState(null);
    const [status, setStatus] = useState({ status: 'hide', message: '' });

    const GotoOrdersPage = () => {
        // redirect to orders page
        window.location.href = `/manage-customers/${customer.id}/orders`;
    }
    return (
        <div className="container mt-3">
            {/* load customer -> it would load customer from db or create new, by any method -> it would bring us a customer we can show and edit etc*/}
            {!customer ? <LoadCustomer setCustomer={setCustomer} setStatus={setStatus}/>
                : <>

                    <EditCustomer customer={customer} setCustomer={setCustomer} setStatus={setStatus} />

                    <hr />

                    {/* give button for manage orders, which would lead you to some other page */}
                    <button className="btn btn-primary d-flex mx-auto my-3" onClick={GotoOrdersPage}>Manage Orders</button>

                    <hr />
                    <AddNewPrescription customer={customer} setCustomer={setCustomer} setStatus={setStatus} />

                    <hr />
                    <ManagePrescriptions customer={customer} setCustomer={setCustomer} setStatus={setStatus}/>

                </>}

            <CurrentStatusComponent status={status} setStatus={setStatus} />
        </div>
    )
}

export default ManageCustomers