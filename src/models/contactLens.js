import { Schema, model, models } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import lifeTimes from '@/data/contactLens/lifeTimes.json';


const ContactLensSchema = new Schema({

    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    name: {
        type: String,
    },
    colors: [
        {
            id: {
                type: String,
                default: uuidv4
            },
            name: {
                type: String,
                required: true,
            },
            colorTags: [{
                type: String,
            }],
            description: {
                type: String,
                default: "No description available"
            },
            lifeTime: {
                type: String,
                enum: lifeTimes,
                required: true
            },
            planoPrice: {
                type: Number,
                required: true
            },
            powerPrice: {
                type: Number,
                required: true
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
                        required: true,
                    },
                    stock: [
                        {
                            id: {
                                type: String,
                                default: uuidv4
                            },
                            power: {
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

const ContactLens = models.ContactLens || model('ContactLens', ContactLensSchema);

export default ContactLens;