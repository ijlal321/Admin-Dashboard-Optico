import React, { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react';



function OtherLoader({ item, setItem, isEditable }) {

    const [productData, setProductData] = useState(null);

    const handleDeleteButton = () => {
        setItem({ id: item.id, delete: true }); // this would delete from UI, ** IMP
        console.log('Delete contact lens');
    }


    return (
        <div style={{ border: "2px dashed black", padding: "20px", borderRadius: "10px" }}>

            {/* header with title and delete button */}
            <div className='d-flex justify-content-between align-items-center mb-3'>
                <h3 style={{ fontSize: "1.5rem" }}>Other Product Info</h3>
                {isEditable && <Trash2 color='red' style={{ cursor: "pointer" }} size={24} onClick={handleDeleteButton} />}
            </div>


            {/* line break to sectionize UI only */}
            <hr className='my-4' />

            <h3 className='mb-3' style={{fontSize:"1.2rem"}}>Price</h3>

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

export default OtherLoader