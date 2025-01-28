'use client'

import { useState } from 'react'
import { BrandSelector } from './components/BrandSelector'
import { ColorManagement } from './components/ColorManagement'
import { InventoryManagement } from './components/InventoryManagement'

// Dummy data
const dummyBrands = [
  {
    id: 1,
    name: 'Acuvue',
    colors: [
      {
        id: 1,
        name: 'Clear',
        lifetime: '1 Day',
        tags: ['UV Protection', 'Daily'],
        planoPrice: 29.99,
        powerPrice: 34.99,
        images: [],
        stock: [
          {
            batchId: '1',
            expiryDate: '2025-05-15',
            inventory:[
              {
                power: '0.00',
                quantity: 100
              },
              {
                power: '-0.25',
                quantity: 200
              },
              {
                power: '-0.50',
                quantity: 300
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Bausch + Lomb',
    colors: []
  }
]

export default function ContactLensManagement() {
  const [brands, setBrands] = useState(dummyBrands)
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand)
    setSelectedColor(null)
  }

  const handleBrandCreate = (brandName) => {
    const newBrand = { id: brands.length + 1, name: brandName, colors: [] }
    setBrands([...brands, newBrand])
    setSelectedBrand(newBrand)
  }

  const handleColorSelect = (color) => {
    setSelectedColor(color)
  }

  const handleColorCreate = (newColor) => {
    const updatedBrand = {
      ...selectedBrand,
      colors: [...selectedBrand.colors, { ...newColor, stock:[], id: selectedBrand.colors.length + 1 }]
    }
    setBrands(brands.map(brand => brand.id === selectedBrand.id ? updatedBrand : brand))
    setSelectedBrand(updatedBrand)
  }

  const handleColorUpdate = (updatedColor) => {
    const updatedBrand = {
      ...selectedBrand,
      colors: selectedBrand.colors.map(color => color.id === updatedColor.id ? updatedColor : color)
    }
    setBrands(brands.map(brand => brand.id === selectedBrand.id ? updatedBrand : brand))
    setSelectedBrand(updatedBrand)
    handleColorSelect(updatedColor)
  }

  const handleColorDelete = (colorId) => {
    const updatedBrand = {
      ...selectedBrand,
      colors: selectedBrand.colors.filter(color => color.id !== colorId)
    }
    setBrands(brands.map(brand => brand.id === selectedBrand.id ? updatedBrand : brand))
    setSelectedBrand(updatedBrand)
    setSelectedColor(null)
  }

  return (
    (<div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Contact Lens Management</h1>
      <BrandSelector brands={brands} onSelect={handleBrandSelect} onCreate={handleBrandCreate} />
      {selectedBrand && (
        <ColorManagement
          brand={selectedBrand}
          onColorCreate={handleColorCreate}
          onColorUpdate={handleColorUpdate}
          onColorDelete={handleColorDelete}
          onColorSelect={handleColorSelect} />
      )}
      {selectedColor && (
        <InventoryManagement color={selectedColor} handleColorUpdate={handleColorUpdate} />
      )}

    </div>)
  );
}

