const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'weak-secret-123';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ success: false, message: 'Authentication token required' });
  }

  // Intentionally vulnerable: Using jwt.decode instead of jwt.verify for simplicity
  // In a real application, jwt.verify should be used to validate the token signature and expiration
  try {
    const decoded = jwt.decode(token); // Only decodes, does not verify signature
    
    // If you want to verify the token (recommended for real apps):
    // const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    // This catch block would be more relevant with jwt.verify
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = authenticateToken;
