"use client";
import React from 'react'
import CenterTitle from '@/components/CenterTitle';
import ManageContactLens from '@/components/contactLens/ManageContactLens';
import withProtectedRoute from '@/hoc/withProtectedRoute'; 

function page() {
    return (
        <div>
            <CenterTitle title="Manage Contact Lens" />
            <ManageContactLens />
        </div>
    )
}

export default withProtectedRoute(page, 'admin'); 