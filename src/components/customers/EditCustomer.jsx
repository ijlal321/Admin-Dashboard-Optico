import React, { useState } from 'react'
import { Edit, X, Save, Trash2 } from 'lucide-react';
import { Card } from 'react-bootstrap';
import CustomerForm from './CustomerForm';
import { updateCustomer, deleteCustomer, searchCustomer } from '@/utlis/customerHelper';

function EditCustomer({ customer, setCustomer, setStatus }) {
    const [editing, setEditing] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState(customer);

    const handleDeleteCustomer = async () => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            const data = await deleteCustomer(customer.id);
            if (!data.success) {
                setStatus({ status: 'error', description: `Error Deleting customer.` });
                console.log(data.error);
                return
            }
            setStatus({ status: 'successful', description: `Customer deleted successfully` });
            setCustomer(null);
        }
    }

    const handleEditCancel = () => {
        setEditing(false);
        setCurrentCustomer(customer);
    }

    const handleUpdateCustomer = async () => {
        // check if any field is empty
        if (!currentCustomer.name || !currentCustomer.phone) {
            setStatus({ status: 'error', description: `All fields are required.` });
            return;
        }

        // check if customer already exist
        const searchData = await searchCustomer(currentCustomer.name, currentCustomer.phone);
        if (!searchData.success){
            setStatus({ status: 'error', description: `Error validating for duplicates customer.` });
            console.log(searchData.error);
            return
        }

        const nrMatching = searchData.data.filter(c => c.name === currentCustomer.name && c.phone === currentCustomer.phone).length;

        if (nrMatching > 1) {
            setStatus({ status: 'error', description: `Customer already exists.` });
            return;
        }


        // send api request to update customer
        const data = await updateCustomer(currentCustomer);
        if (!data.success) {
            setStatus({ status: 'error', description: `Customer not updated.` });
            console.log(data.error);
            return;
        }
        setStatus({ status: 'successful', description: `Customer updated successfully` });

        setCustomer(data.data);
        setEditing(false);
        setCurrentCustomer(data.data);
    }

    return (
        <div className="edit-customer-container">
            <Card className=" col-md-7 mb-3 mx-auto">
                <Card.Header className='d-flex justify-content-between'>
                    {editing ? "Editing..." : "Customer Info"}
                    <div>
                        {editing ?
                            <div className="d-flex gap-4">
                                <Save color='green' size={24} className="mr-2" style={{ cursor: 'pointer' }} onClick={handleUpdateCustomer} />
                                <X color='red' size={24} style={{ cursor: 'pointer' }} onClick={handleEditCancel} />
                            </div>
                            :
                            <div className="d-flex gap-4">
                                <Edit size={24} style={{ cursor: 'pointer' }} onClick={() => setEditing(true)} />
                                <Trash2 color='red' size={24} style={{ cursor: 'pointer' }} onClick={handleDeleteCustomer} />
                            </div>
                        }
                    </div>
                </Card.Header>
                <Card.Body>
                    <CustomerForm customer={currentCustomer} setCustomer={setCurrentCustomer} isEditable={editing} />
                </Card.Body>
            </Card>
        </div>
    )
}

export default EditCustomer