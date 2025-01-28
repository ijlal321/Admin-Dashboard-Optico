import React, { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react';
import { set } from 'mongoose';

const ContactLensbrandData = [
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
                            { id: 1, power: "-0.25", quantity: "100" },
                            { id: 2, power: "-0.50", quantity: "200" }
                        ]
                    },
                    {
                        batchId: 2,
                        id: 2,
                        expiryDate: '2025-11-30',
                        stock: [
                            { id: 1, power: "-0.75", quantity: "150" },
                            { id: 2, power: "-1.00", quantity: "250" }
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
                            { id: 1, power: "-0.25", quantity: "100" },
                            { id: 2, power: "-0.50", quantity: "200" }
                        ]
                    },
                    {
                        batchId: 4,
                        id: 1,
                        expiryDate: '2025-11-30',
                        stock: [
                            { id: 1, power: "-0.75", quantity: "150" },
                            { id: 2, power: "-1.00", quantity: "250" }
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
                            { id: 1, power: "-0.25", quantity: "100" },
                            { id: 2, power: "-0.50", quantity: "200" }
                        ]
                    },
                    {
                        batchId: 4,
                        id: 1,
                        expiryDate: '2025-11-30',
                        stock: [
                            { id: 1, power: "-0.75", quantity: "150" },
                            { id: 2, power: "-1.00", quantity: "250" }
                        ]
                    }
                ]
            }
        ]
    }
];

function ContactLensLoader({ item, setItem, isEditable, setStatus, contactLensData }) {

    const [productData, setProductData] = useState(contactLensData);

    const handleDeleteContactLens = () => {
        setItem({id:item.id, delete:true}); // this would delete from UI, ** IMP
        console.log('Delete contact lens');
    }

    useEffect(() => {
        const loadContactLensData = async () => {
            try {
                const response = await fetch(`/api/contactLens`);
                const data = await response.json();
                if (!data.success) {
                    setStatus({ status: 'error', description: "Contact lens not found" });
                    console.log(data.error);
                    setProductData(null);
                    return;
                }
                setProductData(data.data);
            } catch (error) {
                console.log(error);
                setStatus({ status: 'error', description: "Error loading contact lens" });
            }   
        }

        loadContactLensData();
    }, []);


    const handleQuantityChange = (e) => {
        const quantity = e.target.value;
        
        if (quantity < 0) return;

        const stock = productData.find((brand) => brand.id == item.brandId)?.colors.find((color) => color.id == item.colorId)?.batches.find((batch) => batch.batchId == item.batchId)?.stock.find((stock) => stock.id == item.inventoryId)?.quantity;
        const stockInt = parseInt(stock, 10);
        const quantityInt = parseInt(quantity, 10);

        if (quantityInt > stockInt) {
            alert('Quantity exceeds stock');
            return;
        }
        setItem({ ...item, quantity });
    }

    if (!productData) return <h3>Loading...</h3>

    return (
        <div style={{ border: "2px dashed black", padding: "20px", borderRadius: "10px" }}>

            <div className='d-flex justify-content-between'>
                <h3 style={{ fontSize: "1.5rem" }}>Contact Lens info</h3>
                {isEditable && <Trash2 color='red' style={{cursor:"pointer"}} size={24} onClick={handleDeleteContactLens} />}
            </div>

            {/* inputs for about loading contact lens */}
            <div>
                <select
                    className="customSelect"
                    value={item.brandId}
                    onChange={(e) => setItem({ ...item, brandId: e.target.value, colorId: '' })}
                    disabled={!isEditable}
                >
                    <option value="">Other Brand</option>
                    {productData.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                            {brand.name}
                        </option>
                    ))}
                </select>

                {item.brandId && <select
                    className="customSelect"
                    value={item.colorId}
                    onChange={(e) => setItem({ ...item, colorId: e.target.value})}
                    disabled={!isEditable}
                >
                    <option value="">Other Color</option>
                    {productData
                        .find((brand) => brand.id == item.brandId)?.colors.map((color) => (
                            <option key={color.id} value={color.id}>
                                {color.name}
                            </option>
                        ))}
                </select>}
                {
                    item.colorId && <input
                    className='customSelect'
                    type="text"
                    value={item.power}
                    onChange={(e) => setItem({ ...item, power: e.target.value })}
                    disabled={!isEditable}
                    placeholder="Power"
                />
                }


                {/* 1 image of selected product */}
                {item.brandId && item.colorId && <div>
                    <img
                    lazy="true"
                    style={{maxWidth:"200px"}} 
                    src={productData
                        .find((brand) => brand.id == item.brandId)?.colors.find((color) => color.id == item.colorId)?.images[0]} alt="product" />
                </div>}

            </div>

            {/* line break to sectionize UI only */}
            <hr className='m-4' />

            <h3>Price and Quantity</h3>

            {/* inputs for price and quantity */}
            <div className='d-flex gap-4 flex-wrap'>
                <div className=''>
                    <label>
                        Quantity (Piece):
                        <input
                            className='customSelect'
                            type="number"
                            value={item.quantity}
                            onChange={handleQuantityChange}
                            disabled={!isEditable}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Description:
                        <input
                            className='customSelect'
                            type="text"
                            value={item.description}
                            onChange={(e) => setItem({ ...item, description: e.target.value })}
                            disabled={!isEditable}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Kit:
                        <input
                            className='customSelect'
                            type="text"
                            value={item.kit}
                            onChange={(e) => setItem({ ...item, kit: e.target.value })}
                            disabled={!isEditable}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Total Price:
                        <input
                            className='customSelect'
                            type="text"
                            value={item.price}
                            onChange={(e) => setItem({ ...item, price: e.target.value })}
                            disabled={!isEditable}
                        />
                    </label>
                </div>


                {/* {item.inventoryId && <div>
                <p>Original Price: {productData
                    .find((brand) => brand.id == item.brandId)?.colors.find((color) => color.id == item.colorId)?.planoPrice || 'N/A'}</p>
            </div>} */}
            </div>

        </div>)
}

export default ContactLensLoader