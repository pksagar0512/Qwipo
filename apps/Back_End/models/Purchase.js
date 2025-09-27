import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  retailerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  brandName: String,
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
  paymentMode: String,
  status: { type: String, default: "pending" },
});

export default mongoose.model("Purchase", purchaseSchema);