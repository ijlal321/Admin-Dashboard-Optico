'use client';
import withProtectedRoute from '@/hoc/withProtectedRoute'; 
import React from 'react'
import ManageCustomersOrders from '@/components/customers/ManageCustomersOrders'

function page() {
    return (
        <div>
            <ManageCustomersOrders />
        </div>
    )
}

export default withProtectedRoute(page, 'any'); 