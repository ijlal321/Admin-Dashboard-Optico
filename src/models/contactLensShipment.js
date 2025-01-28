import mongoose from 'mongoose';
import Counter from './counter.js'; // Correctly import Counter model

const dummyContactLensShipments = [
    { id: '1', orderDate: '2023-05-15', receivedDate: '2023-05-20', location: 'New York', supplier: 'Supplier A', cartons: 26, description: 'First batch' },
    { id: '2', orderDate: '2023-06-01', receivedDate: '2023-06-07', location: 'Los Angeles', supplier: 'Supplier B', cartons: 35, description: 'Summer collection' },
    { id: '3', orderDate: '2023-06-15', receivedDate: '2023-06-22', location: 'Chicago', supplier: 'Supplier C', cartons: 26, description: 'Fall preview' },
    { id: '4', orderDate: '2023-07-01', receivedDate: '2023-07-08', location: 'Miami', supplier: 'Supplier E', cartons: 40, description: 'Beach essentials' },
    { id: '5', orderDate: '2023-07-15', receivedDate: '2023-07-22', location: 'Seattle', supplier: 'Supplier D', cartons: 30, description: 'Tech gadgets' },
]

const ContactLensShipmentSchema = new mongoose.Schema({
    orderDate: { type: Date, required: true },
    receivedDate: { type: Date, required: true },
    location: { type: String, required: true },
    supplier: { type: String, required: true },
    cartons: { type: Number, required: true },
    description: { type: String, required: true },
}, { timestamps: true });



const ContactLensShipment = mongoose.models.ContactLensShipment || mongoose.model('ContactLensShipment', ContactLensShipmentSchema);

export default ContactLensShipment;
