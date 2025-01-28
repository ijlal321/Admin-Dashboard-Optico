"use client";
import withProtectedRoute from '@/hoc/withProtectedRoute'; 
import React from 'react';
import CenterTitle from '@/components/CenterTitle';
// import AddNewReadingGlass from '@/components/addStock/AddNewReadingGlass';

const page = () => {

    return (
        <div>
            <CenterTitle title="Add new Reading Glasses"/>
            {/* <AddNewReadingGlass /> */}
        </div>
    );
}

export default withProtectedRoute(page, 'any'); 