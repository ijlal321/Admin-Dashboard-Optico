import mongoose from 'mongoose';


const PrescriptionShipmentSchema = new mongoose.Schema({
    orderDate: { type: Date, required: true },
    receivedDate: { type: Date, required: true },
    location: { type: String, required: true },
    supplier: { type: String, required: true },
    cartons: { type: Number, required: true },
    description: { type: String, required: true },
}, { timestamps: true });


const PrescriptionShipment = mongoose.models.PrescriptionShipment || mongoose.model('PrescriptionShipment', PrescriptionShipmentSchema);

export default PrescriptionShipment;