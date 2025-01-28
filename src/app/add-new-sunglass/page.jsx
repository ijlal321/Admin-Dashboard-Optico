"use client";
import withProtectedRoute from '@/hoc/withProtectedRoute';
import React from 'react';
import CenterTitle from '@/components/CenterTitle';
import AddNewSunglass from '@/components/sunglass/AddNewSunglass';

const page = () => {

    return (
        <div>
            <CenterTitle title="Add new Sunglass"/>
            <AddNewSunglass />
        </div>
    );
}

export default withProtectedRoute(page, 'any');
