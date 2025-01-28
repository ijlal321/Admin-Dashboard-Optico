import React, { useState, useEffect } from 'react'
import { Edit, X, Save, Trash2 } from 'lucide-react';
import { Card } from 'react-bootstrap';
import PrescriptionForm from './PrescriptionForm';

function EditablePrescriptionCard({ prescription, updateCustomerPrescription, deleteCustomerPrescription, isEditAble = true }) {
    const [editing, setEditing] = useState(false);
    const [currentPrescription, setCurrentPrescription] = useState(prescription);

    useEffect(() => {
        setCurrentPrescription(prescription);
    }, [prescription]);

    const handleDeletePrescription = async () => {
        if (window.confirm("Are you sure you want to delete this prescription?")) {
            await deleteCustomerPrescription();
        }
    }

    const handleEditCancel = () => {
        setEditing(false);
        setCurrentPrescription(prescription);
    }

    const handleUpdatePrescription = async () => {
        // send api request to update prescription
        updateCustomerPrescription(currentPrescription);
        setEditing(false);
    }

    return (
        <div className="edit-prescription-container">
            <Card className=" m-3">
                <Card.Header className='d-flex justify-content-between'>
                    {editing ? "Editing..." : "Prescription Info"}
                    {isEditAble && <div>
                        {editing ?
                            <div className="d-flex gap-4">
                                <Save color='green' size={24} className="mr-2" style={{ cursor: 'pointer' }} onClick={handleUpdatePrescription} />
                                <X color='red' size={24} style={{ cursor: 'pointer' }} onClick={handleEditCancel} />
                            </div>
                            :
                            <div className="d-flex gap-4">
                                <Edit size={24} style={{ cursor: 'pointer' }} onClick={() => setEditing(true)} />
                                <Trash2 color='red' size={24} style={{ cursor: 'pointer' }} onClick={handleDeletePrescription} />
                            </div>
                        }
                    </div>
                    }
                </Card.Header>
                <Card.Body>
                    <PrescriptionForm prescription={currentPrescription} setPrescription={setCurrentPrescription} isEditable={editing} />
                </Card.Body>
            </Card>
        </div>
    )
}

export default EditablePrescriptionCard