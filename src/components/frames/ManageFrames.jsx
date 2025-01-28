"use client";

import React, { useState, useEffect } from 'react'
import FrameSummaryCard from './FrameSummaryCard';
import CurrentStatusComponent from '../helpers/CurrentStatusComponent';



function ManageFrames() {
    const [status, setStatus] = useState({ status: 'hide', description: '' });
    const [frames, setFrames] = useState([]);

    useEffect(() => {
        // fetch frame data
        const fetchLatestData = async () => {
            try {
                setStatus({ status: 'loading', description: 'Loading Data...' });
                const response = await fetch('/api/frames', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (data.success) {
                    setFrames(data.data);
                    setStatus({ status: 'idle', description: 'Loaded Successfully' });
                }
                else {
                    setStatus({ status: 'error', description: `Error Loading Data: ${data.error}` });
                }
            } catch (error) {
                console.error('Error fetching Frames:', error);
                setStatus({ status: 'error', description: error });
            }
        }

        fetchLatestData();
    }, [])



    return (
        <div className='d-flex flex-wrap gap-3 container'>
            {frames.map(frame => (
                <FrameSummaryCard key={frame.id} frame={frame} setStatus={setStatus} />
            ))
            }
            <CurrentStatusComponent status={status} setStatus={setStatus} />
        </div>
    )
}

export default ManageFrames