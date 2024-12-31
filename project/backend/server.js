import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import moodRoutes from './routes/moodRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT' , 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials : true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use('/api/users', userRoutes);
app.use('/api/moods', moodRoutes);

export default app;

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});