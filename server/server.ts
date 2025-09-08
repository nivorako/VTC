// server/server.ts
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
// Load environment variables from the .env file in the server directory
const envPathFromCwd = path.resolve(process.cwd(), '.env');
const envPathFromDist = path.resolve(__dirname, '..', '.env');
const envPath = fs.existsSync(envPathFromCwd) ? envPathFromCwd : envPathFromDist;
dotenv.config({ path: envPath });

import express from 'express';
import cors from 'cors';

// Import configurations and initializers
import connectDB from './config/db.js';

// Import middlewares

import { errorHandler } from './middlewares/errorHandler.middleware.js';

// Import routes
import paymentRoutes from './routes/payment.routes.js';
import contactRoutes from './routes/contact.routes.js';

// Connect to the database
connectDB();

const app = express();
const port = process.env.PORT || 4000;

// --- Middlewares ---

// CORS middleware to allow cross-origin requests
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://vtc-client.onrender.com',
    /^https:\/\/.*\.vercel\.app$/,  // Allow all Vercel subdomains
    /^https:\/\/.*\.vercel\.com$/   // Allow all Vercel custom domains
  ],
  credentials: true
}));

// Middleware to parse JSON bodies. This is crucial for handling POST requests.
app.use(express.json());

// --- API Routes ---

// Mount the payment routes under the /api/payments prefix
app.use('/api/payments', paymentRoutes);

// Mount the contact routes under the /api prefix
app.use('/api', contactRoutes);

// --- Global Error Handler ---

// This must be the last middleware to be used
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Hello World!');
})

// --- Start Server ---

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
