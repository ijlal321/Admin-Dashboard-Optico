"use client";
import { useEffect, useState } from 'react';
import EditColor from './EditColor';
import ManageBatches from './ManageBatches';
import ManageInventory from './ManageInventory';
import CurrentStatusComponent from '../../helpers/CurrentStatusComponent';
import { searchBrandById } from '@/utlis/contactLensHelper';
import { formatAllShipmentDates } from '@/utlis/shipmentHelper';


const ManageColors = ({ brandId, colorId }) => {
    const [status, setStatus] = useState(null);
    const [brand, setBrand] = useState(null);
    const [color, setColor] = useState(null);
    const [allBatches, setAllBatches] = useState(null);

    // load all batches
    useEffect(() => {
        // load all batches when page loads
        const fetchShipmentData = async () => {
            try {
                // fetch all batches from server
                const response = await fetch('/api/contact-lens-shipment');
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
            if (brandId && colorId) {

                try {
                    setStatus({ status: 'loading', description: 'Loading data...' });

                    const data = await searchBrandById(brandId);
                    if (data.success) {
                        // first we find color in brands, if not found we set status to error
                        const findColor = data.data.colors.find(color => color.id == colorId);
                        if (!findColor) {
                            setStatus({ status: 'error', description: 'No color found with this id' });
                            return;
                        }

                        setBrand(data.data);
                        setColor(findColor);
                        setStatus({ status: 'successful', description: 'Data loaded successfully' });
                    }
                    else {
                        throw new Error(data.error);
                    }

                } catch (error) {
                    setStatus({ status: 'error', description: error.message });
                    console.error('Error fetching brand data:', error);
                }
            }
        }
        fetchData();
    }, [brandId, colorId]);


    if (!brand || !color || !allBatches) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <EditColor brand={brand} color={color} setStatus={setStatus} />
            <ManageBatches brand={brand} color={color} setColor={setColor} allBatches={allBatches} setStatus={setStatus} />

            <hr className='mx-4' />

            <ManageInventory brand={brand} color={color} setColor={setColor} allBatches={allBatches} setStatus={setStatus} />
            <CurrentStatusComponent status={status} setStatus={setStatus} />
        </div>
    );
};

export default ManageColors;