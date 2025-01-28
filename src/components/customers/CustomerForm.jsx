import React from 'react';
import { User, Phone, MapPin, Save } from 'lucide-react';

function CustomerForm({ customer, setCustomer, isEditable }) {
    return (
        <div className='row gap-4 w-[70%] mx-auto'>
            <div className='col-md-5'>
                <div className='input-group'>
                    <span className='input-group-text'><User /></span>
                    <input type="text" className='form-control' onChange={(e)=>setCustomer({...customer, name:e.target.value})} value={customer.name} disabled={!isEditable} placeholder="Name" />
                </div>
            </div>
            <div className='col-md-5'>
                <div className='input-group'>
                    <span className='input-group-text'><Phone /></span>
                    <input type="number" className='form-control' onChange={(e)=>setCustomer({...customer, phone:e.target.value})} value={customer.phone} disabled={!isEditable} placeholder="Phone" />
                </div>
            </div>
            <div className='col-md-5'>
                <div className='input-group'>
                    <span className='input-group-text'><MapPin /></span>
                    <input type="text" className='form-control' onChange={(e)=>setCustomer({...customer, address:e.target.value})} value={customer.address} disabled={!isEditable} placeholder="Address" />
                </div>
            </div>
            
        </div>
    );
}

export default CustomerForm;
