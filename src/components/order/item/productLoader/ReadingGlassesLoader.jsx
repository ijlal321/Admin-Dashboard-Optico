import React, { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react';


const readingGlassDummyData = [
    {
        id: 1,
        brand: "RayBan",
        shape: ["Round", "Square"],
        material: ["Plastic", "Metal"],
        sex: ["male"],
        tags: ["UV Protection", "Polarized"],
        price: 2000,
        discount: 10,
        variants: [
            {
                id: 1,
                color: "Black",
                inventory: [
                    { id: 1, location: "A", stock: 10, power: "+1" },
                    { id: 2, location: "B", stock: 20, power: "+2" }
                ],
                images: ["https://via.placeholder.com/150"]
            },
            {
                id: 2,
                color: "Red",
                inventory: [
                    { id: 1, location: "A", stock: 5, power: "+1" },
                    { id: 2, location: "B", stock: 15, power: "+2" }
                ],
                images: ["https://via.placeholder.com/150"]
            }
        ]
    },
    {
        id: 2,
        brand: "Gucci",
        shape: ["Round", "Square"],
        material: ["Plastic", "Metal"],
        sex: ["Male"],
        tags: ["UV Protection", "Polarized"],
        price: 3000,
        discount: 15,
        variants: [
            {
                id: 1,
                color: "Black",
                inventory: [
                    { id: 1, location: "A", stock: 10, power: "+1" },
                    { id: 2, location: "B", stock: 20, power: "+3" },
                ],
                images: ["https://via.placeholder.com/150"]
            },
            {
                id: 2,
                color: "Red",
                inventory: [
                    { id: 1, location: "A", stock: 5, power: "+1" },
                    { id: 2, location: "B", stock: 15, power: "+3" },
                ],
                images: ["https://via.placeholder.com/150"]
            }
        ]
    }
]


function ReadingGlassesLoader({ item, setItem, isEditable, setStatus }) {

    const [productData, setProductData] = useState(null);

    const handleDeleteButton = () => {
        setItem({ id: item.id, delete: true }); // this would delete from UI, ** IMP
        console.log('Delete contact lens');
    }

    useEffect(() => {
        LoadReadingGlassInfo();
    }, []);

    const LoadReadingGlassInfo = async () => {
        // load product based on item.itemId
        if (!item.itemId) return;
        const response = await fetch(`/api/readingGlass/${item.itemId}`);
        const data = await response.json();
        if (!data.success) {
            setStatus({ status: 'error', description: "Product not found" });
            console.log(data.error);
            setProductData(null);
            return;
        }
        if (isEditable) {
            if (data.data.sold === true) {
                setStatus({ status: 'error', description: "Product is already sold" });
                setProductData(null);
                return;
            }
            // remove variants with zero stock total
            data.data.variants = data.data.variants.filter(variant => variant.inventory.reduce((acc, curr) => acc + curr.stock, 0) > 0);
        }
        const selectedProduct = data.data;
        if (!selectedProduct) return;
        setProductData(selectedProduct);
    }


    return (
        <div style={{ border: "2px dashed black", padding: "20px", borderRadius: "10px" }}>

            {/* header with title and delete button */}
            <div className='d-flex justify-content-between align-items-center mb-3'>
                <h3 style={{ fontSize: "1.5rem" }}>Reading Glass Info</h3>
                {isEditable && <Trash2 color='red' style={{ cursor: "pointer" }} size={24} onClick={handleDeleteButton} />}
            </div>

            {/* an input and a button for loading Reading Glass */}
            <div className='d-flex gap-4 mb-3'>
                <input type="text" value={item.itemId} onChange={(e) => setItem({ ...item, itemId: e.target.value })} disabled={!isEditable} placeholder="Reading Glass ID" className="form-control" />
                <button className='btn btn-success' onClick={LoadReadingGlassInfo}>Load Reading Glass Info</button>
            </div>

            {/* show variants and Reading Glass data only if we can find Reading Glass with some id */}
            {productData &&
                <>

                    {/* line break to sectionize UI only */}
                    <hr className='my-4' />

                    {/* select Reading Glass color and inventory location and power + 1 image of selected color (if exists) */}
                    <div className='mb-3'>
                        <select
                            className="form-select mb-2"
                            value={item.variantId}
                            onChange={(e) => setItem({ ...item, variantId: e.target.value })}
                            disabled={!isEditable}
                        >
                            <option value="">Select Color</option>
                            {productData.variants.map((variant) => (
                                <option key={variant.variantId} value={variant.variantId}>
                                    {variant.color}
                                </option>
                            ))}
                        </select>

                        <select
                            className="form-select mb-2"
                            value={item.inventoryId}
                            onChange={(e) => setItem({ ...item, inventoryId: e.target.value })}
                            disabled={!isEditable}
                        >
                            <option value="">Select Power</option>
                            {productData.variants.find((variant) => variant.variantId == item.variantId)?.inventory.filter((inventory) => (inventory.stock > 0 || !isEditable)).map((inventory) => (
                                <option key={inventory.inventoryId} value={inventory.inventoryId}>
                                    {inventory.power} - {inventory.location}
                                </option>
                            ))}
                        </select>

                        {/* show inventory stock */}
                        {item.variantId && item.inventoryId && productData.variants.find((variant) => variant.variantId == item.variantId)?.inventory.find((inventory) => inventory.inventoryId == item.inventoryId)?.stock > 0 || !isEditable && (
                            <p>Stock: {productData.variants.find((variant) => variant.variantId == item.variantId)?.inventory.find((inventory) => inventory.inventoryId == item.inventoryId)?.stock}</p>
                        )}

                        {/* 1 image of Reading Glass color */}
                        {item.variantId && productData.variants.find((variant) => variant.variantId == item.variantId)?.images.length > 0 && (
                            <img style={{ maxWidth: "200px" }} src={productData.variants.find((variant) => variant.variantId == item.variantId)?.images[0]} alt="frame" className="img-fluid" />
                        )}
                    </div>

                </>}

            {/* line break to sectionize UI only */}
            <hr className='my-4' />

            <h3 className='mb-3' style={{ fontSize: "1.2rem" }}>Lens and Price</h3>

            {/* input for price and description */}
            <div className='d-flex gap-4 flex-wrap'>

                <div className='mb-3'>
                    <label>
                        Price:
                        <input
                            className='form-control'
                            type="number"
                            value={item.price}
                            onChange={(e) => setItem({ ...item, price: e.target.value })}
                            disabled={!isEditable}
                        />
                    </label>
                </div>

                <div className='mb-3'>
                    <label>
                        Description:
                        <textarea
                            className='form-control'
                            value={item.description}
                            onChange={(e) => setItem({ ...item, description: e.target.value })}
                            disabled={!isEditable}
                        />
                    </label>
                </div>

            </div>

        </div>
    )
}

export default ReadingGlassesLoader