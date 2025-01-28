'use client';
import withProtectedRoute from '@/hoc/withProtectedRoute'; 
import React from 'react'
import CenterTitle from '@/components/CenterTitle'
import ManageShipments from '@/components/shipment/ManageShipments'

function page() {
  return (
    <div>
        <CenterTitle title="Manage Shipments" />
        <ManageShipments />

    </div>
  )
}

export default withProtectedRoute(page, 'admin'); 