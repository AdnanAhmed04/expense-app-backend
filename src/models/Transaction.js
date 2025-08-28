import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true, index: true },
  amount: { type: Number, min: 0, required: true },
  category: { type: String, trim: true, required: true, index: true },
  date: { type: Date, required: true, index: true },
  note: { type: String, trim: true, maxlength: 280 },
}, { timestamps: true });

transactionSchema.index({ user: 1, date: -1 });

export default mongoose.model('Transaction', transactionSchema);
