"use client";
import withProtectedRoute from '@/hoc/withProtectedRoute';
import React from 'react'
import CenterTitle from '@/components/CenterTitle'
import ManageReadingGlasses from '@/components/readingGlasses/ManageReadingGlasses'

function page() {
  return (
    <div>
        <CenterTitle title="Manage Reading Glasses" />
        <ManageReadingGlasses />
    </div>
  )
}

export default withProtectedRoute(page, 'any'); 
