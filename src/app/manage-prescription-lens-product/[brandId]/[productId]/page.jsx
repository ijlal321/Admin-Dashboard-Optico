"use client";
import withProtectedRoute from '@/hoc/withProtectedRoute';
import React from 'react';
import { useParams } from 'next/navigation';  // Correct import from next/navigation

import ManagePrescriptionLensProduct from '@/components/prescriptionsLens/ManagePrescriptionLensProduct';
import CenterTitle from '@/components/CenterTitle';  // Assuming you have this component

const Page = () => {
    const params = useParams(); 

    const {brandId, productId} = params;

    return (
        <div>
            <CenterTitle title="Manage Prescriptions Lens Products" />
            <ManagePrescriptionLensProduct brandId={brandId} productId={productId} />
        </div>
    );
};

export default withProtectedRoute(page, 'admin'); 