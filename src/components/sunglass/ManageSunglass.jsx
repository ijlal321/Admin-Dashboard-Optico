"use client";

import React, { useState, useEffect } from 'react'
import SunglassSummaryCard from './SunglassSummaryCard';
import CurrentStatusComponent from '../helpers/CurrentStatusComponent';



function ManageSunglass() {
    const [status, setStatus] = useState({ status: 'hide', description: '' });
    const [sunglasses, setSunglasses] = useState([]);

    useEffect(() => {
        // fetch sunglass data
        const fetchLatestData = async () => {
            try {
                setStatus({ status: 'loading', description: 'Loading Data...' });
                const response = await fetch('/api/sunglass', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (data.success) {
                    setSunglasses(data.data);
                    setStatus({ status: 'idle', description: 'Loaded Successfully' });
                }
                else {
                    setStatus({ status: 'error', description: `Error Loading Data: ${data.error}` });
                }
            } catch (error) {
                console.error('Error fetching Sunglasses:', error);
                setStatus({ status: 'error', description: error });
            }
        }

        fetchLatestData();
    }, [])

    return (
        <div className='d-flex flex-wrap gap-3 container'>
            {sunglasses.map(sunglass => (
                <SunglassSummaryCard key={sunglass.id} sunglass={sunglass} setStatus={setStatus} />
            ))
            }
            <CurrentStatusComponent status={status} setStatus={setStatus} />
        </div>
    )
}

export default ManageSunglass