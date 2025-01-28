'use client'

import { useState } from 'react'
import { PlusCircle, X } from 'lucide-react'
import GenericImagesForm from './GenericImagesForm'

export default function AddNewContactLensPage({ lens, setLens, images, setImages, handleSaveContactLens }) {

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setLens(prev => ({ ...prev, [name]: value }))
    }

    const handleTagsChange = (e) => {
        const tags = e.target.value.split(',').map(tag => tag.trim())
        setLens(prev => ({ ...prev, tags }))
    }
    const addColor = () => {
        setLens(prev => ({
            ...prev,
            colors: [...prev.colors, { name: '', planoPrice: '', powerPrice: '', inventory: [{ power: '0.00', stock: '0' }] }]
        }));
        setImages(prev => [...prev, []]);
    };

    const removeColor = (index) => {
        setLens(prev => ({
            ...prev,
            colors: prev.colors.filter((_, i) => i !== index)
        }));
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleColorChange = (index, field, value) => {
        setLens(prev => ({
            ...prev,
            colors: prev.colors.map((color, i) =>
                i === index ? { ...color, [field]: value } : color
            )
        }))
    }

    const addInventoryItem = (colorIndex) => {
        setLens(prev => ({
            ...prev,
            colors: prev.colors.map((color, i) =>
                i === colorIndex
                    ? { ...color, inventory: [...color.inventory, { power: '0.00', stock: '0' }] }
                    : color
            )
        }))
    }

    const duplicateInventoryItem = (colorIndex, increment) => {
        setLens(prev => ({
            ...prev,
            colors: prev.colors.map((color, i) => {
                if (i === colorIndex) {
                    const lastItem = color.inventory[color.inventory.length - 1];
                    const newPower = (parseFloat(lastItem.power || 0.00) + increment).toFixed(2);
                    return {
                        ...color,
                        inventory: [...color.inventory, { power: newPower, stock: lastItem.stock }]
                    };
                }
                return color;
            })
        }));
    };

    const removeInventoryItem = (colorIndex, inventoryIndex) => {
        setLens(prev => ({
            ...prev,
            colors: prev.colors.map((color, i) =>
                i === colorIndex
                    ? { ...color, inventory: color.inventory.filter((_, j) => j !== inventoryIndex) }
                    : color
            )
        }))
    }

    const handleInventoryChange = (colorIndex, inventoryIndex, field, value) => {
        setLens(prev => ({
            ...prev,
            colors: prev.colors.map((color, i) =>
                i === colorIndex
                    ? {
                        ...color,
                        inventory: color.inventory.map((item, j) =>
                            j === inventoryIndex ? { ...item, [field]: value } : item
                        )
                    }
                    : color
            )
        }))
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Add New Contact Lens</h1>
            <form onSubmit={handleSaveContactLens} className="space-y-6">
                <div>
                    <label htmlFor="brand" className="block mb-1 font-medium">Brand</label>
                    <input
                        type="text"
                        id="brand"
                        name="brand"
                        value={lens.brand}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="life" className="block mb-1 font-medium">Life</label>
                    <select
                        id="life"
                        name="life"
                        value={lens.life}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="yearly">Yearly</option>
                        <option value="6 months">6 Months</option>
                        <option value="1 day">1 Day</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="tags" className="block mb-1 font-medium">Tags (comma-separated)</label>
                    <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={lens.tags.join(', ')}
                        onChange={handleTagsChange}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block mb-1 font-medium">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={lens.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        rows="3"
                    ></textarea>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">Colors and Inventory</h2>
                    {lens.colors.map((color, colorIndex) => (
                        <div key={colorIndex} className="mb-4 p-4 border rounded">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-medium">Color {colorIndex + 1}</h3>
                                <button
                                    type="button"
                                    onClick={() => removeColor(colorIndex)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block mb-1">Color Name</label>
                                    <input
                                        type="text"
                                        value={color.name}
                                        onChange={(e) => handleColorChange(colorIndex, 'name', e.target.value)}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">Plano Price</label>
                                    <input
                                        type="number"
                                        value={color.planoPrice}
                                        onChange={(e) => handleColorChange(colorIndex, 'planoPrice', e.target.value)}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">Power Price</label>
                                    <input
                                        type="number"
                                        value={color.powerPrice}
                                        onChange={(e) => handleColorChange(colorIndex, 'powerPrice', e.target.value)}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                            </div>
                            <GenericImagesForm images={images} setImages={setImages} variantIndex={colorIndex} />
                            <h4 className="font-medium mb-2">Inventory</h4>
                            {color.inventory.map((item, inventoryIndex) => (
                                <div key={inventoryIndex} className="flex items-center space-x-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Power"
                                        value={item.power}
                                        onChange={(e) => handleInventoryChange(colorIndex, inventoryIndex, 'power', e.target.value)}
                                        className="w-1/3 p-2 border rounded"
                                        required
                                    />
                                    <input
                                        type="number"
                                        placeholder="Stock"
                                        value={item.stock}
                                        onChange={(e) => handleInventoryChange(colorIndex, inventoryIndex, 'stock', e.target.value)}
                                        className="w-1/3 p-2 border rounded"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeInventoryItem(colorIndex, inventoryIndex)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X size={20} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleInventoryChange(colorIndex, inventoryIndex, 'stock', parseInt(item.stock || 0) + 50)}
                                        className="text-green-500 hover:text-green-700"
                                    >
                                        <PlusCircle size={20} /> +50
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleInventoryChange(colorIndex, inventoryIndex, 'stock', Math.max(0, parseInt(item.stock || 0) - 25))}
                                        className="text-green-500 hover:text-green-700"
                                    >
                                        <X size={20} /> -25
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleInventoryChange(colorIndex, inventoryIndex, 'stock', parseInt(item.stock || 0) + 100)}
                                        className="text-green-500 hover:text-green-700"
                                    >
                                        <PlusCircle size={20} /> +100
                                    </button>
                                </div>
                            ))}
                            <div className='flex space-x-4'>
                                <button
                                    type="button"
                                    onClick={() => addInventoryItem(colorIndex)}
                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                >
                                    <PlusCircle size={20} className="mr-1" /> Add Power
                                </button>
                                {color.inventory.length > 0 &&
                                <>
                                <button
                                    type="button"
                                    onClick={() => duplicateInventoryItem(colorIndex, 0.25)}
                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                >
                                    <PlusCircle size={20} className="mr-1" /> Duplicate +0.25 
                                </button>
                                <button
                                    type="button"
                                    onClick={() => duplicateInventoryItem(colorIndex, 0.50)}
                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                >
                                    <PlusCircle size={20} className="mr-1" /> Duplicate +0.50 
                                </button>
                                </>
                                }
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addColor}
                        className="text-green-500 hover:text-green-700 flex items-center"
                    >
                        <PlusCircle size={20} className="mr-1" /> Add Color
                    </button>
                </div>

                <hr className="my-4" />

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Add Contact Lens
                </button>
            </form>
        </div>
    )
}

