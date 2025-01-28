'use client';

import React from 'react';
import CenterTitle from '@/components/CenterTitle';
import ContactLensManagement from '@/components/contact-lens-management/ContactLensManagement';
import withProtectedRoute from '@/hoc/withProtectedRoute'; 

const page = () => {

    return (
        <div>
            <CenterTitle title="Add new Contact lens"/>
            <ContactLensManagement />
        </div>
    );
}

export default withProtectedRoute(page, 'admin'); 
