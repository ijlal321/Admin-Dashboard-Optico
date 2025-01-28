import React, { useEffect } from 'react'
import FieldWithOptionsInput from "../addStock/FieldWithOptionsInput";
import GenericImagesForm from '../addStock/GenericImagesForm';


const sunglassColorsData = { displayName: "Color", type: "text", multi: true, options: ["red", "blue", "green"] }
const sunglassStockData = { displayName: "Stock", type: "number", multi: false, options: [1, 2, 3, 4] }
const sunglassLocationData = { displayName: "Location", type: "text", multi: false, options: ["Display", "Tray", "Warehouse"] }
const sunglassLensColorsData = { displayName: "Lens Color", type: "text", multi: true, options: ["red", "blue", "green"] }


function SunglassVariant({ data }) {
    const { variants, setVariants, images, setImages } = data;

    const handleCreateVariant = () => {
        const newVariant = {
            color: [],
            lensColor: [],
            inventory: [{ stock: 0, location: "" }]
        };

        setVariants(prevVariants => [...prevVariants, newVariant]);

        setImages(prevImages => [...prevImages, []]);
    };

    const handleCreateInventory = (variantIndex) => {

        setVariants(prevVariants =>
            prevVariants.map((variant, i) =>
                i === variantIndex
                    ? {
                        ...variant,
                        inventory: [...variant.inventory, { stock: 0, location: "" }] // Add new inventory item to variant
                    }
                    : variant
            )
        );
    };


    const handleUpdateVariant = (index, fieldName, newValue) => {
        setVariants(prevVariants =>
            prevVariants.map((variant, i) =>
                i === index ? { ...variant, [fieldName]: newValue } : variant
            )
        );
    };

    const handleStockChange = (variantIndex, inventoryIndex, newStock) => {
        setVariants(prevVariants =>
            prevVariants.map((variant, i) =>
                i === variantIndex
                    ? {
                        ...variant,
                        inventory: variant.inventory.map((item, j) =>
                            j === inventoryIndex
                                ? { ...item, stock: newStock } // Update the stock
                                : item
                        )
                    }
                    : variant
            )
        );
    };

    const handleLocationChange = (variantIndex, inventoryIndex, newLocation) => {
        setVariants(prevVariants =>
            prevVariants.map((variant, i) =>
                i === variantIndex
                    ? {
                        ...variant,
                        inventory: variant.inventory.map((item, j) =>
                            j === inventoryIndex
                                ? { ...item, location: newLocation } // Update the location
                                : item
                        )
                    }
                    : variant
            )
        );
    };

    const handleDeleteVariant = (index) => {
        setVariants(prevVariants => prevVariants.filter((_, i) => i !== index));
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const handleDeleteInventory = (variantIndex, inventoryIndex) => {
        setVariants(prevVariants =>
            prevVariants.map((variant, i) =>
                i === variantIndex
                    ? {
                        ...variant,
                        inventory: variant.inventory.filter((_, j) => j !== inventoryIndex)
                    }
                    : variant
            )
        );
    };



    return (
        <div className='row'>
            <h1 style={{ fontSize: "20px" }}>Enter Variant Information</h1>

            {/* sunglass variants attribtues */}
            {variants.map(({ color, lensColor, inventory }, variantIndex) => {
                return <div className="row" style={{ border: '3px dashed black', borderRadius: "30px", padding: "20px", margin: "20px 0" }} key={variantIndex} >

                    <div style={{ display: "grid", gridTemplateColumns: "3fr 3fr 1fr" }}>
                        {/* color input*/}
                        <FieldWithOptionsInput inputValue={color} properties={sunglassColorsData} updateField={(newInput) => handleUpdateVariant(variantIndex, "color", newInput)} />

                        {/* lens color input*/}
                        <FieldWithOptionsInput inputValue={lensColor} properties={sunglassLensColorsData} updateField={(newInput) => handleUpdateVariant(variantIndex, "lensColor", newInput)} />

                        {/* delete variant button */}
                        <button className="btn btn-danger" style={{ height: "50px", width: "auto" }} onClick={() => handleDeleteVariant(variantIndex)}>Delete Variant</button>
                    </div>
                    {/* images */}
                    <GenericImagesForm images={images} setImages={setImages} variantIndex={variantIndex} />

                    {/* inventory management */}
                    {inventory.map(({ stock, location }, inventoryIndex) => {
                        return <div key={inventoryIndex} style={{ border: '3px solid grey', borderRadius: "30px", padding: "20px", marginBottom: "20px", display: "grid", gridTemplateColumns: "2fr 2fr 1fr", width: "100%" }}>
                            <FieldWithOptionsInput properties={sunglassStockData} inputValue={stock} updateField={(newInput) => handleStockChange(variantIndex, inventoryIndex, newInput)} />
                            <FieldWithOptionsInput properties={sunglassLocationData} inputValue={location} updateField={(newInput) => handleLocationChange(variantIndex, inventoryIndex, newInput)} />
                            <div className="mb-3">
                                <button className="btn btn-danger" onClick={() => handleDeleteInventory(variantIndex, inventoryIndex)}>
                                    Delete inventory
                                </button>
                            </div>
                        </div>
                    })}

                    {/* delete inventory button */}
                    <div className="mb-3">
                        <button className="btn btn-success" onClick={() => handleCreateInventory(variantIndex)}>
                            Create new inventory
                        </button>
                    </div>

                </div>
            })}

            {/* new new variant button */}
            <div className="mb-3">
                <button className="btn btn-success" onClick={handleCreateVariant}>
                    Create new variant
                </button>
            </div>

        </div>
    )
}

export default SunglassVariant