import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';


const customerSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        default: ''
    },
    prescriptions: [
        {
            id: {
                type: String,
                default: uuidv4
            },
            date: {
                type: Date,
                default: Date.now
            },
            doctor: {
                type: String,
                default: ''
            },
            left_sph: {
                type: String,
                default: ''
            },
            left_cyl: {
                type: String,
                default: ''
            },
            left_axis: {
                type: String,
                default: ''
            },
            left_vision: {
                type: String,
                default: ''
            },
            right_sph: {
                type: String,
                default: ''
            },
            right_cyl: {
                type: String,
                default: ''
            },
            right_axis: {
                type: String,
                default: ''
            },
            right_vision: {
                type: String,
                default: ''
            },
            addition: {
                type: String,
                default: ''
            },
            ipd: {
                type: String,
                default: ''
            }
        }
    ]
}, {
    timestamps: true
});

customerSchema.pre('save', function(next) {
    this.prescriptions = this.prescriptions.map(prescription => {
        if (!prescription.id) {
            prescription.id = uuidv4();
        }
        return prescription;
    });
    next();
});

customerSchema.pre('findOneAndUpdate', function(next) {
    if (this._update.prescriptions) {
        this._update.prescriptions = this._update.prescriptions.map(prescription => {
            if (!prescription.id) {
                prescription.id = uuidv4();
            }
            return prescription;
        });
    }
    next();
});

customerSchema.index({ name: 1, phone: 1 }, { unique: true });

const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
export default Customer;