"use client";

import React, { useEffect, useState } from 'react'
import ManageBrandForm from './brands/ManageBrandForm';
import EditBrandCard from './brands/EditBrandCard';
import ShowColors from './brands/ShowColors';
import CreateNewColor from './brands/CreateNewColor';
import CurrentStatusComponent from '../helpers/CurrentStatusComponent';

const brandData = [
    {
        id: 1,
        name: 'Hydro',
        colors: [
            {
                id: 1,
                name: 'Aqua Blue',
                colorTags: ['Blue', 'Aqua'],
                description: 'Bright and vibrant',
                lifeTime: '1 month',
                planoPrice: 3000,
                powerPrice: 3500,
                images: ["https://picsum.photos/200", "https://picsum.photos/200"],
                batches: [
                    {
                        batchId: 1,
                        id: 1,
                        expiryDate: '2026-12-31',
                        stock: [
                            { power: "-0.25", quantity: "100" },
                            { power: "-0.50", quantity: "200" }
                        ]
                    },
                    {
                        batchId: 2,
                        id: 2,
                        expiryDate: '2025-11-30',
                        stock: [
                            { power: "-0.75", quantity: "150" },
                            { power: "-1.00", quantity: "250" }
                        ]
                    }
                ]
            },
            {
                id: 2,
                name: 'Hazel',
                colorTags: ['brown', 'hazel'],
                description: 'Warm and soft',
                lifeTime: '1 month',
                planoPrice: 3000,
                powerPrice: 3500,
                images: ["https://picsum.photos/200", "https://picsum.photos/200"],
                batches: [
                    {
                        batchId: 3,
                        id: 1,
                        expiryDate: '2026-12-31',
                        stock: [
                            { power: "-0.25", quantity: "100" },
                            { power: "-0.50", quantity: "200" }
                        ]
                    },
                    {
                        batchId: 4,
                        id: 1,
                        expiryDate: '2025-11-30',
                        stock: [
                            { power: "-0.75", quantity: "150" },
                            { power: "-1.00", quantity: "250" }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        name: 'FresLook',
        colors: [
            {
                id: 1,
                name: 'Hazel',
                colorTags: ['brown', 'hazel'],
                description: 'Warm and soft',
                lifeTime: '1 month',
                planoPrice: 3000,
                powerPrice: 3500,
                images: ["https://picsum.photos/200", "https://picsum.photos/200"],
                batches: [
                    {
                        batchId: 3,
                        id: 1,
                        expiryDate: '2026-12-31',
                        stock: [
                            { power: "-0.25", quantity: "100" },
                            { power: "-0.50", quantity: "200" }
                        ]
                    },
                    {
                        batchId: 4,
                        id: 1,
                        expiryDate: '2025-11-30',
                        stock: [
                            { power: "-0.75", quantity: "150" },
                            { power: "-1.00", quantity: "250" }
                        ]
                    }
                ]
            }
        ]
    }
];


function ManageContactLens() {
    const [status, setStatus] = useState({status: 'hide', message: ''});
    const [brands, setBrands] = useState(null)
    const [selectedBrand, setSelectedBrand] = useState(null);

    return (
        <div className='container mt-5'>
            {!selectedBrand && <ManageBrandForm brands={brands} setBrands={setBrands} selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand}  setStatus={setStatus} />}

            {selectedBrand && <>

                {/* Section for showing and edit brand */}
                <EditBrandCard selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} setStatus={setStatus} />

                <hr className='mb-5' />

                {/* Section for showing all Colors for selected brand */}
                <ShowColors selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} setStatus={setStatus} />

                <hr className='my-3' />
                <CreateNewColor selectedBrand={selectedBrand}  setSelectedBrand={setSelectedBrand} setStatus={setStatus} />

            </>}
            <CurrentStatusComponent status={status} setStatus={setStatus} />
        </div>

    )
}

export default ManageContactLens