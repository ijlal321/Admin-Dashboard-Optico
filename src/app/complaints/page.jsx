'use client';
import withProtectedRoute from '@/hoc/withProtectedRoute'; 
import React from 'react'
import CenterTitle from '@/components/CenterTitle'
import AddNewComplaint from '@/components/complaints/AddNewComplaint'

function page() {
  return (
    <div>
        <CenterTitle title="Complaints" />
        <AddNewComplaint />
    </div>
  )
}

export default withProtectedRoute(page, 'any'); 