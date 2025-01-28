'use client';
import withProtectedRoute from '@/hoc/withProtectedRoute'; 
import React from 'react'
import CenterTitle from '@/components/CenterTitle'
import AddNewSunglass from '@/components/sunglass/AddNewSunglass'

function page() {
  return (
    <div>
        <CenterTitle title="Add New Sunglass" />
        <AddNewSunglass />
    </div>
  )
}

export default withProtectedRoute(page, 'any'); 