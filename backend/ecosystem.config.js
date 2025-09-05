module.exports = {
  apps: [{
    name: 'vintage-market-backend',
    script: './src/server.js',
    instances: 1, // 개발환경에서는 1개 인스턴스
    exec_mode: 'fork',
    watch: true,
    watch_delay: 1000,
    ignore_watch: ['node_modules', 'logs', 'uploads'],
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      instances: 'max',
      exec_mode: 'cluster'
    },
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