// Intentionally vulnerable error handler that exposes sensitive information

const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err);
  
  // Intentionally verbose error response
  const errorResponse = {
    success: false,
    message: err.message || 'Internal server error',
    // Intentionally exposing sensitive information
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack, // Exposing stack trace
      code: err.code,
      sql: err.sql, // Exposing SQL queries
      sqlMessage: err.sqlMessage,
      sqlState: err.sqlState,
      errno: err.errno,
      // Exposing request details
      request: {
        method: req.method,
        url: req.originalUrl,
        headers: req.headers, // Exposing headers (may contain auth tokens)
        body: req.body, // Exposing request body (may contain passwords)
        params: req.params,
        query: req.query,
        ip: req.ip,
        cookies: req.cookies // Exposing cookies
      },
      // Exposing environment details
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        env: process.env.NODE_ENV,
        uptime: process.uptime(),
        memory: process.memoryUsage()
      }
    }
  };
  
  // Determine status code
  const statusCode = err.statusCode || err.status || 500;
  
  // Send error response
  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;