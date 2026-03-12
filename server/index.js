import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './auth.js';
import apiRoutes from './routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../uploads')));

// Production: Serve frontend
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, '../dist')));

// Routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Wildcard for React SPA
app.get('*all', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
