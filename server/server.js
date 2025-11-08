import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import chatRouter from './routes/chatRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './routes/authRoutes.js';
import fileRoutes from './routes/fileRoutes.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

app.use('/api/chat', chatRouter);
app.use('/api/auth', authRouter);
app.use('/api/files', fileRoutes);

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log('Connected to MongoDB')})
.catch((err)=>{
  console.log("❌ MongoDB Error: ", err.message)
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`server running on port ${PORT}`));