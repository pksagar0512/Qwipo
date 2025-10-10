import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  text: String,
  timestamp: { type: Date, default: Date.now },
  meta: mongoose.Schema.Types.Mixed,
});

const chatSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  sessionId: { type: String, required: true, unique: true },
  messages: [chatMessageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

chatSessionSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model("ChatSession", chatSessionSchema);
