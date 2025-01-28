import React, { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react';


const frameDummyData = [
    {
        id: '1',
        brand: 'OptiClear',
        shape: 'Round',
        material: 'Plastic',
        sex: 'Unisex',
        tags: ['Lightweight', 'Durable'],
        price: '1500',
        discount: '10%',
        variants: [
            {
                id: '1',
                color: 'Black',
                images: ['https://via.placeholder.com/150'],
                inventory: [
                    { id: '1', stock: 50, location: 'Warehouse A' },
                    { id: '2', stock: 30, location: 'Warehouse B' }
                ]
            },
            {
                id: '2',
                color: 'Brown',
                images: ['https://via.placeholder.com/150'],
                inventory: [
                    { id: '1', stock: 20, location: 'Warehouse A' },
                    { id: '2', stock: 15, location: 'Warehouse B' }
                ]
            }
        ]
    },
    {
        id: '2',
        brand: 'VisionPro',
        shape: 'Square',
        material: 'Metal',
        sex: "Female",
        tags: ['Stylish', 'Comfortable'],
        price: '2000',
        discount: '15%',
        variants: [
            {
                id: '1',
                color: 'Silver',
                images: ['https://via.placeholder.com/150'],
                inventory: [
                    { id: '1', stock: 40, location: 'Warehouse A' },
                    { id: '2', stock: 25, location: 'Warehouse B' }
                ]
            },
            {
                id: '2',
                color: 'Gold',
                images: ['https://via.placeholder.com/150'],
                inventory: [
                    { id: '1', stock: 10, location: 'Warehouse A' },
                    { id: '2', stock: 5, location: 'Warehouse B' }
                ]
            }
        ]
    }
]
function FrameLoader({ item, setItem, isEditable, setStatus }) {
    // item contains information about frameId, just that, we would load frame info based on this id

    const [productData, setProductData] = useState(null);

    const handleDeleteContactLens = () => {
        setItem({ id: item.id, delete: true }); // this would delete from UI, ** IMP
        console.log('Delete contact lens');
    }

    useEffect(() => {
        LoadFrameInfo();
    }, []);

    const LoadFrameInfo = async () => {
        // load product based on item.itemId
        if (!item.itemId) return;
        const response = await fetch(`/api/frames/${item.itemId}`);
        const data = await response.json();
        if (!data.success) {
            setStatus({ status: 'error', description: "Frame not found" });
            console.log(data.error);
            setProductData(null);
            return;
        }
        if (isEditable) {
            if (data.data.sold === true) {
                setStatus({ status: 'error', description: "Frame is already sold" });
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
                <h3 style={{ fontSize: "1.5rem" }}>Frame Info</h3>
                {isEditable && <Trash2 color='red' style={{ cursor: "pointer" }} size={24} onClick={handleDeleteContactLens} />}
            </div>

            {/* an input and a button for loading frame */}
            <div className='d-flex gap-4 mb-3'>
                <input type="text" value={item.itemId} onChange={(e) => setItem({ ...item, itemId: e.target.value })} disabled={!isEditable} placeholder="Frame ID" className="form-control" />
                <button className='btn btn-success' onClick={LoadFrameInfo}>Load Frame Info</button>
            </div>

            {/* show variants and frame data only if we can find frame with some id */}
            {productData &&
                <>

                    {/* line break to sectionize UI only */}
                    <hr className='my-4' />

                    {/* select frame color and inventory location + 1 image of selected color */}
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
                            <option value="">Select Inventory</option>
                            {productData.variants.find((variant) => variant.variantId == item.variantId)?.inventory.filter((inventory) => (inventory.stock > 0 || !isEditable)).map((inventory) => (
                                <option key={inventory.inventoryId} value={inventory.inventoryId}>
                                    {inventory.location}
                                </option>
                            ))}
                        </select>

                        {/* 1 image of frame color */}
                        {item.variantId && productData.variants.find((variant) => variant.variantId == item.variantId)?.images.length > 0 && (
                            <img lazy="true" style={{ maxWidth: "200px" }} src={productData.variants.find((variant) => variant.variantId == item.variantId)?.images[0]} alt="frame" className="img-fluid" />
                        )}
                    </div>

                </>}

            {/* line break to sectionize UI only */}
            <hr className='my-4' />

            <h3 className='mb-3' style={{ fontSize: "1.2rem" }}>Lens and Price</h3>

            {/* input for lens type, lens price, frame price and description */}
            <div className='d-flex gap-4 flex-wrap'>

                <div className='mb-3'>
                    <label>
                        Lens Type:
                        <input
                            className='form-control'
                            type="text"
                            value={item.lensType}
                            onChange={(e) => setItem({ ...item, lensType: e.target.value })}
                            disabled={!isEditable}
                        />
                    </label>
                </div>

                <div className='mb-3'>
                    <label>
                        Lens Price:
                        <input
                            className='form-control'
                            type="number"
                            value={item.lensPrice}
                            onChange={(e) => setItem({ ...item, lensPrice: e.target.value })}
                            disabled={!isEditable}
                        />
                    </label>
                </div>

                <div className='mb-3'>
                    <label>
                        Frame Price:
                        <input
                            className='form-control'
                            type="number"
                            value={item.framePrice}
                            onChange={(e) => setItem({ ...item, framePrice: e.target.value })}
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

export default FrameLoader