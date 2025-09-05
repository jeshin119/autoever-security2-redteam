const { sequelize } = require('../config/database');

/**
 * 데이터베이스 안전 초기화 헬퍼 함수
 * 기존 데이터를 보호하면서 스키마를 업데이트합니다.
 */
class DBMigrationHelper {
  
  /**
   * 모든 테이블의 NULL 타임스탬프를 안전하게 업데이트
   */
  static async updateNullTimestamps() {
    const tables = [
      'users', 'products', 'transactions', 'coupons', 'user_coupons',
      'community_posts', 'community_comments', 'community_post_likes', 'user_likes'
    ];

    console.log('🔄 Starting safe timestamp migration...');

    for (const table of tables) {
      try {
        const [results] = await sequelize.query(`
          UPDATE ${table} 
          SET 
            created_at = COALESCE(created_at, NOW()),
            updated_at = COALESCE(updated_at, NOW())
          WHERE created_at IS NULL OR updated_at IS NULL
        `);

        if (results.affectedRows > 0) {
          console.log(`✅ Updated ${results.affectedRows} rows in ${table} table`);
        }
      } catch (error) {
        // 테이블이 존재하지 않거나 다른 문제가 있어도 계속 진행
        console.warn(`⚠️  Warning: Could not update ${table} table:`, error.message);
      }
    }

    console.log('✅ Safe timestamp migration completed');
  }

  /**
   * 데이터베이스 연결 상태 확인
   */
  static async checkConnection() {
    try {
      await sequelize.authenticate();
      console.log('✅ Database connection established successfully');
      return true;
    } catch (error) {
      console.error('❌ Unable to connect to the database:', error.message);
      return false;
    }
  }

  /**
   * 안전한 데이터베이스 동기화
   * force: false로 고정하여 기존 데이터 보호
   */
  static async safeSync(options = {}) {
    const defaultOptions = {
      force: false,  // 절대로 테이블을 삭제하지 않음
      alter: true,   // 스키마 변경사항만 적용
      logging: console.log
    };

    const syncOptions = { ...defaultOptions, ...options, force: false }; // force는 항상 false

    try {
      console.log('🔄 Starting safe database synchronization...');
      
      // 1. 연결 확인
      const isConnected = await this.checkConnection();
      if (!isConnected) {
        throw new Error('Database connection failed');
      }

      // 2. NULL 타임스탬프 먼저 업데이트
      await this.updateNullTimestamps();

      // 3. 스키마 동기화
      await sequelize.sync(syncOptions);
      
      console.log('✅ Database synchronized successfully');
      return true;
    } catch (error) {
      console.error('❌ Database synchronization failed:', error.message);
      throw error;
    }
  }

  /**
   * 개발 환경에서만 사용할 수 있는 전체 재구성
   * 프로덕션에서는 절대 사용하지 말 것!
   */
  static async dangerousReset() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('❌ DANGEROUS: Cannot reset database in production environment!');
    }

    console.warn('⚠️  WARNING: This will delete ALL data!');
    console.log('🔄 Resetting database (development only)...');
    
    await sequelize.sync({ force: true, logging: console.log });
    console.log('✅ Database reset completed');
  }
}

module.exports = DBMigrationHelper;