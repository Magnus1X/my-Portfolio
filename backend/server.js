const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const skillRoutes = require('./routes/skills');
const projectRoutes = require('./routes/projects');
const certificateRoutes = require('./routes/certificates');
const contactRoutes = require('./routes/contact');
const uploadRoutes = require('./routes/upload');
const messageRoutes = require('./routes/messages');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
const isProd = process.env.NODE_ENV === 'production'
app.use(helmet({
  // Relax CSP in development to allow assets across localhost ports
  contentSecurityPolicy: isProd ? undefined : false,
  // Allow cross-origin resource embedding (images) in development
  crossOriginResourcePolicy: isProd ? { policy: 'same-origin' } : { policy: 'cross-origin' }
}));

// Rate limiting (disabled in development to avoid interfering with local testing)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 100000, // very high limit in dev
  standardHeaders: true,
  legacyHeaders: false
});
if (process.env.NODE_ENV === 'production') {
  app.use('/api/', limiter);
}

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://yourdomain.com']
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3001'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files (serve uploads with permissive CORP/CORS headers in dev)
const uploadsPath = path.join(__dirname, 'uploads')

// Graceful fallback for missing upload files to avoid ORB console errors
// Returns a 1x1 transparent PNG when the requested file is not found
const TRANSPARENT_PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMBCeJtK9EAAAAASUVORK5CYII='
app.get('/uploads/:fileName', (req, res, next) => {
  const filePath = path.join(uploadsPath, req.params.fileName)
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File not found: serve transparent PNG with permissive headers in dev
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
      if (process.env.NODE_ENV !== 'production') {
        res.setHeader('Access-Control-Allow-Origin', '*')
      }
      res.type('png')
      return res.status(200).send(Buffer.from(TRANSPARENT_PNG_BASE64, 'base64'))
    }
    next()
  })
})
app.use('/uploads', express.static(uploadsPath, {
  setHeaders: (res) => {
    // Allow embedding images cross-origin in development
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
    if (process.env.NODE_ENV !== 'production') {
      res.setHeader('Access-Control-Allow-Origin', '*')
    }
  }
}))

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/userinfo', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/messages', messageRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
