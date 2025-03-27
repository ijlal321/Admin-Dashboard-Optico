import React from 'react'

const dummyPrescription = {
    id: 1,
    date: '2021-01-01',
    doctor: 'Dr. Smith',
    left_sph: '-2.00',
    left_cyl: '-2.00',
    left_axis: '90',
    left_vision: '6/6',
    right_sph: '-2.00',
    right_cyl: '-2.00',
    right_axis: '90',
    right_vision: '6/6',
    addition: '+1.00',
    pd: '60',
}

// const doctors = ["Dr. Mehmood Iqbal", "Mr Tanveer Ayuob", "Self"]
import doctors from "@/data/doctors.json";
import { Bold } from 'lucide-react';

function PrescriptionForm({ prescription, setPrescription, isEditable }) {
    const handleChange = (field, value) => {
        setPrescription({
            ...prescription,
            [field]: value
        });
    };

    return (
        <div className='row gap-4 mx-auto'> {/* use flex row to put all in row format */}

            {/* date */}
            <div className='col-md-5'>
                <div className='input-group'>
                    <span className='input-group-text'>Date</span>
                    <input type="date" className='form-control' value={prescription.date.replace('T00:00:00.000Z', '')} onChange={(e) => handleChange('date', e.target.value)} readOnly={!isEditable} />
                </div>
            </div>

            {/* Doctor */}
            <div className='col-md-5'>
                <div className='input-group'>
                    <span className='input-group-text'>Doctor</span>
                    <select className='form-control' value={prescription.doctor} onChange={(e) => handleChange('doctor', e.target.value)} disabled={!isEditable}>
                        {doctors.map((doctor, index) => (
                            <option key={index} value={doctor}>
                                {doctor}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Right Eye */}
            <div className='col-md-5'>
                <div className='my-3 mx-2'>
                    <strong>Right Eye</strong>
                </div>
                <div className='my-3'>
                    <div className='input-group'>
                        <span className='input-group-text'>Right SPH</span>
                        <input type="text" className='form-control' value={prescription.right_sph} onChange={(e) => handleChange('right_sph', e.target.value)} readOnly={!isEditable} />
                    </div>
                </div>

                <div className='my-3'>
                    <div className='input-group'>
                        <span className='input-group-text'>Right CYL</span>
                        <input type="text" className='form-control' value={prescription.right_cyl} onChange={(e) => handleChange('right_cyl', e.target.value)} readOnly={!isEditable} />
                    </div>
                </div>
                <div className='my-3'>
                    <div className='input-group'>
                        <span className='input-group-text'>Right Axis</span>
                        <input type="text" className='form-control' value={prescription.right_axis} onChange={(e) => handleChange('right_axis', e.target.value)} readOnly={!isEditable} />
                    </div>
                </div>
                <div className='my-3'>
                    <div className='input-group'>
                        <span className='input-group-text'>Right Vision</span>
                        <input type="text" className='form-control' value={prescription.right_vision} onChange={(e) => handleChange('right_vision', e.target.value)} readOnly={!isEditable} />
                    </div>
                </div>
            </div>

            {/* Left Eye */}
            <div className='col-md-5'>
                <div className='my-3 mx-2'>
                    <strong>Left Eye</strong>
                </div>
                <div className='my-3'>
                    <div className='input-group'>
                        <span className='input-group-text'>Left SPH</span>
                        <input type="text" className='form-control' value={prescription.left_sph} onChange={(e) => handleChange('left_sph', e.target.value)} readOnly={!isEditable} />
                    </div>
                </div>
                <div className='my-3'>
                    <div className='input-group'>
                        <span className='input-group-text'>Left CYL</span>
                        <input type="text" className='form-control' value={prescription.left_cyl} onChange={(e) => handleChange('left_cyl', e.target.value)} readOnly={!isEditable} />
                    </div>
                </div>
                <div className='my-3'>
                    <div className='input-group'>
                        <span className='input-group-text'>Left Axis</span>
                        <input type="text" className='form-control' value={prescription.left_axis} onChange={(e) => handleChange('left_axis', e.target.value)} readOnly={!isEditable} />
                    </div>
                </div>
                <div className='my-3'>
                    <div className='input-group'>
                        <span className='input-group-text'>Left Vision</span>
                        <input type="text" className='form-control' value={prescription.left_vision} onChange={(e) => handleChange('left_vision', e.target.value)} readOnly={!isEditable} />
                    </div>
                </div>
            </div>

            {/* Addition */}
            <div className='col-md-5'>
                <div className='input-group'>
                    <span className='input-group-text'>Addition</span>
                    <input type="text" className='form-control' value={prescription.addition} onChange={(e) => handleChange('addition', e.target.value)} readOnly={!isEditable} />
                </div>
            </div>

            {/* IPD */}
            <div className='col-md-5'>
                <div className='input-group'>
                    <span className='input-group-text'>IPD</span>
                    <input type="text" className='form-control' value={prescription.ipd} onChange={(e) => handleChange('ipd', e.target.value)} readOnly={!isEditable} />
                </div>
            </div>
        </div>
    )
}

export default PrescriptionForm