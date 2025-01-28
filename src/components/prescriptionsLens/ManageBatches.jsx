import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Save, XCircle } from 'lucide-react';
import { updateBrand } from '@/utlis/prescriptionLensHelper';

function ManageBatches({ brand, setProduct, allBatches, product, setStatus }) {
    const [selectedBatchId, setSelectedBatchId] = useState('');
    const [unUsedBatches, setUnUsedBatches] = useState([]); // these are batches that doesnot have any stock inventory in selectedd product
    const [expiry, setExpiry] = useState(''); // expiry date of selected batch    


    useEffect(() => {
        // find useued batches for selected product
        const unusedBatches = allBatches.filter(batch => !product.batches.find(pb => pb.batchId == batch._id));

        setUnUsedBatches(unusedBatches);
    }, [allBatches, product]);

    const handleCancelEdit = () => {
        setExpiry(null);
        setSelectedBatchId('');
    }

    const handleSaveBatch = async() => {
        if (!selectedBatchId || !expiry) {
            setStatus({ status: 'error', description: 'Please select a valid batch and enter expiry date' });
            return;
        }
        // add new shipment to selected product in batch
        const newBrand = { ...brand, products: brand.products.map(p => p.id == product.id ? { ...p, batches: [...p.batches, { batchId: selectedBatchId, expiryDate:expiry }] } : p) };
        const data = await updateBrand(newBrand);
        if (data.success) {
            setStatus({ status: 'success', description: 'Batch added successfully' });
            setProduct(data.data.products.find(p => p.id == product.id));
            handleCancelEdit();
        } else {
            setStatus({ status: 'error', description: data.error });
        }
    }

    return (
        <div className='card m-7 p-4'>
            {!expiry ?
                <button className="btn btn-primary d-flex justify-content-around items-center w-[250px]" onClick={() => setExpiry(new Date().toISOString().split('T')[0])}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Enter Data for a new Batch
                </button>
                :
                <>
                    <p>Select Import Batch</p>
                    {/* batch selection section */}
                    <div className="flex gap-5 mb-4">
                        <Select onValueChange={(value) => setSelectedBatchId(value)} value={selectedBatchId}>
                            <SelectTrigger className="w-[300px]">
                                <SelectValue placeholder="Select a batch" />
                            </SelectTrigger>
                            <SelectContent>
                                {unUsedBatches.map(batch => (
                                    <SelectItem key={batch._id} value={batch._id}>
                                        {batch.cartons} Catrons / {batch.supplier} - ({batch.orderDate})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* input for expiry  */}
                    <p>Select Expiry Date</p>
                    <div className="flex gap-5 m-2">
                        <input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="border border-gray-300 p-2 rounded" />
                    </div>
                    <div className='d-flex gap-5 m-4 mb-0 justify-space-between'>
                        <button className='btn btn-primary d-flex align-items-center gap-2' onClick={handleSaveBatch}>
                            <Save size={16} /> Save
                        </button>
                        <button className='btn btn-secondary d-flex align-items-center gap-2' onClick={handleCancelEdit}>
                            <XCircle size={16} /> Cancel
                        </button>
                    </div>
                </>
            }

        </div>
    )
}

export default ManageBatches
