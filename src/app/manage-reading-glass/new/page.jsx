'use client';
import withProtectedRoute from '@/hoc/withProtectedRoute'; 
import React from 'react'
import CenterTitle from '@/components/CenterTitle'
import AddNewReadingGlass from '@/components/readingGlasses/AddNewReadingGlass'

function page() {
  return (
    <div>
        <CenterTitle title="Add New Frame" />
        <AddNewReadingGlass />
    </div>
  )
}

export default withProtectedRoute(page, 'any'); 
