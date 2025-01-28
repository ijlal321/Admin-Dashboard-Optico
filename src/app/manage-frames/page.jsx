"use client";
import withProtectedRoute from '@/hoc/withProtectedRoute';
import React from 'react'
import CenterTitle from '@/components/CenterTitle'
import ManageFrames from '@/components/frames/ManageFrames'

function page() {
  return (
    <div>
        <CenterTitle title="Manage Frames" />
        <ManageFrames />
    </div>
  )
}


export default withProtectedRoute(page, 'admin'); 
