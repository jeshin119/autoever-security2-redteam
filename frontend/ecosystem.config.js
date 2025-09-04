module.exports = {
  apps: [{
    name: 'vintage-market-frontend',
    script: 'npm',
    args: 'run dev',
    cwd: '/home/user/webapp/frontend',
    env: {
      NODE_ENV: 'development',
      PORT: 5173,
      VITE_API_URL: 'http://localhost:3000'
    },
    watch: false,
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};