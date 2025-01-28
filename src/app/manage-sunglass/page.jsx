"use client";
import withProtectedRoute from '@/hoc/withProtectedRoute';
import React from 'react'
import CenterTitle from '@/components/CenterTitle'
import ManageSunglass from '@/components/sunglass/ManageSunglass'

function page() {
  return (
    <div>
        <CenterTitle title="Manage Sunglass" />
        <ManageSunglass />
    </div>
  )
}

export default withProtectedRoute(page, 'any');
