"use client";

import React, { useEffect, useState } from 'react'
import ManageBrandForm from './ManageBrandForm';
import EditBrandCard from './EditBrandCard';
import ShowProducts from './ShowProducts';
import CreateNewProduct from './CreateNewProduct';
import CurrentStatusComponent from '../helpers/CurrentStatusComponent';

const brandData = [
    {
        id: 1,
        name: 'Univision',
        products: [
            {
                id: 1,
                name: 'Hardcoat',
                description: 'very Good',
                images: ["https://picsum.photos/200", "https://picsum.photos/200"],
                batches: [
                    {
                        batchId: 1,
                        id: 1,
                        expiryDate: '2026-12-31',
                        inventory: [
                            { sph: "+0.25", cyl: "-0.25", quantity: "100" },
                            { sph: "+0.50", cyl: "-0.50", quantity: "200" }
                        ]
                    },
                    {
                        batchId: 2,
                        id: 2,
                        expiryDate: '2025-11-30',
                        inventory: [
                            { sph: "+0.75", cyl: "-0.75", quantity: "150" },
                            { sph: "+1.00", cyl: "-1.00", quantity: "250" }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        name: 'OptiClear',
        products: [
            {
                id: 2,
                name: 'Anti-Reflective',
                description: 'Reduces glare',
                images: ["https://picsum.photos/200", "https://picsum.photos/200"],
                batches: [
                    {
                        batchId: 3,
                        id: 3,
                        expiryDate: '2024-10-15',
                        inventory: [
                            { sph: "+1.25", cyl: "-1.25", quantity: "120" },
                            { sph: "+1.50", cyl: "-1.50", quantity: "180" }
                        ]
                    },
                    {
                        batchId: 4,
                        id: 4,
                        expiryDate: '2023-09-20',
                        inventory: [
                            { sph: "+1.75", cyl: "-1.75", quantity: "140" },
                            { sph: "+2.00", cyl: "-2.00", quantity: "160" }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 3,
        name: 'VisionPro',
        products: [
            {
                id: 3,
                name: 'Blue Light Filter',
                description: 'Protects from blue light',
                images: ["https://picsum.photos/200", "https://picsum.photos/200"],
                batches: [
                    {
                        batchId: 5,
                        id: 5,
                        expiryDate: '2027-08-10',
                        inventory: [
                            { sph: "+2.25", cyl: "-2.25", quantity: "110" },
                            { sph: "+2.50", cyl: "-2.50", quantity: "130" }
                        ]
                    },
                    {
                        batchId: 6,
                        id: 6,
                        expiryDate: '2026-07-05',
                        inventory: [
                            { sph: "+2.75", cyl: "-2.75", quantity: "150" },
                            { sph: "+3.00", cyl: "-3.00", quantity: "170" }
                        ]
                    }
                ]
            }
        ]
    }
];

function ManagePrescriptionLens() {
    const [status, setStatus] = useState({status: 'hide', message: ''});
    const [brands, setBrands] = useState(brandData)
    const [selectedBrand, setSelectedBrand] = useState(null);

    return (
        <div className='container mt-5'>
            {!selectedBrand && <ManageBrandForm brands={brands} setBrands={setBrands} selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} setStatus={setStatus} />}

            {selectedBrand && <>

                {/* Section for showing and edit brand */}
                <EditBrandCard selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} setStatus={setStatus} />

                <hr className='mb-5' />

                {/* Section for showing all products for selected brand */}
                <ShowProducts selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} setStatus={setStatus}/>

                <hr className='my-3' />
                <CreateNewProduct selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} setStatus={setStatus}/>

            </>}
            <CurrentStatusComponent status={status} setStatus={setStatus} />
        </div>

    )
}

export default ManagePrescriptionLens