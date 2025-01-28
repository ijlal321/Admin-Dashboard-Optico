import React, { useEffect } from 'react';
import { Save, Loader, Info, AlertCircle, CheckCircle } from 'lucide-react';

function CurrentStatusComponent({ status, setStatus }) {
    useEffect(() => {
        if (status.status !== 'loading' && status.status !== 'saving' && status.status !== 'finished') {
            const timer = setTimeout(() => {
                setStatus({ status: 'hide', description: '' });
            }, status.status === "error" ? 5000 : 5000);
            return () => clearTimeout(timer);
        }
    }, [status, setStatus]);

    return (
        <>
            {/* Backdrop overlay */}
            {(status.status === 'loading' || status.status === 'saving' || status.status === 'finished') && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
                        zIndex: 9998, // Ensure it sits on top of everything
                        cursor: 'not-allowed', // Indicate that interaction is not allowed
                    }}
                />
            )}

            {/* Status Component */}
            <div
                style={{
                    position: 'fixed',
                    left: '0',
                    bottom: 0,
                    width: '100%',
                    padding: "15px",
                    zIndex: 9999, // Ensure it sits on top of the backdrop
                }}
            >
                {status.status === 'idle' && (
                    <div className="alert alert-info d-flex" role="alert">
                        <Info style={{ marginRight: '8px' }} /> {status.description}
                    </div>
                )}
                {status.status === 'loading' && (
                    <div className="alert alert-info d-flex" role="alert">
                        <Loader className="animate-spin" style={{ marginRight: '8px' }} /> Loading: {status.description}
                    </div>
                )}
                {status.status === 'error' && (
                    <div className="alert alert-danger d-flex" role="alert">
                        <AlertCircle style={{ marginRight: '8px' }} /> Error: {status.description}
                    </div>
                )}
                {status.status === 'successful' && (
                    <div className="alert alert-success d-flex" role="alert">
                        <CheckCircle style={{ marginRight: '8px' }} /> Successful: {status.description}
                    </div>
                )}
                {status.status === 'saving' && (
                    <div className="alert alert-warning d-flex" role="alert">
                        <Loader className="animate-spin" style={{ marginRight: '8px' }} /> Saving: {status.description}
                    </div>
                )}
                {status.status === 'finished' && (
                    <div className="alert alert-info d-flex" role="alert">
                        <Save className="animate-spin" style={{ marginRight: '8px' }} /> {status.description}. Please Refresh!
                    </div>
                )}
            </div>
        </>
    );
}

export default CurrentStatusComponent;
