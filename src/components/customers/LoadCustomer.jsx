import React, { useEffect, useState } from 'react'
import CustomerForm from './CustomerForm';
import { Card } from 'react-bootstrap';
import { searchCustomer, addNewCustomer } from '@/utlis/customerHelper';


function LoadCustomer({ setCustomer, setStatus }) {
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [currentCustomer, setCurrentCustomer] = useState({ name: '', phone: '', address: '', prescriptions: [] });
    const [loadingCustomers, setLoadingCustomers] = useState(false);

    useEffect(() => {
        setLoadingCustomers(true);
        const debounceTimeout = setTimeout(() => {
            const loadFilteredCustomer = async () => {
                const data = await searchCustomer(currentCustomer.name, currentCustomer.phone);
                if (!data.success) {
                    setStatus({ status: 'error', description: `Failed to search customer. Error ${data.error}` });
                    setLoadingCustomers(false);
                    return;
                }
                setFilteredCustomers(data.data);
                setLoadingCustomers(false);
            }
            // load all customers on page load
            loadFilteredCustomer();
        }, 300); // 300ms debounce time

        return () => {
            clearTimeout(debounceTimeout);
            setLoadingCustomers(false);
        };
    }, [currentCustomer]);



    const handleCustomerSelect = (customer) => {
        setCustomer(customer);
    }

    const handleCreateNewCustomer = async () => {
        if (loadingCustomers) return;
        try {
            if (!currentCustomer.name || !currentCustomer.phone) {
                alert('Please enter name and phone to create new customer');
                return;
            }
            setStatus({ status: 'saving', description: 'Adding new customer...' });

            // no need to check for unique, bcz its on db to not permit same name and phone

            // send api to check if customer with this name and phone donot exist (check on backend, then add it, and return id and etc).
            const data = await addNewCustomer(currentCustomer);
            if (!data.success) {
                setStatus({ status: 'error', description: `Customer with same phone and name already exists` });
                setStatus({ status: 'error', description: `Failed to add customer` });
                console.log('Error adding customer:', data.error);
                return;
            }
            setStatus({ status: 'successful', description: 'Customer added successfully' });
            setCustomer(data.data)
        }
        catch (error) {
            console.error('Error adding customer:', error);
            setStatus({ status: 'error', description: `Failed to add customer. Error ${error}` });
        }
    }

    return (
        <div className="load-customer-container">
            <Card className="mb-3">
                <Card.Header>Select a Customer</Card.Header>
                <Card.Body>
                    <CustomerForm customer={currentCustomer} setCustomer={setCurrentCustomer} isEditable={true} />
                    <div className="customer-list mt-3">
                        {loadingCustomers ? <div>Loading...</div> : <>
                            {filteredCustomers.length > 0 && (
                                filteredCustomers.map(customer => (
                                    <div
                                        key={customer.id}
                                        className="customer-item p-2 mb-2 border rounded"
                                        onClick={() => handleCustomerSelect(customer)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <strong>{customer.name}</strong> - {customer.phone}
                                    </div>
                                ))
                            )}
                        </>}
                    </div>
                    <button className="btn btn-primary mt-3" onClick={handleCreateNewCustomer}>Create New Customer</button>
                </Card.Body>
            </Card>
        </div>
    )
}

export default LoadCustomer