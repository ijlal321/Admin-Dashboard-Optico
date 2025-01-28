"use client";

import React, { useState, useEffect } from 'react'
import ReadingGlassesSummaryCard from './ReadingGlassesSummaryCard';
import CurrentStatusComponent from '../helpers/CurrentStatusComponent';




function ManageReadingGlasses() {
    const [status, setStatus] = useState({ status: 'hide', description: '' });
    const [readingGlasses, setReadingGlasses] = useState([]);

    useEffect(() => {
        // fetch reading glasses data
        const fetchLatestData = async () => {
            try {
                setStatus({ status: 'loading', description: 'Loading Data...' });
                const response = await fetch('/api/readingGlass', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (data.success) {
                    setReadingGlasses(data.data);
                    setStatus({status:"hide", description:""})
                }
                else {
                    setStatus({ status: 'error', description: `Error Loading Data: ${data.error}` });
                }
            } catch (error) {
                console.error('Error fetching readingGlasses:', error);
                setStatus({ status: 'error', description: error });
            }
        }

        fetchLatestData();
    }, [])

    return (
        <div className='d-flex flex-wrap gap-3 container'>
            {readingGlasses.map(readingGlass => (
                <ReadingGlassesSummaryCard key={readingGlass.id} readingGlass={readingGlass} setStatus={setStatus} />
            ))
            }
            <CurrentStatusComponent status={status} setStatus={setStatus} />
        </div>
    )
}

export default ManageReadingGlasses