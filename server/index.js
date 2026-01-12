import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/auth.js';
import clanRoutes from './routes/clans.js';
import localClanRoutes from './routes/localClans.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Loaded' : 'NOT FOUND');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/clans', clanRoutes);
app.use('/api/local/clans', localClanRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bf6-clans';
console.log('Starting server...');

mongoose.connect(mongoURI)
.then(() => {
  console.log('Connected to MongoDB');
  startServer();
})
.catch((error) => {
  console.log('MongoDB not available, using local JSON storage only');
  startServer();
});

function startServer() {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Local clans API available at http://localhost:${PORT}/api/local/clans`);
  });
}

export default app;

