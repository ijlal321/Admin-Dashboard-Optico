'use client';
import withProtectedRoute from '@/hoc/withProtectedRoute'; 
import React from 'react'
import { useParams } from 'next/navigation'
import CenterTitle from '@/components/CenterTitle';
import EditFrame from '@/components/frames/EditFrame';
function page() {
    const { frameId } = useParams();

  return (
    <div>
        <CenterTitle title="Edit Frame" />
        <EditFrame frameId={frameId} />
    </div>
  )
}

export default withProtectedRoute(page, 'admin'); 
