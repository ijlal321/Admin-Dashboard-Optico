"use client";
import React, { useEffect, useState } from 'react'
import FieldWithOptionsInput from '../../addStock/FieldWithOptionsInput';
import { searchBrandByName, addNewBrand, getAllBrands } from '@/utlis/contactLensHelper';

function ManageBrandForm({ brands, setBrands, selectedBrand, setSelectedBrand, setStatus }) {

    const [brandInput, setBrandInput] = useState('');

    const [loadingData, setLoadingData] = useState(false);
    const [filteredBrands, setFilteredBrands] = useState([]);
    const [ignoreUseeffect, setIgnoreUseEffect] = useState(false);

    const addNewBrandHandle = async () => {
        if (loadingData) return;
        setStatus({ status: 'saving', description: 'Adding new brand...' });

        // check if new brand name is valid, and is not in used before 
        if (brandInput.trim() === '') {
            setStatus({ status: 'error', description: 'Brand name cannot be empty' });
            return;
        }

        // check if brand name already exists
        const brandExists = brands.find(brand => brand.name.toLowerCase() === brandInput.toLowerCase());
        if (brandExists) {
            setStatus({ status: 'error', description: 'Brand already exists' });
            return;
        }

        // add new brand
        const newBrand = { name: brandInput, products: [] };
        const data = await addNewBrand(newBrand);
        if (data.success) {
            setStatus({ status: 'successful', description: 'Brand added successfully' });
            setIgnoreUseEffect(true);
            setBrandInput('');
            setBrands([...brands, data.data]);
            setSelectedBrand(data.data);
        } else {
            console.error('Error adding prescription lens:', data.error);
            setStatus({ status: 'error', description: `Failed to add brand. Error ${data.error}` });
        }

    };

    const handleSelectBrand = (brand) => {
        setIgnoreUseEffect(true);
        setBrandInput(brand.name);
        setSelectedBrand(brand);
    };


    useEffect(() => {
        const loadAllBrandsData = async () => {
            try {
                setLoadingData(true);
                const data = await getAllBrands();
                if (!data.success) {
                    throw new Error(data.error);
                }
                setBrands(data.data);
                setFilteredBrands(data.data);
                setLoadingData(false);
            } catch (error) {
                console.error('Error loading brands:', error);
                setStatus({ status: 'error', description: 'Error loading contact lens' });
            }
        }

        loadAllBrandsData();
    }, []);

    useEffect(() => {
        if (ignoreUseeffect) {
            setIgnoreUseEffect(false);
            return;
        }
        if (brandInput.trim() === '') {
            setFilteredBrands(brands);
            return;
        }
        // filter brand from brandinput based on name
        const searchedBrands = brands.filter(brand => brand.name.toLowerCase().includes(brandInput.toLowerCase()));
        setFilteredBrands(searchedBrands);
    }, [brandInput, brands]);
    

    if (!brands) return <div>Loading...</div>

    return (
        <div className="container mt-3">

            {/* section to input brand */}
            <div className='row'>
                <FieldWithOptionsInput inputValue={brandInput} properties={{ displayName: 'Enter Brand', type: 'text', multi: false, options: [] }} updateField={setBrandInput} />
                {!selectedBrand && <button className="btn btn-primary" onClick={addNewBrandHandle}>Add Brand</button>}
            </div>

            {loadingData && <div>Loading...</div>}

            {/* section for brand suggesstions */}
            {!selectedBrand && !loadingData && filteredBrands.length > 0 && (
                <ul className="list-group mt-3 col-md-6">
                    {!selectedBrand && filteredBrands.map((brand) => (
                        <li key={brand.id} className="list-group-item list-group-item-action" style={{ cursor: 'pointer' }} onClick={() => handleSelectBrand(brand)}>
                            {brand.name}
                        </li>
                    ))}
                </ul>
            )}




        </div>
    )
}

export default ManageBrandForm