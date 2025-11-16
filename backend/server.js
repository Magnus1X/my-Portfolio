const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

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
  origin: true,
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));



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

// Debug endpoint
app.get('/api/debug', async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    const skillCount = await prisma.skill.count();
    res.json({ 
      database: 'connected',
      users: userCount,
      skills: skillCount,
      env: process.env.NODE_ENV
    });
  } catch (error) {
    res.status(500).json({ 
      database: 'error',
      error: error.message,
      env: process.env.NODE_ENV
    });
  }
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

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Database connection with retry
  const connectWithRetry = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        await prisma.$connect();
        console.log('🍃 Database connected successfully');
        return;
      } catch (error) {
        console.error(`❌ Database connection attempt ${i + 1} failed:`, error.message);
        if (i === retries - 1) {
          console.error('❌ All database connection attempts failed');
          console.error('Please check your MongoDB Atlas connection string and network connectivity');
        } else {
          console.log(`⏳ Retrying in 2 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
  };
  
  connectWithRetry();
});
