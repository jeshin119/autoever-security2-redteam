module.exports = {
  apps: [
    {
      name: 'vintage-market-backend',
      script: './backend/src/server.js',
      cwd: '/home/user/webapp',
      instances: 1,
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
        AUTO_RESOLVE_PORT: 'false'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      watch: ['./backend/src'],
      ignore_watch: ['node_modules', 'logs', 'uploads'],
      log_file: './logs/backend.log',
      out_file: './logs/backend-out.log',
      error_file: './logs/backend-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      restart_delay: 1000
    },
    {
      name: 'vintage-market-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: '/home/user/webapp/frontend',
      instances: 1,
      env: {
        NODE_ENV: 'development',
        VITE_API_URL: 'https://5000-igz0zxasfo94drs3x9mwk-6532622b.e2b.dev/api'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      watch: false, // Vite handles its own file watching
      log_file: './logs/frontend.log',
      out_file: './logs/frontend-out.log',
      error_file: './logs/frontend-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      restart_delay: 1000
    }
  ]
};