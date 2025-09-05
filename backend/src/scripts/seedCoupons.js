const Coupon = require('../models/Coupon');

const seedCoupons = async () => {
  try {
    // 기존 쿠폰들 삭제
    await Coupon.destroy({ where: {} });
    
    // 신규회원 쿠폰들 생성
    const coupons = [
      {
        code: 'WELCOME10',
        name: '신규회원 10% 할인',
        type: 'percentage',
        value: 10.00,
        minOrderAmount: 10000,
        isActive: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30일 후 만료
      },
      {
        code: 'SAVE5000',
        name: '신규회원 5000원 할인',
        type: 'fixed',
        value: 5000.00,
        minOrderAmount: 20000,
        isActive: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30일 후 만료
      },
      {
        code: 'FREE',
        name: '무료배송 쿠폰',
        type: 'delivery',
        value: 3000.00,
        minOrderAmount: 0,
        isActive: true,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90일 후 만료
      }
    ];
    
    for (const couponData of coupons) {
      await Coupon.create(couponData);
      console.log(`✅ 쿠폰 '${couponData.name}' 생성됨`);
    }
    
    console.log('🎉 쿠폰 시딩 완료!');
  } catch (error) {
    console.error('❌ 쿠폰 시딩 실패:', error);
  }
};

// 직접 실행 시
if (require.main === module) {
  seedCoupons().then(() => {
    process.exit(0);
  });
}

module.exports = seedCoupons;