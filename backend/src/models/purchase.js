import mongoose from 'mongoose';

const { Schema } = mongoose;

const purchaseSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  packId: { type: String, required: true },
  stripeSessionId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  paid: { type: Boolean, default: false },
}, { timestamps: true });

const Purchase = mongoose.model('purchase', purchaseSchema);
export default Purchase;
