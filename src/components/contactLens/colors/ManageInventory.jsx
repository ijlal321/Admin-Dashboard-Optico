"use client";
import React, { useEffect, useState } from 'react'
import { CodeSlash } from 'react-bootstrap-icons';
import { Trash2, PlusCircle, Save, XCircle, MinusCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { validateInvntory } from '@/utlis/validator/contactLensValidator';
import { updateBrand } from '@/utlis/contactLensHelper';



function ManageInventory({ brand, color, setColor, allBatches, setStatus }) {

    const handleUpdateBatch = async (updatedBatch) => {
        try {
   
            setStatus({ status: 'loading', description: 'Saving new Data...' });
            const updatedColor = { ...color, batches: color.batches.map(batch => batch.id == updatedBatch.id ? updatedBatch : batch) };

            const updatedBrand = { ...brand, colors: brand.colors.map(c => c.id == color.id ? updatedColor : c) };

            const data = await updateBrand(updatedBrand);

            if (data.success) {
                setStatus({ status: 'successful', description: 'Data updated successfully' });
                setColor(updatedColor);
            } else {
                throw new Error(data.error);
            }
        } catch (e) {
            setStatus({ status: 'error', description: e.message });
            console.error('Error updating color:', e);
            return false;
        }
        return true;
    }

    const handleDeleteBatch = async (batchId) => {
        if (!window.confirm('Are you sure you want to delete this batch?')) {
            return;
        }
        setStatus({ status: "loading", description: "Deleting Data..." })
        const updatedColor = { ...color, batches: color.batches.filter(batch => batch.id != batchId) };
        const updatedBrand = { ...brand, colors: brand.colors.map(c => c.id == color.id ? updatedColor : c) };

        const data = await updateBrand(updatedBrand);

        if (data.success) {
            setStatus({ status: 'successful', description: 'Batch deleted successfully' });
            setColor(updatedColor);
        } else {
            setStatus({ status: 'error', description: `Error Deleting: ${data.error}` });
        }
    }

    return (
        <div >
            {color.batches.map((batch, idx) => {
                const batchInfo = allBatches.find(b => b._id == batch.batchId);
                if (!batchInfo) return <p>error loading batch details for batch id {batch.id}</p>;
                return <InventoryCard batch={batch} key={idx} batchInfo={batchInfo} handleUpdateBatch={handleUpdateBatch} handleDeleteBatch={handleDeleteBatch} setStatus={setStatus} />
            })}
        </div>
    )
}

export default ManageInventory

function InventoryCard({ batch, batchInfo, handleUpdateBatch, handleDeleteBatch, setStatus }) {

    const [isEditing, setIsEditing] = useState(false);
    const [stock, setStock] = useState(batch.stock);
    const [newItem, setNewItem] = useState({ power: '', quantity: '0' });
    const [expiry, setExpiry] = useState(batch.expiryDate);

    const handleCancelUpdate = () => {
        setIsEditing(false);
        setStock(batch.inventory);
        setExpiry(batch.expiryDate);
    }

    const updateStock = (idx, newValue, field) => {
        const updatedStock = [...stock];
        updatedStock[idx][field] = newValue;
        setStock(updatedStock);
    }

    const handleClickUpdate = async () => {
        // validate prescription lens stock
        const result = validateInvntory(stock);
        if (!result.success) {
            setStatus({ status: 'error', description: result.error });
            return;
        }

        // validate expiry
        if (!expiry) return;

        // send to backend
        const newBatch = { ...batch, stock: stock, expiryDate: expiry };
        if (await handleUpdateBatch(newBatch)) {
            setIsEditing(false);
        }
    }

    const addToStock = () => {
        // check new item value is not duplicate or empty
        if (newItem.power === '' || parseInt(newItem.quantity, 10) == 0) {
            setStatus({ status: 'error', description: 'All fields are required' });
            return;
        }
        if (stock.find(item => item.power == newItem.power)) {
            setStatus({ status: 'error', description: 'Duplicate stock found' });
            return;
        }

        const newStock = [...stock, newItem];
        setStock(newStock);
        setNewItem({ power: '', quantity: '0' });
    }

    const removeFromStock = (idx) => {
        const updatedStock = stock.filter((item, index) => index != idx);
        setStock(updatedStock);
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
                                    <th>Power</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stock.map((item, stockIdx) => (
                                    <tr key={stockIdx}>
                                        <td>{item.power}</td>
                                        <td>{item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </> :
                <>
                    <div className='card-body'>
                        <p>Select Expiry Date</p>
                        <input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="border border-gray-300 p-2 rounded" />

                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Power</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stock.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <input value={item.power} onChange={(e) => updateStock(idx, e.target.value, "power")} />
                                        </td>
                                        <td>
                                            <input value={item.quantity} onChange={(e) => updateStock(idx, e.target.value, "quantity")} />
                                        </td>
                                        <td>
                                            <button className='btn btn-danger' onClick={() => removeFromStock(idx)}><Trash2 size={20} /> </button>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td>
                                        <input value={newItem.power} onChange={(e) => setNewItem({ ...newItem, 'power': e.target.value })} placeholder='Enter new Power' />
                                    </td>
                                    <td>
                                        <input value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, 'quantity': e.target.value })} placeholder='Enter new amount' />
                                    </td>
                                    <td>
                                        <button className='btn btn-success' onClick={addToStock}> <PlusCircle size={20} /> </button>
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
