import mongoose from 'mongoose';

const purchaseSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  },
  { timestamps: true }
);

const Purchase = mongoose.model('Purchase', purchaseSchema);
export default Purchase;
