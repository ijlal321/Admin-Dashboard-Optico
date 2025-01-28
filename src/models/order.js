
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import Counter from './counter.js'; // Correctly import Counter model
import Frame from './frame.js';
import Sunglass from './sunglass.js';
import ReadingGlass from './readingGlass.js';

const dummyOrders = [
    {
        id: 1,
        orderNumber: "12345", // from physical store
        customerId: "cust001",
        prescriptionId: "presc001",
        orderDate: new Date(),
        deliveryDate: new Date(),
        status: "Pending",
        items: [
            {
                id: "item001",
                itemType: "Sunglass",
                itemId: "1",
                variantId: "1",
                inventoryId: "1",
                customLens: true,
                sunglassPrice: 100,
                lensPrice: 50,
                lensType: "Polarized",
                description: "Polarized Sunglasses"
            },
            {
                id: "item002",
                itemType: "Prescription Glasses",
                itemId: "prescGlasses001",
                variantId: "var002",
                inventoryId: "1",
                lensType: "Single Vision",
                framePrice: 150,
                lensPrice: 75,
                description: "Blue light blocking glasses"
            },
            {
                id: "item003",
                itemType: "Contact Lens",
                brandId: "1",
                colorId: "1",
                batchId: "1",
                inventoryId: "1",
                kit: "Monthly",
                price: 60,
                quantity: 2,
                description: "Monthly disposable contact lenses"
            },
            {
                id: "1",
                itemType: "Reading Glasses",
                itemId: "1",
                variantId: "1",
                inventoryId: "1",
                price: 50,
                description: "Reading glasses blue"
            },
            {
                id: "item005",
                itemType: "Other",
                description: "Cleaning Kit",
                price: 20
            }
        ]
    }
]

const OrderSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    orderNumber: { type: String },
    customerId: { type: String },
    prescriptionId: { type: String },
    orderDate: { type: Date, required: true },
    deliveryDate: { type: Date },
    status: { type: String, required: true },
    items: [
        {
            id: { type: String, default: uuidv4 },
            itemType: { type: String, required: true },
            itemId: { type: String },
            variantId: { type: String },
            inventoryId: { type: String },
            customLens: { type: Boolean },
            sunglassPrice: { type: Number },
            lensPrice: { type: Number },
            lensType: { type: String },
            description: { type: String },
            framePrice: { type: Number },
            brandId: { type: String },
            colorId: { type: String },
            power: { type: String },
            kit: { type: String },
            price: { type: Number },
            quantity: { type: Number }
        }
    ]
}, { timestamps: true });

// Pre-save middleware to assign sequential `id`
OrderSchema.pre('save', async function (next) {
    if (!this.id) {
        try {
            // Find and increment the counter
            const counter = await Counter.findOneAndUpdate(
                { modelName: 'Order' }, // Use `_id` to match the Counter schema
                { $inc: { sequenceValue: 1 } }, // Increment sequenceValue
                { new: true, upsert: true } // Return the updated counter or create it if it doesn't exist
            );
            this.id = counter.sequenceValue; // Assign the new sequence value
        } catch (error) {
            return next(error);
        }
    }

    next();
});


const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export default Order;
