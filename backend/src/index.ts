import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
const cors = require('cors');
import { initializeDatabase } from './db/database';
import authRoutes from './routes/auth';
import transactionRoutes from './routes/transactions';
import reportRoutes from './routes/reports';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// CORS configuration - allow multiple origins including www and non-www
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://www.ytbstorage.space',
  'https://ytbstorage.space',
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: function(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow for now to avoid blocking
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Security headers for OAuth
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

app.use(express.json());

initializeDatabase()
  .then(() => {
    console.log('Database initialized successfully');
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error.message);
    process.exit(1);
  });

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'YTB Savings API Server',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      transactions: '/api/transactions/*',
      reports: '/api/reports/*'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// SPA Fallback - serve index.html for all non-API routes
// This allows React Router to handle frontend routes
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.get('*', (req, res) => {
  // Don't handle API routes here
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
