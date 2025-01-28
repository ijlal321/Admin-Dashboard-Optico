'use client';
import withProtectedRoute from '@/hoc/withProtectedRoute'; 
import React from 'react'
import { useParams } from 'next/navigation';
import CenterTitle from '@/components/CenterTitle';
import NewOrderCard from '@/components/order/NewOrderCard';

function page() {
    let { customerId, prescriptionId } = useParams();
    if (prescriptionId == -1) {
        prescriptionId = "";
    }
  return (
    <div>
        <NewOrderCard customerId={customerId} prescriptionId={prescriptionId} />
    </div>
  )
}

export default withProtectedRoute(page, 'any'); 