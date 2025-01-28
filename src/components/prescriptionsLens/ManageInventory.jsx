"use client";
import React, { useEffect, useState } from 'react'
import { CodeSlash } from 'react-bootstrap-icons';
import { Trash2, PlusCircle, Save, XCircle, MinusCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { validateInvntory } from '@/utlis/validator/prescriptionLens';
import { updateBrand } from '@/utlis/prescriptionLensHelper';



function ManageInventory({ brand, product, setProduct, allBatches, setStatus }) {

    const handleUpdateBatch = async (updatedBatch) => {
        try {
            setStatus({ status: 'loading', description: 'Saving new Data...' });
            const updatedProduct = { ...product, batches: product.batches.map(batch => batch.id == updatedBatch.id ? updatedBatch : batch) };

            const updatedBrand = { ...brand, products: brand.products.map(p => p.id == product.id ? updatedProduct : p) };

            const data = await updateBrand(updatedBrand);

            if (data.success) {
                setStatus({ status: 'successful', description: 'Data updated successfully' });
                setProduct(updatedProduct);
            } else {
                throw new Error(data.error);
            }
        } catch (e) {
            setStatus({ status: 'error', description: e.message });
            console.error('Error updating product:', e);
            return false;
        }
        return true;
    }

    const handleDeleteBatch = async (batchId) => {
        // ask window if want to delete
        if (!window.confirm('Are you sure you want to delete this batch?')) {
            return;
        }
        setStatus({status:"loading", description:"Deleting Data..."})
        const updatedProduct = { ...product, batches: product.batches.filter(batch => batch.id != batchId) };
        const updatedBrand = { ...brand, products: brand.products.map(p => p.id == product.id ? updatedProduct : p) };

        const data = await updateBrand(updatedBrand);

        if (data.success) {
            setStatus({ status: 'successful', description: 'Batch deleted successfully' });
            setProduct(updatedProduct);
        } else {
            setStatus({ status: 'error', description: `Error Deleting: ${data.error}` });
        }
    }
    return (
        <div >
            {product.batches.map(batch => {
                let batchInfo = allBatches.find(b => b._id == batch.batchId);
                if (!batchInfo) {
                    // if for some reason batch is deleted, 
                    batchInfo = {}
                }
                return <InventoryCard batch={batch} key={batch.id} batchInfo={batchInfo} handleUpdateBatch={handleUpdateBatch} handleDeleteBatch={handleDeleteBatch} setStatus={setStatus} />
            })}

        </div>
    )
}

export default ManageInventory



function InventoryCard({ batch, batchInfo, handleUpdateBatch, handleDeleteBatch, setStatus }) {
    const [isEditing, setIsEditing] = useState(false);
    const [inventory, setInventory] = useState(batch.inventory);
    const [newItem, setNewItem] = useState({ sph: '', cyl: '', quantity: '0' });
    const [expiry, setExpiry] = useState(batch.expiryDate);

    const handleCancelUpdate = () => {
        setIsEditing(false);
        setInventory(batch.inventory);
        setExpiry(batch.expiryDate);
    }

    const updateInventory = (idx, newVale, field) => {
        const updatedInventory = [...inventory];
        updatedInventory[idx][field] = newVale;
        setInventory(updatedInventory);
    }

    const handleClickUpdate = async () => {
        // validate prescription lens inventory
        const result = validateInvntory(inventory);
        if (!result.success) {
            setStatus({ status: 'error', description: result.error });
            return;
        }

        // validate expiry
        if (!expiry) return;

        // send to backend
        const newBatch = { ...batch, inventory, expiryDate:expiry };
        if (await handleUpdateBatch(newBatch)) {
            setIsEditing(false);
        }
    }

    const addToInventory = () => {
        // check new item value is not duplicate or empty
        if (newItem.sph === '' || newItem.cyl === '' || parseInt(newItem.quantity, 10) == 0) {
            setStatus({ status: 'error', description: 'All fields are required' });
            return;
        }
        const key = newItem.sph + newItem.cyl;
        if (inventory.find(item => item.sph + item.cyl == key)) {
            setStatus({ status: 'error', description: 'Duplicate inventory found' });
            return;
        }

        const newInventory = [...inventory, newItem];
        setInventory(newInventory);
        setNewItem({ sph: '', cyl: '', quantity: '0' });
    }

    const removeFromInventoery = (idx) => {
        console.log(idx);
        const updatedInventory = inventory.filter((item, index) => index != idx);
        setInventory(updatedInventory);
    }

    return (
        <div className='card m-5 p-0'>
            <div className='card-header d-flex gap-5 m-4 mb-0 align-items-center'>
                <h5>Batch {batchInfo.cartons} / Expiry: {expiry}</h5>
                {!isEditing ?
                    <>
                        <button className='btn btn-warning d-flex align-items-center gap-2' onClick={() => setIsEditing(true)}>
                            <CodeSlash size={10} /> Edit
                        </button>
                        <button className='btn btn-danger d-flex align-items-center gap-2' onClick={() => handleDeleteBatch(batch.id)}>
                            <Trash2 size={10} /> Delete
                        </button>
                    </> :
                    <>
                        <button className='btn btn-primary d-flex align-items-center gap-2' onClick={handleClickUpdate}>
                            <Save size={10} /> Update
                        </button>
                        <button className='btn btn-secondary d-flex align-items-center gap-2' onClick={handleCancelUpdate}>
                            <XCircle size={10} /> Cancel
                        </button>
                    </>
                }
            </div>
            {!isEditing ?
                <>
                    <div className='card-body'>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>SPH</th>
                                    <th>CYL</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory.map(item => (
                                    <tr key={item.sph + item.cyl}>
                                        <td>{item.sph}</td>
                                        <td>{item.cyl}</td>
                                        <td>{item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </> :
                <>

                    {/* give code for a table where we can edit quantity */}
                    <div className='card-body'>
                        {/* input for new expiry date */}
                        <p>Select Expiry Date</p>
                        <input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="border border-gray-300 p-2 rounded" />

                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>SPH</th>
                                    <th>CYL</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <input value={item.sph} onChange={(e) => updateInventory(idx, e.target.value, "sph")} />
                                        </td>
                                        <td>
                                            <input value={item.cyl} onChange={(e) => updateInventory(idx, e.target.value, "cyl")} />
                                        </td>
                                        <td>
                                            <input value={item.quantity} onChange={(e) => updateInventory(idx, e.target.value, "quantity")} />
                                        </td>
                                        <td>
                                            <button className='btn btn-danger' onClick={() => removeFromInventoery(idx)}><Trash2 size={20} /> </button>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td>
                                        <input value={newItem.sph} onChange={(e) => setNewItem({ ...newItem, 'sph': e.target.value })} placeholder='Enter new sph' />
                                    </td>
                                    <td>
                                        <input value={newItem.cyl} onChange={(e) => setNewItem({ ...newItem, 'cyl': e.target.value })} placeholder='Enter new cyl' />
                                    </td>
                                    <td>
                                        <input value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, 'quantity': e.target.value })} placeholder='Enter new amount' />
                                    </td>
                                    <td>
                                        <button className='btn btn-success' onClick={addToInventory}> <PlusCircle size={20} /> </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </>
            }
        </div>
    )
}