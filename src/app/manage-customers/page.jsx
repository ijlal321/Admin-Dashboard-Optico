'use client';
import withProtectedRoute from '@/hoc/withProtectedRoute'; 
import React from 'react'
import CenterTitle from '@/components/CenterTitle'
import ManageCustomers from '@/components/customers/ManageCustomers'

function page() {
  return (
    <div>
        <CenterTitle title="Manage Customer" />
        <ManageCustomers />

    </div>
  )
}

export default withProtectedRoute(page, 'any'); 