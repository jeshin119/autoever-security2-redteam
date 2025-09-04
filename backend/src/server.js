const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
const PortManager = require('./utils/portManager');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const chatRoutes = require('./routes/chat');
const transactionRoutes = require('./routes/transactions');
const notificationRoutes = require('./routes/notifications');

const communityRoutes = require('./routes/community');

// Import middleware
const authenticateToken = require('./middleware/authenticateToken');
const errorHandler = require('./middleware/errorHandler');
const { connectDB, sequelize } = require('./config/database');

// Import models for health check
const User = require('./models/User');
const Product = require('./models/Product');
const CommunityPost = require('./models/CommunityPost');

// Model associations are handled in individual model files

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
});

// Connect to database
connectDB();

// Intentionally vulnerable: Weak security headers
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for XSS vulnerabilities
  frameguard: false, // Disabled for clickjacking
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS configuration (intentionally permissive)
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Logging
app.use(morgan('dev'));

// Body parsing
app.use(express.json({ limit: '50mb' })); // Intentionally high limit
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Session configuration (intentionally weak)
app.use(session({
  secret: 'weak-secret-123', // Intentionally weak secret
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Not using HTTPS
    httpOnly: false, // Vulnerable to XSS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Static files (intentionally expose uploads directory)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/notifications', notificationRoutes);

app.use('/api/community', authenticateToken, communityRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // 데이터베이스 연결 테스트
    await sequelize.authenticate();
    const userCount = await User.count();
    const productCount = await Product.count();
    const communityPostCount = await CommunityPost.count();
    
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        users: userCount,
        products: productCount,
        communityPosts: communityPostCount
      },
      // Intentionally expose system information
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version,
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      platform: process.platform,
      nodeVersion: process.version
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: error.message
      },
      environment: process.env.NODE_ENV
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Vintage Market API - Educational Security Testing Platform',
    warning: '⚠️ This API contains intentional security vulnerabilities for educational purposes only!',
    status: 'Server is running successfully',
    timestamp: new Date().toISOString(),
    endpoints: {
      api: '/api',
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      chat: '/api/chat',
      transactions: '/api/transactions',
      notifications: '/api/notifications',
      community: '/api/community',
      health: '/api/health'
    }
  });
});

// API root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Vintage Market API - Educational Security Testing Platform',
    warning: '⚠️ This API contains intentional security vulnerabilities for educational purposes only!',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      chat: '/api/chat',
      transactions: '/api/transactions',
      notifications: '/api/notifications',
      community: '/api/community'
    }
  });
});
io.on('connection', (socket) => {
  console.log('New WebSocket connection:', socket.id);
  
  // Intentionally vulnerable: No authentication for socket connections
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });
  
  socket.on('send-message', (data) => {
    // Intentionally vulnerable: No message validation or sanitization
    io.to(data.roomId).emit('receive-message', data);
  });
  
  socket.on('typing', (data) => {
    socket.to(data.roomId).emit('user-typing', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    // Intentionally vulnerable: Stack trace exposure
    stack: new Error().stack
  });
});

// Enhanced server startup with port management
async function startServer() {
  const portManager = new PortManager();
  const preferredPort = parseInt(process.env.PORT) || 3000;
  const autoResolve = process.env.AUTO_RESOLVE_PORT === 'true' || process.argv.includes('--auto-resolve');
  
  try {
    console.log('🚀 Starting Vintage Market Backend Server...\n');
    
    let finalPort;
    
    if (autoResolve) {
      // Automatic port resolution mode
      console.log('🔧 Auto-resolve mode enabled');
      finalPort = await portManager.resolvePort(preferredPort, true);
    } else {
      // Manual port check mode
      const isAvailable = await portManager.isPortAvailable(preferredPort);
      
      if (isAvailable) {
        finalPort = preferredPort;
        console.log(`✅ Port ${preferredPort} is available`);
      } else {
        console.error(`❌ Port ${preferredPort} is already in use!`);
        
        // Generate resolution guide
        const guide = await portManager.generateResolutionGuide(preferredPort);
        console.log('\n📋 Port Conflict Resolution Options:');
        console.log('═'.repeat(50));
        
        guide.resolutionOptions.forEach((option, index) => {
          console.log(`\n${index + 1}. ${option.description}`);
          option.commands.forEach(cmd => {
            console.log(`   ${cmd}`);
          });
        });
        
        console.log('\n💡 Quick Solutions:');
        console.log(`   • Use alternative port: PORT=${guide.alternativePort} npm start`);
        console.log(`   • Auto-resolve conflicts: npm run start:auto`);
        console.log(`   • Kill conflicting process (${guide.platform}):`, 
          guide.platform === 'win32' 
            ? 'netstat -ano | findstr :3000, then taskkill /PID [PID] /F'
            : 'lsof -ti:3000 | xargs kill -9'
        );
        
        process.exit(1);
      }
    }
    
    // Start the server on the resolved port
    httpServer.listen(finalPort, () => {
      console.log(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║   🛒 Vintage Market Backend Server                ║
║                                                    ║
║   Server running on port ${finalPort}${finalPort !== preferredPort ? ' (auto-resolved)' : ''}                ${finalPort !== preferredPort ? ' ' : ''}║
║   Environment: ${process.env.NODE_ENV || 'development'}                        ║
║   Platform: ${process.platform}                           ║
║                                                    ║
║   🌐 Access URLs:                                 ║
║   • Local: http://localhost:${finalPort}                  ║
║   • Network: http://0.0.0.0:${finalPort}                 ║
║                                                    ║
║   📍 API Endpoints:                               ║
║   • Health: /api/health                           ║
║   • Users: /api/users                             ║
║   • Products: /api/products                       ║
║                                                    ║
║   ⚠️  WARNING: This server contains intentional   ║
║      security vulnerabilities for educational     ║
║      purposes only!                               ║
║                                                    ║
╚════════════════════════════════════════════════════╝
      `);
      
      if (finalPort !== preferredPort) {
        console.log(`ℹ️  Note: Server started on port ${finalPort} instead of ${preferredPort} due to port conflict`);
        console.log(`💡 To use the original port, run: npm run clean:ports && npm start`);
      }
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Check if another service is using the port');
    console.log('2. Try running with auto-resolve: npm run start:auto');
    console.log('3. Use a different port: PORT=3001 npm start');
    console.log('4. Clean up processes: npm run clean:ports');
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  httpServer.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  httpServer.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

// Start the server
if (require.main === module) {
  startServer();
}

module.exports = { app, io };