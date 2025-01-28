'use client';
import withProtectedRoute from '@/hoc/withProtectedRoute'; 
import React from 'react'
import CenterTitle from '@/components/CenterTitle'
import AddNewFrame from '@/components/frames/AddNewFrame'

function page() {
  return (
    <div>
        <CenterTitle title="Add New Frame" />
        <AddNewFrame />
    </div>
  )
}

export default withProtectedRoute(page, 'any'); 
