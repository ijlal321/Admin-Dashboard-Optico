"use client";

import React from 'react'
import { useParams } from 'next/navigation'
import CenterTitle from '@/components/CenterTitle';
import EditReadingGlass from '@/components/readingGlasses/EditReadingGlass';

function page() {
    const { readingGlassId } = useParams();

    return (
        <div>
            <CenterTitle title="Edit Reading Glass" />
            <EditReadingGlass readingGlassId={readingGlassId} />
        </div>
    )
}

export default withProtectedRoute(page, 'admin'); 