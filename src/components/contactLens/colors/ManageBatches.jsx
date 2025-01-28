import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Save, XCircle } from 'lucide-react';
import { updateBrand } from '@/utlis/contactLensHelper';


function ManageBatches({ brand, color, setColor, allBatches, setStatus }) {
    const [selectedBatchId, setSelectedBatchId] = useState('');
    const [unUsedBatches, setUnUsedBatches] = useState([]); // these are batches that doesnot have any stock inventory in selectedd color
    const [expiry, setExpiry] = useState(''); // expiry date of selected batch    

    useEffect(() => {
        // find useued batches for selected color
        const unusedBatches = allBatches.filter(batch => !color.batches.find(pb => pb.batchId == batch._id));
        setUnUsedBatches(unusedBatches);
    }, [allBatches, color]);

    const handleCancelEdit = () =>{
        setExpiry(null);
        setSelectedBatchId('');
    }
    
    const handleSaveBatch = async() => {
        if (!selectedBatchId || !expiry) {
            setStatus({ status: 'error', description: 'Please select a valid batch and enter expiry date' });
            return;
        }
        // add new shipment to selected color in batch
        const newBrand = { 
            ...brand, 
            colors: brand.colors.map(c => c.id == color.id ? { 
                ...c, 
                batches: [...c.batches, { batchId: selectedBatchId, expiryDate: expiry }] 
            } : c) 
        };
        const data = await updateBrand(newBrand);
        if (data.success) {
            setStatus({ status: 'successful', description: 'Batch added successfully' });
            setColor(data.data.colors.find(c => c.id == color.id));
            handleCancelEdit();
        } else {
            setStatus({ status: 'error', description: data.error });
        }
    }
    
    return (
        <div className='card m-7 p-4'>
            {!expiry ?
                <button className="btn btn-primary d-flex justify-content-around items-center w-[300px]" onClick={() => setExpiry(new Date().toISOString().split('T')[0])}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Enter Data for another Shipment
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
                                        {batch.cartons} - {batch.supplier} ({batch.orderDate})
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