import React, { useState } from 'react'
import { Edit, X, Save, Trash2, PlusCircle } from 'lucide-react';
import { Card } from 'react-bootstrap';
import PrescriptionForm from './PrescriptionForm';
import { updateCustomer, prescriptionValidator } from '@/utlis/customerHelper';

import doctors from '@/data/doctors.json';

function AddNewPrescrtiption({ customer, setCustomer , setStatus}) {
    const [makingNewPrescription, setMakingNewPrescription] = useState(false);
    const [currentPrescription, setCurrentPrescription] = useState({
        date: new Date().toISOString().split('T')[0],
        doctor: doctors[0] || '',
        left_sph: '',
        left_cyl: '',
        left_axis: '',
        left_vision: '',
        right_sph: '',
        right_cyl: '',
        right_axis: '',
        right_vision: '',
        addition: '',
        ipd: ''
    });

    const makeCurrentPrescriptionNull = () => {
        setCurrentPrescription({
            date: new Date().toISOString().split('T')[0],
            doctor: doctors[0] || '',
            left_sph: '',
            left_cyl: '',
            left_axis: '',
            left_vision: '',
            right_sph: '',
            right_cyl: '',
            right_axis: '',
            right_vision: '',
            addition: '',
            ipd: ''
        });
    }

    const handleResetPrescription = () => {
        makeCurrentPrescriptionNull();
        setMakingNewPrescription(false);
    }

    const handleSaveNewPrescription = async () => {

        const validation = prescriptionValidator(currentPrescription);
        if (!validation.success) {
            setStatus({ status: 'error', description: validation.message });
            return;
        }

        // send api request to update prescription
        const updatedCustomer = { ...customer, prescriptions: [...customer.prescriptions, currentPrescription] };
        const data = await updateCustomer(updatedCustomer);
        if (!data.success) {
            console.log("Error saving prescription", data.error);
            setStatus({ status: 'error', description: 'Error saving prescription' });
            return;
        }
        setCustomer(updatedCustomer);
        makeCurrentPrescriptionNull();
        setMakingNewPrescription(false);

        setStatus({ status: 'successful', description: 'Prescription Saved successfully' });
    }

    return (
        <div className="edit-prescription-container">
            {makingNewPrescription ?
                <Card className=" m-3">
                    <Card.Header className='d-flex justify-content-between'>
                        Enter info for Prescription
                        <div>
                            <div className="d-flex gap-4">
                                <Save color='green' size={24} className="mr-2" style={{ cursor: 'pointer' }} onClick={handleSaveNewPrescription} />
                                <X color='red' size={24} style={{ cursor: 'pointer' }} onClick={handleResetPrescription} />
                            </div>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <PrescriptionForm prescription={currentPrescription} setPrescription={setCurrentPrescription} isEditable={true} />
                    </Card.Body>
                </Card>
                :
                <Card className="m-3" onClick={() => setMakingNewPrescription(true)} style={{ cursor: 'pointer' }}>
                    <Card.Header className='d-flex justify-content-between'>
                        Add New Prescription
                        <PlusCircle color='green' size={24} style={{ cursor: 'pointer' }}  />
                    </Card.Header>
                </Card>
            }
        </div>
    )
}

export default AddNewPrescrtiption