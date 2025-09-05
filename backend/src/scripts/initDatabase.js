#!/usr/bin/env node

/**
 * 데이터베이스 초기화 스크립트
 * 안전한 마이그레이션을 수행합니다.
 * 
 * 사용법:
 * npm run db:init     - 안전한 동기화 (기본)
 * npm run db:reset    - 개발 환경에서만 전체 재구성
 */

const DBMigrationHelper = require('../utils/dbMigrationHelper');

async function main() {
  const command = process.argv[2] || 'sync';

  try {
    switch (command) {
      case 'sync':
        await DBMigrationHelper.safeSync();
        break;
        
      case 'reset':
        if (process.env.NODE_ENV === 'production') {
          console.error('❌ Cannot reset database in production!');
          process.exit(1);
        }
        await DBMigrationHelper.dangerousReset();
        break;
        
      case 'check':
        await DBMigrationHelper.checkConnection();
        break;
        
      case 'fix-timestamps':
        await DBMigrationHelper.updateNullTimestamps();
        break;
        
      default:
        console.log(`
사용 가능한 명령어:
  sync           - 안전한 데이터베이스 동기화 (기본값)
  reset          - 데이터베이스 전체 재구성 (개발 환경만)
  check          - 데이터베이스 연결 확인
  fix-timestamps - NULL 타임스탬프 값들 수정

예시:
  node src/scripts/initDatabase.js sync
  node src/scripts/initDatabase.js check
        `);
    }
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };