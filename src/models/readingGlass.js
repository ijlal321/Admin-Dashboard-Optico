import mongoose from 'mongoose';
import Counter from './counter';
import { v4 as uuidv4 } from 'uuid';


const readingGlassSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    brand: { type: String, required: true },
    shape: [{ type: String, required: true }],
    material: [{ type: String, required: true }],
    sex: [{ type: String, enum: ['Kids', 'Male', 'Female', 'Unisex'], required: true }],
    tags: [{ type: String, default: [] }],
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    sold: { type: Boolean, default: false }, // Add a field to mark the frame as sold
    variants: [
      {
        variantId: { type: String, default: uuidv4 },
        color: [{ type: String, required: true }],
        images: [{ type: String, required: true }],
        inventory: [
          {
            inventoryId: { type: String, default: uuidv4 },
            location: { type: String, required: true },
            stock: { type: Number, required: true },
            power: { type: String, required: true },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

readingGlassSchema.pre('save', async function (next) {
  if (!this.id) {
    try {
      // Find and increment the counter
      const counter = await Counter.findOneAndUpdate(
        { modelName: 'readingGlass' }, // Use `_id` to match the Counter schema
        { $inc: { sequenceValue: 1 } }, // Increment sequenceValue
        { new: true, upsert: true } // Return the updated counter or create it if it doesn't exist
      );
      this.id = counter.sequenceValue; // Assign the new sequence value
    } catch (error) {
      return next(error);
    }
  }

    // Check if all stock in variants is 0
    const totalStock = this.variants.reduce((total, variant) => {
      return total + variant.inventory.reduce((variantTotal, item) => {
        return variantTotal + item.stock;
      }, 0);
    }, 0);
  
    // Mark frame as sold if total stock is 0
    this.sold = totalStock === 0;
    
  next();
});
// Post-update middleware to check stock
readingGlassSchema.post('findOneAndUpdate', async function (doc, next) {
  if (doc) {
    const totalStock = doc.variants.reduce((total, variant) => {
      return total + variant.inventory.reduce((variantTotal, item) => {
        return variantTotal + item.stock;
      }, 0);
    }, 0);

    // Mark frame as sold if total stock is 0
    doc.sold = totalStock === 0;
    await doc.save();
  }
  next();
});


const ReadingGlass = mongoose.models.ReadingGlass || mongoose.model('ReadingGlass', readingGlassSchema);

export default ReadingGlass;
