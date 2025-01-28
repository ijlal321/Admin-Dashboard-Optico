'use client';
import withProtectedRoute from '@/hoc/withProtectedRoute'; 
import React from 'react';
import CenterTitle from '@/components/CenterTitle';
import ManagePrescriptionLens from '@/components/prescriptionsLens/ManagePrescriptionLens';
const page = () => {

    return (
        <div>
            <CenterTitle title="Manage Prescriptions Lens"/>
            <ManagePrescriptionLens />
        </div>
    );
}

export default withProtectedRoute(page, 'admin'); 