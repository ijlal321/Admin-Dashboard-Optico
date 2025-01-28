'use client';
import withProtectedRoute from '@/hoc/withProtectedRoute';

import React from 'react'
import { useParams } from 'next/navigation'
import CenterTitle from '@/components/CenterTitle';
import EditSunglass from '@/components/sunglass/EditSunglass';
function page() {
    const { sunglassId } = useParams();

    return (
        <div>
            <CenterTitle title="Edit Sunglass" />
            <EditSunglass sunglassId={sunglassId} />
        </div>
    )
}

export default withProtectedRoute(page, 'admin'); 