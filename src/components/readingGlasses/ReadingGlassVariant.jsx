import React, { useEffect } from 'react'
import FieldWithOptionsInput from "../addStock/FieldWithOptionsInput";
import GenericImagesForm from '../addStock/GenericImagesForm';


const readingGlassColorsData = { displayName: "Color", type: "text", multi: true, options: ["red", "blue", "green"] }
const readingGlassStockData = { displayName: "Stock", type: "number", multi: false, options: [1, 2, 3, 4] }
const readingGlassLocationData = { displayName: "Location", type: "text", multi: false, options: ["Display", "Tray", "Warehouse"] }
const readingGlassPowerData = { displayName: "Power", type: "text", multi: false, options: [] }


function ReadingGlassVariant({ data }) {
    const { variants, setVariants, images, setImages } = data;

    const handleCreateVariant = () => {
        const newVariant = {
            color: [],
            inventory: [{ stock: 0, location: "", power: 0 }]
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
                        inventory: [...variant.inventory, { stock: 0, location: "", power: 0 }] // Add new inventory item to variant
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

    const handlePowerChange = (variantIndex, inventoryIndex, newPower) => {
        setVariants(prevVariants =>
            prevVariants.map((variant, i) =>
                i === variantIndex
                    ? {
                        ...variant,
                        inventory: variant.inventory.map((item, j) =>
                            j === inventoryIndex
                                ? { ...item, power: newPower } // Update the location
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

    const handleUpdatePowerButton = (variantIndex, inventoryIndex, increment) => {
        const newVariants = [...variants];
        newVariants[variantIndex]['inventory'][inventoryIndex].power = Number(newVariants[variantIndex]["inventory"][inventoryIndex].power) + increment;
        setVariants(newVariants);
    }

    const handleInventoryDuplicateButton = (variantIndex, inventoryIndex, increment) => {
        const newVariants = [...variants];
        const newInventoryItem = {
            stock: newVariants[variantIndex]["inventory"][inventoryIndex].stock,
            location: newVariants[variantIndex]["inventory"][inventoryIndex].location,
            power: Number(newVariants[variantIndex]["inventory"][inventoryIndex].power) + increment
        };
        newVariants[variantIndex]['inventory'].splice(inventoryIndex + 1, 0, newInventoryItem);
        setVariants(newVariants);
    }

    return (
        <div className='row'>
            <h1 style={{ fontSize: "20px" }}>Enter Variant Information</h1>

            {/* readingGlass variants attribtues */}
            {variants.map(({ color, inventory }, variantIndex) => {
                return <div className="row" style={{ border: '3px dashed black', borderRadius: "30px", padding: "20px", margin: "20px 0" }} key={variantIndex} >

                    {/* color input*/}
                    <FieldWithOptionsInput inputValue={color} properties={readingGlassColorsData} updateField={(newInput) => handleUpdateVariant(variantIndex, "color", newInput)} />

                    {/* delete variant button */}
                    <div className="col-md-6" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <button className="btn btn-danger" style={{ width: "40%" }} onClick={() => handleDeleteVariant(variantIndex)}>Delete Variant</button>
                    </div>

                    {/* images */}
                    <GenericImagesForm images={images} setImages={setImages} variantIndex={variantIndex} />

                    {/* inventory management */}
                    {inventory.map(({ stock, location, power }, inventoryIndex) => {
                        return <div key={inventoryIndex} style={{ border: '3px solid grey', borderRadius: "30px", padding: "20px", marginBottom: "20px", display: "grid", gridTemplateColumns: "2fr 2fr 2fr 1fr", width: "100%" }}>
                            <FieldWithOptionsInput properties={readingGlassStockData} inputValue={stock} updateField={(newInput) => handleStockChange(variantIndex, inventoryIndex, newInput)} />
                            <FieldWithOptionsInput properties={readingGlassLocationData} inputValue={location} updateField={(newInput) => handleLocationChange(variantIndex, inventoryIndex, newInput)} />

                            <div>
                                <FieldWithOptionsInput properties={readingGlassPowerData} inputValue={power} updateField={(newInput) => handlePowerChange(variantIndex, inventoryIndex, newInput)} />
                                <div className="mb-3">
                                    <button className="btn btn-success w-50" onClick={() => handleUpdatePowerButton(variantIndex, inventoryIndex, 0.25)}>
                                        +0.25
                                    </button>
                                </div>
                                <div className="mb-3">
                                    <button className="btn btn-success w-50" onClick={() => handleUpdatePowerButton(variantIndex, inventoryIndex, 1.00)}>
                                        +1.00
                                    </button>
                                </div>
                            </div>

                            {/* delete inventory and duplicates button */}
                            <div>
                                {/* delete inventory button */}
                                <div className="mb-3">
                                    <button className="btn btn-danger" onClick={() => handleDeleteInventory(variantIndex, inventoryIndex)}>
                                        Delete inventory
                                    </button>
                                </div>
                                <div className="mb-3">
                                    <button className="btn btn-info" onClick={() => {handleInventoryDuplicateButton(variantIndex, inventoryIndex, 0.25)}}>
                                        Duplicate +0.25
                                    </button>
                                </div>
                                <div className="mb-3">
                                    <button className="btn btn-info" onClick={() => {handleInventoryDuplicateButton(variantIndex, inventoryIndex, 0.50)}}>
                                        Duplicate
                                    </button>
                                </div>
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

export default ReadingGlassVariant