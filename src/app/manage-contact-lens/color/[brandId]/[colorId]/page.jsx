'use client';
import withProtectedRoute from '@/hoc/withProtectedRoute'; 
import React from 'react';
import { useParams } from 'next/navigation';  // Correct import from next/navigation

import CenterTitle from '@/components/CenterTitle';  // Assuming you have this component
import ManageColors from '@/components/contactLens/colors/ManageColors';

const page = () => {
    const params = useParams(); 

    const {brandId, colorId} = params;

    return (
        <div>
            <CenterTitle title="Manage  Contact Lens Color" />
            <ManageColors brandId={brandId} colorId={colorId} />
        </div>
    );
};

export default withProtectedRoute(page, 'admin'); 
