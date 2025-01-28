import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function BrandSelector({ brands, onSelect, onCreate }) {
  const [brandInput, setBrandInput] = useState('')

  const handleInputChange = (e) => {
    setBrandInput(e.target.value)
  }

  const handleCreateBrand = () => {
    if (brandInput.trim()) {
      onCreate(brandInput.trim())
      setBrandInput('')
    }
  }

  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(brandInput.toLowerCase()))

  return (
    (<div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Select or Create Brand</h2>
      <div className="flex space-x-2">
        <Input
          type="text"
          value={brandInput}
          onChange={handleInputChange}
          placeholder="Enter brand name"
          className="flex-grow" />
        <Button onClick={handleCreateBrand}>Create Brand</Button>
      </div>
      {filteredBrands.length > 0 && (
        <ul className="mt-2 border rounded-md divide-y">
          {filteredBrands.map(brand => (
            <li
              key={brand.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelect(brand)}>
              {brand.name}
            </li>
          ))}
        </ul>
      )}
    </div>)
  );
}

