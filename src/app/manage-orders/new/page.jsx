'use client';
import withProtectedRoute from '@/hoc/withProtectedRoute'; 
import React from 'react'
import CenterTitle from '@/components/CenterTitle'
import ManageNewOrder from '@/components/order/ManageNewOrder'

function page() {
  return (
    <div>
        <CenterTitle title="New Order" />
        <ManageNewOrder />
    </div>
  )
}

export default withProtectedRoute(page, 'any'); 
