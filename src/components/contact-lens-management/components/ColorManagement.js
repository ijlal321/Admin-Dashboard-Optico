import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PlusCircle, Pencil, Trash, X } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ColorManagement({ brand, onColorCreate, onColorUpdate, onColorDelete, onColorSelect }) {
  const [newColor, setNewColor] = useState({
    name: '',
    lifetime: '',
    tags: '',
    planoPrice: '',
    powerPrice: '',
    images: []
  })
  const [editingColorId, setEditingColorId] = useState(null)
  const [filterLifetime, setFilterLifetime] = useState('all') // Updated initial state
  const [filterColor, setFilterColor] = useState('')

  const filteredColors = brand.colors.filter(color => {
    const lifetimeMatch = filterLifetime === 'all' || color.lifetime === filterLifetime // Updated filter logic
    const colorMatch = !filterColor || 
      color.name.toLowerCase().includes(filterColor.toLowerCase()) || 
      color.tags.some(tag => tag.toLowerCase().includes(filterColor.toLowerCase()))
    return lifetimeMatch && colorMatch
  })

  const uniqueLifetimes = [...new Set(brand.colors.map(color => color.lifetime))]

  const handleNewColorChange = (e) => {
    const { name, value } = e.target
    setNewColor(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateColor = () => {
    onColorCreate({
      ...newColor,
      tags: newColor.tags.split(',').map(tag => tag.trim()),
      planoPrice: parseFloat(newColor.planoPrice),
      powerPrice: parseFloat(newColor.powerPrice)
    })
    setNewColor(
      { name: '', lifetime: '', tags: '', planoPrice: '', powerPrice: '', images: [] }
    )
  }

  const handleEditColor = (color) => {
    onColorUpdate({
      ...color,
      tags: typeof color.tags === 'string' ? color.tags.split(',').map(tag => tag.trim()) : color.tags,
      planoPrice: parseFloat(color.planoPrice),
      powerPrice: parseFloat(color.powerPrice)
    })
    setEditingColorId(null)
  }

  const handleDeleteColor = (colorId) => {
    if (window.confirm('Are you sure you want to delete this color?')) {
      onColorDelete(colorId)
    }
  }

  return (
    (<div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Colors for {brand.name}</h2>
      <div className="flex space-x-4 mb-4">
        <div className="w-1/3">
          <Label htmlFor="filterLifetime">Filter by Lifetime</Label>
          <Select onValueChange={setFilterLifetime} value={filterLifetime}>
            <SelectTrigger>
              <SelectValue placeholder="Select lifetime" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem> {/* Updated Select component */}
              {uniqueLifetimes.map(lifetime => (
                <SelectItem key={lifetime} value={lifetime}>{lifetime}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-1/3">
          <Label htmlFor="filterColor">Filter by Color or Tag</Label>
          <Input
            id="filterColor"
            value={filterColor}
            onChange={(e) => setFilterColor(e.target.value)}
            placeholder="Enter color name or tag" />
        </div>
      </div>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Add New Color</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={newColor.name}
                onChange={handleNewColorChange} />
            </div>
            <div>
              <Label htmlFor="lifetime">Lifetime</Label>
              <Input
                id="lifetime"
                name="lifetime"
                value={newColor.lifetime}
                onChange={handleNewColorChange} />
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                name="tags"
                value={newColor.tags}
                onChange={handleNewColorChange} />
            </div>
            <div>
              <Label htmlFor="planoPrice">Plano Price</Label>
              <Input
                id="planoPrice"
                name="planoPrice"
                type="number"
                value={newColor.planoPrice}
                onChange={handleNewColorChange} />
            </div>
            <div>
              <Label htmlFor="powerPrice">Power Price</Label>
              <Input
                id="powerPrice"
                name="powerPrice"
                type="number"
                value={newColor.powerPrice}
                onChange={handleNewColorChange} />
            </div>
          </div>
          <Button onClick={handleCreateColor} className="mt-4">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Color
          </Button>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredColors.map(color => (
          <Card key={color.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {color.name}
                <div>
                  {editingColorId === color.id ? (
                    <Button variant="ghost" size="sm" onClick={() => setEditingColorId(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => setEditingColorId(color.id)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteColor(color.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingColorId === color.id ? (
                <div className="space-y-2">
                  <Input
                    value={color.name}
                    onChange={(e) => onColorUpdate({ ...color, name: e.target.value })}
                    placeholder="Name" />
                  <Input
                    value={color.lifetime}
                    onChange={(e) => onColorUpdate({ ...color, lifetime: e.target.value })}
                    placeholder="Lifetime" />
                  <Input
                    value={color.tags.join(', ')}
                    onChange={(e) => onColorUpdate({ ...color, tags: e.target.value })}
                    placeholder="Tags (comma-separated)" />
                  <Input
                    type="number"
                    value={color.planoPrice}
                    onChange={(e) => onColorUpdate({ ...color, planoPrice: e.target.value })}
                    placeholder="Plano Price" />
                  <Input
                    type="number"
                    value={color.powerPrice}
                    onChange={(e) => onColorUpdate({ ...color, powerPrice: e.target.value })}
                    placeholder="Power Price" />
                  <Button onClick={() => handleEditColor(color)}>Save Changes</Button>
                </div>
              ) : (
                <>
                  <p>Lifetime: {color.lifetime}</p>
                  <p>Tags: {color.tags.join(', ')}</p>
                  <p>Plano Price: ${color.planoPrice}</p>
                  <p>Power Price: ${color.powerPrice}</p>
                  <div className="flex mt-2">
                    {color.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${color.name} ${index + 1}`}
                        className="w-12 h-12 mr-2 object-cover" />
                    ))}
                  </div>
                  <Button onClick={() => onColorSelect(color)} className="mt-2">
                    Go to Inventory
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>)
  );
}

