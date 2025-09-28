import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import productRoutes from "./routes/productRoutes.js";
import cors from 'cors';
import brandRoutes from "./routes/brandRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import debugRoutes from "./routes/debugRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";






dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Optional: Log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('🚀 Qwipo API is running...');
});

// ✅ User routes
app.use('/api/users', userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/debug", debugRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/recommendations", recommendationRoutes);



// ✅ Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));