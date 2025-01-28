import React, { useEffect } from 'react'
import PrescriptionForm from './PrescriptionForm'
import EditablePrescriptionCard from './EditablePrescriptionCard'
import { prescriptionValidator, updateCustomer } from '@/utlis/customerHelper'

function ManagePrescriptions({ customer, setCustomer, setStatus }) {
    
    const handleUpdatePrescription = async(updatedPrescription, index) => {
        const isValid = prescriptionValidator(updatedPrescription);
        if (!isValid.success){
            setStatus({ status: 'error', description: isValid.error });
            return;
        }

        const updatedPrescriptions = [...customer.prescriptions];
        updatedPrescriptions[index] = updatedPrescription;
        const updatedCustomer = { ...customer, prescriptions: updatedPrescriptions };
        const data = await updateCustomer(updatedCustomer);
        if (!data.success) {
            setStatus({ status: 'error', description: data.error });
            return;
        }
        setStatus({ status: 'successful', description: 'Prescription updated successfully' });
        setCustomer(updatedCustomer);
    }

    const handleDeletePrescription = async(index) => {
        setStatus({ status: 'loading', description: 'Deleting prescription...' });
        const updatedCustomer = { ...customer, prescriptions: customer.prescriptions.filter((_, i) => i !== index) };
        const data = await updateCustomer(updatedCustomer);
        if (!data.success) {
            setStatus({ status: 'error', description: data.error });
            return;
        }
        setStatus({ status: 'successful', description: 'Prescription deleted successfully' });
        setCustomer(updatedCustomer);
    }


    useEffect(() => {
        // reorder customer.prescriptions by date
        const sortedPrescriptions = customer.prescriptions.sort((a, b) => new Date(b.date) - new Date(a.date));
        setCustomer({ ...customer, prescriptions: sortedPrescriptions });
    }, [customer.prescriptions]) // not working rn, need to fix later

    return (
        <div>
            {customer.prescriptions.length > 0 &&
                <h2 className='m-3' style={{ fontSize: "2rem", textDecoration: "underline" }}>Prescription History</h2>
            }
            <div className='row'>
                {customer.prescriptions.map((prescription, index) => (
                    <EditablePrescriptionCard key={index} prescription={prescription} updateCustomerPrescription={(updatedPrescription) => handleUpdatePrescription(updatedPrescription, index)} 
                        deleteCustomerPrescription={() => handleDeletePrescription(index)}
                     />
                ))}
            </div>
        </div>
    )
}

export default ManagePrescriptions