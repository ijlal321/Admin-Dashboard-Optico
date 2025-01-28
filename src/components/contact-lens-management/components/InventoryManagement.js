import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Pencil, Trash, StopCircle } from 'lucide-react';
import { useEffect } from 'react';

// Dummy data to simulate batches loaded from an API
const dummyBatches = [
  { id: '1', orderDate: '2023-05-15', receivedDate: '2023-05-20', location: 'New York', supplier: 'Supplier A', cartons: 26, description: 'First batch' },
  { id: '2', orderDate: '2023-06-01', receivedDate: '2023-06-07', location: 'Los Angeles', supplier: 'Supplier B', cartons: 35, description: 'Summer collection' },
  { id: '3', orderDate: '2023-06-15', receivedDate: '2023-06-22', location: 'Chicago', supplier: 'Supplier C', cartons: 26, description: 'Fall preview' },
  { id: '4', orderDate: '2023-07-01', receivedDate: '2023-07-08', location: 'Miami', supplier: 'Supplier E', cartons: 40, description: 'Beach essentials' },
  { id: '5', orderDate: '2023-07-15', receivedDate: '2023-07-22', location: 'Seattle', supplier: 'Supplier D', cartons: 30, description: 'Tech gadgets' },
]

export function InventoryManagement({ color, handleColorUpdate }) {
  const [allBatches, setAllBatches] = useState(dummyBatches)
  const [editingBatchId, setEditingBatchId] = useState(null)
  const [selectedBatchId, setSelectedBatchId] = useState('')
  const [unUsedBatches, setUnUsedBatches] = useState([]);
  const [newStock, setNewStock] = useState({ power: '', quantity: '' });
  const [editingStock, setEditingStock] = useState([]);
  const [expiry, setExpiry] = useState('')

  useEffect(() => {
    const unused = allBatches.filter(batch => !color.stock.some(stock => stock.batchId === batch.id));
    setUnUsedBatches(unused);
  }, [color.stock]);

  const handleEditBatch = (batchId) => {
    setEditingBatchId(batchId)
    const stockToEdit = color.stock.find(stock => stock.batchId === batchId);
    if (stockToEdit) {
      setEditingStock(JSON.parse(JSON.stringify(stockToEdit.inventory)));
    }
    setExpiry(stockToEdit.expiryDate);
  }

  const handleSaveBatch = (batch) => {
    // create a new copy of color, but with inventory updated as editingStock on index of batchId
    const updatedColor = {
      ...color,
      stock: color.stock.map(stock => {
        if (stock.batchId === batch.id) {
          return {
            ...stock,
            expiryDate: expiry,
            inventory: editingStock
          }
        }
        return stock;
      })
    }
    setEditingBatchId(null)
    setEditingStock([]);
    setExpiry('');
    setSelectedBatchId('');
    handleColorUpdate(updatedColor);
  }

  const handleDeleteBatch = (batchId) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      // create copy of colors without the batchId
      const updatedColor = {
        ...color,
        stock: color.stock.filter(stock => stock.batchId !== batchId)
      }
      handleColorUpdate(updatedColor);      
    }
  }

  const handleSelectUnusedBatch = () => {
    const selectedBatch = allBatches.find(batch => batch.id === selectedBatchId);

    if (selectedBatch) {
      const confirmAdd = window.confirm('Do you want to enter data for this new batch?');
      if (confirmAdd) {
        // create copy of color, add new batch to stock with batchId selectedBatchId
        const updatedColor = {
          ...color,
          expiryDate: new Date().toISOString().split('T')[0],
          stock: [...color.stock, { batchId: selectedBatchId, expiryDate:"", inventory: [] }]
        }
        handleColorUpdate(updatedColor);
        setEditingBatchId(selectedBatchId);
        setSelectedBatchId('');
      }
    }
  }

  const handleUpdatePower = (index, field, newValue ) =>{
    if (field == 'power'){ // and power cannot be more than 10
      if (newValue % 0.25 !== 0 || newValue > 10) {
        return;
      }
    }
    const updatedStock = [...editingStock];
    updatedStock[index][field] = newValue;
    setEditingStock(updatedStock);
  }

  const handleAddStock = (stockItem) => {
    // check if power already exists and power or stock isnt empty, 
    if (editingStock.some(item => item.power === newStock.power) || !newStock.power || !newStock.quantity) {
      return;
    }
    const updatedStock = [...editingStock, newStock];
    setEditingStock(updatedStock);
    setNewStock({ power: '', quantity: '' });
  }

  const handleRemovePower = (index) => {
    const updatedStock = editingStock.filter((item, i) => i !== index);
    setEditingStock(updatedStock);
  }

  

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Inventory for {color.name}</h2>

      {/* batch selection section */}
      <div className="flex justify-between items-center mb-4">
        <Select onValueChange={(value) => setSelectedBatchId(value)} value={selectedBatchId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a batch" />
          </SelectTrigger>
          <SelectContent>
            {unUsedBatches.map(batch => (
              <SelectItem key={batch.id} value={batch.id}>
                {batch.cartons} - {batch.supplier} ({batch.orderDate})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleSelectUnusedBatch}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Batch
        </Button>
      </div>

      {/* batch details section */}
        {color.stock.map(stockItem => {
          const batch = allBatches.find(batch => batch.id === stockItem.batchId);
          return (
            <Card key={stockItem.batchId} className="mb-4">
          {/* Header */}
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {batch.description} - {batch.supplier}
              <div>
            {editingBatchId === stockItem.batchId ? (
              <Button variant="ghost" size="sm" onClick={() => handleSaveBatch(batch)}>
                Save
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => handleEditBatch(stockItem.batchId)}>
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => handleDeleteBatch(stockItem.batchId)}>
              <Trash className="h-4 w-4" />
            </Button>
              </div>
            </CardTitle>
          </CardHeader>

          {/* Content */}
          <CardContent>
            {editingBatchId === stockItem.batchId ? (
              <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`supplier-${batch.id}`}>Supplier</Label>
                <Input
              id={`supplier-${batch.id}`}
              value={batch.supplier}
              readOnly={true} 
              />
              </div>
              <div>
                <Label htmlFor={`cartons-${batch.id}`}>Carton Count</Label>
                <Input
              id={`cartons-${batch.id}`}
              type="number"
              value={batch.cartons}
              readOnly={true}
              />
              </div>
              <div>
                <Label htmlFor={`orderDate-${batch.id}`}>Order Date</Label>
                <Input
              id={`orderDate-${batch.id}`}
              type="date"
              value={batch.orderDate}
              readOnly={true}
              />
              </div>
              <div>
                <Label htmlFor={`receivedDate-${batch.id}`}>Received Date</Label>
                <Input
              id={`receivedDate-${batch.id}`}
              type="date"
              value={batch.receivedDate}
              readOnly={true} 
              />              
              </div>
              <div>
                <Label htmlFor={`expiryDate-${batch.id}`}>Expiry Date</Label>
                <Input
              id={`receivedDate-${batch.id}`}
              type="date"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
              <TableHead>Power</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {editingStock.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                value={item.power}
                onChange={(e) => handleUpdatePower(index, 'power', e.target.value)} />
                </TableCell>
                <TableCell>
                  <Input
                type="number"
                value={item.quantity}
                onChange={(e) => handleUpdatePower(index, 'quantity', e.target.value)} />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => handleRemovePower(index)}>
                <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
                ))}
                <TableRow>
              <TableCell>
                <Input
                  placeholder="New Power"
                  value={newStock.power}
                  onChange={(e) => setNewStock(prev => ({ ...prev, power: e.target.value }))} />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={newStock.quantity}
                  onChange={(e) => setNewStock(prev => ({ ...prev, quantity: e.target.value }))} />
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => handleAddStock(stockItem)}>
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </TableCell>
                </TableRow>
              </TableBody>
            </Table>
              </div>
            ) : (
              <div>
            <p>Supplier: {batch.supplier}</p>
            <p>Carton Count: {batch.cartons}</p>
            <p>Order Date: {batch.orderDate}</p>
            {/* <p>Received Date: {batch.receivedDate}</p> */}
            <p>Expiry Date: {stockItem.expiryDate}</p>
            <Table>
              <TableHeader>
                <TableRow>
              <TableHead>Power</TableHead>
              <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockItem.inventory.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.power}</TableCell>
                <TableCell>{item.quantity}</TableCell>
              </TableRow>
                ))}
              </TableBody>
            </Table>
              </div>
            )}
          </CardContent>
            </Card>
          );
      })}
    </div>
  );
}

