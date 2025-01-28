'use client';
import CenterTitle from '@/components/CenterTitle'
import ManageOrders from '@/components/order/ManageOrders'
import React from 'react'
import withProtectedRoute from '@/hoc/withProtectedRoute'; 

function page() {
  return (
    <div>
        <CenterTitle title="Manage Orders" />
        <ManageOrders />
    </div>
  )
}

export default withProtectedRoute(page, 'any'); 