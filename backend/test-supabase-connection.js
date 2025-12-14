// Test Supabase Connection
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Testing Supabase Connection...\n');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  console.error('   SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
  console.error('   SUPABASE_ANON_KEY:', supabaseKey ? '✓ Set' : '✗ Missing');
  console.error('\n📝 Please add these to your .env file:');
  console.error('   SUPABASE_URL=https://lvtaerkugjnynoflfkkh.supabase.co');
  console.error('   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  process.exit(1);
}

console.log('✓ Environment variables found');
console.log(`  URL: ${supabaseUrl}`);
console.log(`  Key: ${supabaseKey.substring(0, 20)}...`);

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('\n✓ Supabase client created');

// Test 1: Check connection by querying scan_history table
console.log('\n🧪 Test 1: Checking table existence...');
const { data, error, count } = await supabase
  .from('scan_history')
  .select('*', { count: 'exact', head: true });

if (error) {
  console.error('❌ Error connecting to database:');
  console.error('   Code:', error.code);
  console.error('   Message:', error.message);
  console.error('   Details:', error.details);
  
  if (error.code === '42P01') {
    console.error('\n⚠️  Table "scan_history" does not exist!');
    console.error('   Please create it using the SQL from SUPABASE_MIGRATION.md');
    console.error('   Go to: https://supabase.com/dashboard/project/lvtaerkugjnynoflfkkh/sql/new');
  } else if (error.code === 'PGRST301') {
    console.error('\n⚠️  Row Level Security is blocking access!');
    console.error('   Make sure you created the policy in the SQL script');
  }
  
  process.exit(1);
}

console.log('✅ Successfully connected to Supabase!');
console.log(`   Table "scan_history" exists`);
console.log(`   Current records: ${count || 0}`);

// Test 2: Try inserting a test record
console.log('\n🧪 Test 2: Testing INSERT operation...');
const testScan = {
  scan_id: 'test-connection-' + Date.now(),
  thumbnail: 'data:image/png;base64,test',
  product_name: 'Test Product',
  brand: 'Test Brand',
  status: 'AUTHENTIC',
  confidence_score: 100,
  reasoning: ['Connection test'],
  extracted_text: ['Test']
};

const { data: insertData, error: insertError } = await supabase
  .from('scan_history')
  .insert([testScan])
  .select()
  .single();

if (insertError) {
  console.error('❌ Insert failed:', insertError.message);
  process.exit(1);
}

console.log('✅ INSERT successful!');
console.log('   Record ID:', insertData.id);
console.log('   Scan ID:', insertData.scan_id);

// Test 3: Try fetching the record
console.log('\n🧪 Test 3: Testing SELECT operation...');
const { data: selectData, error: selectError } = await supabase
  .from('scan_history')
  .select('*')
  .eq('scan_id', testScan.scan_id)
  .single();

if (selectError) {
  console.error('❌ Select failed:', selectError.message);
  process.exit(1);
}

console.log('✅ SELECT successful!');
console.log('   Found:', selectData.product_name);

// Test 4: Try deleting the record
console.log('\n🧪 Test 4: Testing DELETE operation...');
const { error: deleteError } = await supabase
  .from('scan_history')
  .delete()
  .eq('scan_id', testScan.scan_id);

if (deleteError) {
  console.error('❌ Delete failed:', deleteError.message);
  process.exit(1);
}

console.log('✅ DELETE successful!');

console.log('\n' + '='.repeat(50));
console.log('🎉 ALL TESTS PASSED!');
console.log('='.repeat(50));
console.log('\n✅ Database connection is working perfectly!');
console.log('✅ All CRUD operations are functional');
console.log('✅ Your backend is ready to use!\n');
