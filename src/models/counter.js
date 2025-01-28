import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema(
  {
    modelName: { type: String, required: true, unique: true }, // Name of the model (e.g., 'Frame')
    sequenceValue: { type: Number, default: 0 }, // Maintain camelCase for consistency
  },
  { _id: false } // Disable the default _id field since we use modelName as the identifier
);

// Export the Counter model
const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);
export default Counter;
