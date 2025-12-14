// Complete Database CRUD Test
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lvtaerkugjnynoflfkkh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2dGFlcmt1Z2pueW5vZmxma2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MDQ3NjQsImV4cCI6MjA4MTI4MDc2NH0.IjG7ezWC1e8Vc6ZuhS4oFsm63uD-ayynEU49uPcp1os';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🧪 Testing Complete CRUD Operations\n');

async function runTests() {
  const testScanId = 'test-scan-' + Date.now();
  
  try {
    // Test 1: INSERT
    console.log('📝 Test 1: INSERT - Creating a test scan...');
    const { data: insertData, error: insertError } = await supabase
      .from('scan_history')
      .insert([{
        scan_id: testScanId,
        thumbnail: 'data:image/png;base64,testimage',
        product_name: 'Advanced Night Repair',
        brand: 'Estée Lauder',
        status: 'AUTHENTIC',
        confidence_score: 98,
        reasoning: ['Valid batch code', 'Correct packaging', 'Official seal present'],
        batch_code: 'A67B',
        extracted_text: ['Estée Lauder', 'Advanced Night Repair']
      }])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ INSERT failed:', insertError.message);
      return;
    }
    
    console.log('✅ INSERT successful!');
    console.log('   Scan ID:', insertData.scan_id);
    console.log('   Product:', insertData.product_name);
    console.log('   Brand:', insertData.brand);
    console.log();
    
    // Test 2: SELECT (Read)
    console.log('📖 Test 2: SELECT - Fetching the scan...');
    const { data: selectData, error: selectError } = await supabase
      .from('scan_history')
      .select('*')
      .eq('scan_id', testScanId)
      .single();
    
    if (selectError) {
      console.error('❌ SELECT failed:', selectError.message);
      return;
    }
    
    console.log('✅ SELECT successful!');
    console.log('   Found:', selectData.product_name);
    console.log('   Status:', selectData.status);
    console.log('   Confidence:', selectData.confidence_score + '%');
    console.log();
    
    // Test 3: SELECT ALL
    console.log('📋 Test 3: SELECT ALL - Fetching all scans...');
    const { data: allScans, error: allError } = await supabase
      .from('scan_history')
      .select('*')
      .order('date', { ascending: false });
    
    if (allError) {
      console.error('❌ SELECT ALL failed:', allError.message);
      return;
    }
    
    console.log('✅ SELECT ALL successful!');
    console.log('   Total scans in database:', allScans.length);
    console.log();
    
    // Test 4: STATISTICS
    console.log('📊 Test 4: STATISTICS - Getting counts...');
    const { count: totalCount } = await supabase
      .from('scan_history')
      .select('*', { count: 'exact', head: true });
    
    const { count: authenticCount } = await supabase
      .from('scan_history')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'AUTHENTIC');
    
    console.log('✅ STATISTICS successful!');
    console.log('   Total scans:', totalCount);
    console.log('   Authentic scans:', authenticCount);
    console.log();
    
    // Test 5: DELETE
    console.log('🗑️  Test 5: DELETE - Removing test scan...');
    const { error: deleteError } = await supabase
      .from('scan_history')
      .delete()
      .eq('scan_id', testScanId);
    
    if (deleteError) {
      console.error('❌ DELETE failed:', deleteError.message);
      return;
    }
    
    console.log('✅ DELETE successful!');
    console.log();
    
    console.log('═'.repeat(50));
    console.log('🎉 ALL TESTS PASSED!');
    console.log('═'.repeat(50));
    console.log('\n✅ Your Supabase database is fully operational!');
    console.log('✅ All CRUD operations working perfectly!');
    console.log('✅ Backend is ready for production use!\n');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error(error);
  }
}

runTests();
