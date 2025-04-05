import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

function CustomerForm() {
    const [orderNumber, setOrderNumber] = useState('');
    const [complaintDescription, setComplaintDescription] = useState('');
    const [date, setDate] = useState('');
    const router = useRouter();

    const handleSave = () => {
        // Add save logic here if needed
        router.push('/');
    };

    const handleCancel = () => {
        router.push('/');
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Add New Complaint</h2>
            <form>
                <div className="mb-3">
                    <label className="form-label">Order Number:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Complaint Description:</label>
                    <textarea
                        className="form-control"
                        value={complaintDescription}
                        onChange={(e) => setComplaintDescription(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Date:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div className="d-flex gap-2">
                    <button
                        type="button"
                        className="btn btn-primary d-flex align-items-center gap-2"
                        onClick={handleSave}
                    >
                        <Save size={16} />
                        Save
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary d-flex align-items-center gap-2"
                        onClick={handleCancel}
                    >
                        <X size={16} />
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CustomerForm;
