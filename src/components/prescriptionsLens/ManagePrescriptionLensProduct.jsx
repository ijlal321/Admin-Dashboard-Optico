"use client";
import { useEffect, useState } from 'react';
import EditProduct from './EditProduct';
import ManageBatches from './ManageBatches';
import ManageInventory from './ManageInventory';
import CurrentStatusComponent from '../helpers/CurrentStatusComponent';
import { searchBrandById } from '@/utlis/prescriptionLensHelper';
import { formatAllShipmentDates } from '@/utlis/shipmentHelper';



const ManagePrescriptionLensProduct = ({ brandId, productId }) => {
    const [status, setStatus] = useState(null);
    const [brand, setBrand] = useState(null);
    const [product, setProduct] = useState(null);
    const [allBatches, setAllBatches] = useState(null);

    // load all batches
    useEffect(() => {
        // load all batches when page loads
        const fetchShipmentData = async () => {
            try {
                // fetch all batches from server
                const response = await fetch('/api/prescription-lens-shipment');
                const data = await response.json();
                if (data.success) {
                    const dateFormattedData = formatAllShipmentDates(data.data);
                    setAllBatches(dateFormattedData);
                } else {
                    throw new Error(data.error);
                }
            } catch (error) {
                setStatus({ status: 'error', description: error });
                console.error('Error fetching shipment data:', error);
            }
        }
        fetchShipmentData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (brandId && productId) {

                try {
                    setStatus({ status: 'loading', description: 'Loading data...' });

                    const data = await searchBrandById(brandId);
                    if (data.success) {
                        // first we find product inbrands, if not found we set status to error
                        const findProduct = data.data.products.find(product => product.id == productId);
                        if (!findProduct) {
                            setStatus({ status: 'error', description: 'No prodcut found with this id' });
                            return;
                        }

                        setBrand(data.data);
                        setProduct(findProduct);
                        setStatus({ status: 'successful', description: 'Data loaded successfully' });
                    }
                    else {
                        throw new Error(data.error);
                    }

                } catch (error) {
                    setStatus({ status: 'error', description: error });
                    console.error('Error fetching brand data:', error);
                }
            }
        }
        fetchData();
    }, [brandId, productId]);

    if (!brand || !product || !allBatches) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <EditProduct brand={brand} product={product} setStatus={setStatus} />
            <ManageBatches brand={brand} product={product} setProduct={setProduct} allBatches={allBatches}  setStatus={setStatus} />

            <hr className='mx-4' />

            <ManageInventory brand={brand} product={product} setProduct={setProduct} allBatches={allBatches} setStatus={setStatus} />
            <CurrentStatusComponent status={status} setStatus={setStatus} />
        </div>
    );
};

export default ManagePrescriptionLensProduct;