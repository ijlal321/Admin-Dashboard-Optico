"use client";

import React from 'react'
import CenterTitle from '@/components/CenterTitle'
import ManageSingleOrderDetailed from '@/components/order/ManageSingleOrderDetailed'
import { useParams } from 'next/navigation';

function page() {
    const { orderId } = useParams();

  return (
    <div>
        <CenterTitle title="Order Details" />
        <ManageSingleOrderDetailed orderId={orderId}/>
    </div>
  )
}

export default page