import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ScanHistory from './models/ScanHistory.js';

// Load environment variables
dotenv.config();

const testDatabaseConnection = async () => {
  console.log('\n========================================');
  console.log('🔍 SATYASCAN DATABASE CONNECTION TEST');
  console.log('========================================\n');

  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB Atlas...');
    console.log(`📍 URI: ${process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//****:****@')}\n`);
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🖥️  Host: ${mongoose.connection.host}`);
    console.log(`🔌 Port: ${mongoose.connection.port || 'N/A (Atlas)'}`);
    console.log(`📈 Ready State: ${mongoose.connection.readyState} (1 = connected)\n`);

    // Test the ScanHistory collection
    console.log('🔍 Testing ScanHistory Collection...');
    const scanCount = await ScanHistory.countDocuments();
    console.log(`📦 Total scans in database: ${scanCount}\n`);

    if (scanCount > 0) {
      console.log('📋 Fetching latest 3 scans...');
      const latestScans = await ScanHistory.find()
        .sort({ date: -1 })
        .limit(3)
        .select('scanId date result.productName result.brand result.status');
      
      latestScans.forEach((scan, index) => {
        console.log(`\n   ${index + 1}. ${scan.result.brand} - ${scan.result.productName}`);
        console.log(`      Status: ${scan.result.status}`);
        console.log(`      Date: ${new Date(scan.date).toLocaleString()}`);
        console.log(`      ID: ${scan.scanId}`);
      });
    } else {
      console.log('   ℹ️  No scans found in database yet.');
      console.log('   💡 Scans will appear here after you perform a scan in the app.\n');
    }

    // Test creating a sample scan
    console.log('\n🧪 Testing Scan Save Operation...');
    const testScan = new ScanHistory({
      scanId: `test-${Date.now()}`,
      date: new Date(),
      thumbnail: 'data:image/png;base64,test',
      result: {
        productName: 'Database Test Product',
        brand: 'Test Brand',
        status: 'AUTHENTIC',
        confidenceScore: 100,
        reasoning: ['Database connection test'],
        extractedText: ['TEST']
      }
    });

    const savedScan = await testScan.save();
    console.log('✅ Test scan saved successfully!');
    console.log(`   ID: ${savedScan.scanId}\n`);

    // Delete the test scan
    await ScanHistory.deleteOne({ scanId: savedScan.scanId });
    console.log('🗑️  Test scan deleted (cleanup)');

    console.log('\n========================================');
    console.log('✅ DATABASE TEST COMPLETED SUCCESSFULLY');
    console.log('========================================\n');
    console.log('📝 Summary:');
    console.log(`   ✅ Connection: Working`);
    console.log(`   ✅ Database: ${mongoose.connection.name}`);
    console.log(`   ✅ Collections: Accessible`);
    console.log(`   ✅ Save Operation: Working`);
    console.log(`   ✅ Delete Operation: Working`);
    console.log(`   📊 Total Scans: ${scanCount}`);
    console.log('\n🎉 Your database is properly configured!\n');

  } catch (error) {
    console.error('\n❌ DATABASE CONNECTION FAILED!\n');
    console.error('Error:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.error('\n💡 Troubleshooting:');
      console.error('   - Check your internet connection');
      console.error('   - Verify MongoDB Atlas cluster is running');
      console.error('   - Check if the URI is correct in .env file');
    } else if (error.message.includes('Authentication failed')) {
      console.error('\n💡 Troubleshooting:');
      console.error('   - Check username and password in MongoDB URI');
      console.error('   - Verify user has proper permissions');
    } else if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.error('\n💡 Troubleshooting:');
      console.error('   - Whitelist your IP address in MongoDB Atlas');
      console.error('   - See: backend/IP-WHITELIST-GUIDE.md');
    }
    
    console.error('\n📖 For detailed help, see: backend/FIX_DATABASE_CONNECTION.md\n');
  } finally {
    // Close connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('🔌 Connection closed.\n');
    }
    process.exit(0);
  }
};

// Run the test
testDatabaseConnection();
