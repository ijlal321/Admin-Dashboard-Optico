import { Schema, model, models } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';


const PrescriptionLensSchema = new Schema({

    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    products: [
        {
            id: {
                type: String,
                default: uuidv4
            },
            name: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                default: "No description available"
            },
            images: {
                type: [String],
                required: true
            },
            batches: [
                {
                    batchId: {
                        type: String,
                        required: true
                    },
                    id: {
                        type: String,
                        default: uuidv4
                    },
                    expiryDate: {
                        type: String,
                        required: false,
                    },
                    inventory: [
                        {
                            sph: {
                                type: String,
                                required: true
                            },
                            cyl: {
                                type: String,
                                required: true
                            },
                            quantity: {
                                type: String,
                                required: true
                            }
                        }
                    ]
                }
            ]
        }
    ]
},
    { timestamps: true }
);

const PrescriptionLens = models.PrescriptionLens || model('PrescriptionLens', PrescriptionLensSchema);

export default PrescriptionLens;