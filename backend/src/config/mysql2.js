const mysql = require('mysql2/promise');
require('dotenv').config();

// MySQL2 직접 연결 풀 생성
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'database',
  user: process.env.DB_USER || 'vintage_user', 
  password: process.env.DB_PASSWORD || 'vintage_password',
  database: process.env.DB_NAME || 'vintagemarket',
  connectionLimit: 10,
  multipleStatements: true,  
  insecureAuth: true,
  supportBigNumbers: true,
  bigNumberStrings: false,
  // MySQL 8.0 호환성 및 다중 쿼리 강제 활성화
  flags: [
    'MULTI_STATEMENTS',
    'MULTI_RESULTS',
    'IGNORE_SPACE'
  ],
  // SQL 모드 설정
  sqlMode: 'NO_ENGINE_SUBSTITUTION'
});

module.exports = {
  pool
};
