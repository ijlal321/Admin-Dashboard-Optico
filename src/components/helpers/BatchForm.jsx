'use client'

import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import SmallTitle from '../SmallTitle'

// Dummy data
const dummyBatches = [
    { id: '1', orderDate: '2023-05-15', receivedDate: '2023-05-20', location: 'New York', supplier: 'Supplier A', cartons: 26, description: 'First batch' },
    { id: '2', orderDate: '2023-06-01', receivedDate: '2023-06-07', location: 'Los Angeles', supplier: 'Supplier B', cartons: 35, description: 'Summer collection' },
    { id: '3', orderDate: '2023-06-15', receivedDate: '2023-06-22', location: 'Chicago', supplier: 'Supplier C', cartons: 26, description: 'Fall preview' },
    { id: '4', orderDate: '2023-07-01', receivedDate: '2023-07-08', location: 'Miami', supplier: 'Supplier A', cartons: 40, description: 'Beach essentials' },
    { id: '5', orderDate: '2023-07-15', receivedDate: '2023-07-22', location: 'Seattle', supplier: 'Supplier D', cartons: 30, description: 'Tech gadgets' },
]

export default function BatchForm({ batchInfo: finalBatchData, setBatchInfo: setFinalBatchData }) {
    const [batches, setBatches] = useState(dummyBatches)
    const [selectedBatch, setSelectedBatch] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [newBatch, setNewBatch] = useState({
        orderDate: '',
        receivedDate: '',
        location: '',
        supplier: '',
        cartons: '',
        description: ''
    })

    useEffect(() => {
        // In a real application, you would fetch batches from an API here
        // For now, we're using the dummy data
        setBatches(dummyBatches)
    }, [])

    const handleSelectChange = (e) => {
        setSelectedBatch(e.target.value)
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setNewBatch(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        // In a real application, you would send a POST request to create a new batch
        const newBatchWithId = { ...newBatch, id: Date.now().toString() }
        setBatches(prev => [...prev, newBatchWithId])
        setFinalBatchData(newBatchWithId);

        // setNewBatch({
        //     orderDate: '',
        //     receivedDate: '',
        //     location: '',
        //     supplier: '',
        //     cartons: '',
        //     description: ''
        // })
    }

    const handleSelectOldBatchSelect = () =>{
        const selected = batches.find(batch => batch.id === selectedBatch);
        if (selected) {
            setFinalBatchData(selected);
        }
    }

    const filteredBatches = batches.filter(batch => {
        const searchTermLower = searchTerm.toLowerCase()
        return (
            batch.cartons.toString().includes(searchTermLower) ||
            batch.orderDate.includes(searchTermLower) ||
            batch.receivedDate.includes(searchTermLower) ||
            batch.supplier.includes(searchTerm)
        )
    })


    return (
        <div className="container mt-4">
            
            <div className="mb-4">
            <SmallTitle title="Select Previous Batch" />
            <input
                    type="text"
                    placeholder="Search by date, carton number or Supplier"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="form-control mb-3"
                />
                <select 
                    value={selectedBatch} 
                    onChange={handleSelectChange}
                    className="form-select mb-3"
                >
                    <option value="">Select a batch</option>
                    {filteredBatches.map(batch => (
                        <option key={batch.id} value={batch.id}>
                            {`Order Date: ${batch.orderDate} - Cartons: ${batch.cartons} - Supplier: ${batch.supplier}`}
                        </option>
                    ))}
                </select>

                <button className='btn btn-primary' onClick={handleSelectOldBatchSelect}>Select</button>
            </div>

            <hr className="my-4" />

            <div>
            <SmallTitle title="Create New Batch" />
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Order Date:</label>
                        <input
                            type="date"
                            name="orderDate"
                            value={newBatch.orderDate}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Received Date:</label>
                        <input
                            type="date"
                            name="receivedDate"
                            value={newBatch.receivedDate}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Location:</label>
                        <input
                            type="text"
                            name="location"
                            value={newBatch.location}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Supplier:</label>
                        <input
                            type="text"
                            name="supplier"
                            value={newBatch.supplier}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Number of Cartons:</label>
                        <input
                            type="number"
                            name="cartons"
                            value={newBatch.cartons}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Description (Optional):</label>
                        <textarea
                            name="description"
                            value={newBatch.description}
                            onChange={handleInputChange}
                            className="form-control"
                            rows="3"
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Create Batch
                    </button>
                </form>
            </div>
        </div>
    )
}
