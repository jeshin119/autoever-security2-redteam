const { sequelize } = require('./backend/src/config/database');
const RealEstate = require('./backend/src/models/RealEstate');
const Product = require('./backend/src/models/Product');
const User = require('./backend/src/models/User');

async function checkDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    const userCount = await User.count();
    console.log(`👥 Users: ${userCount}`);
    
    const productCount = await Product.count();
    console.log(`📦 Products: ${productCount}`);
    
    const realEstateCount = await RealEstate.count();
    console.log(`🏘️ Real Estate Listings: ${realEstateCount}`);
    
    if (realEstateCount > 0) {
      const listings = await RealEstate.findAll({ limit: 2 });
      console.log('📋 Sample real estate listings:');
      listings.forEach((listing, index) => {
        console.log(`${index + 1}. ${listing.title} - ${listing.price}원`);
      });
    }
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkDatabase();