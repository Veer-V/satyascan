import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env
dotenv.config();

console.log('📋 Environment Variables Check\n');
console.log('Current directory:', process.cwd());
console.log('Script directory:', __dirname);
console.log();

// Try to read .env file directly
try {
  const envPath = join(__dirname, '.env');
  const envContent = readFileSync(envPath, 'utf-8');
  console.log('📄 .env file contents:');
  console.log('─'.repeat(50));
  console.log(envContent);
  console.log('─'.repeat(50));
} catch (err) {
  console.error('❌ Could not read .env file:', err.message);
}

console.log('\n🔍 Loaded Environment Variables:');
console.log('  PORT:', process.env.PORT || '(not set)');
console.log('  FRONTEND_URL:', process.env.FRONTEND_URL || '(not set)');
console.log('  DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set (' + process.env.DATABASE_URL.substring(0, 30) + '...)' : '❌ NOT SET');
console.log();

if (!process.env.DATABASE_URL) {
  console.error('⚠️  DATABASE_URL is MISSING!');
  console.error('   Please add this line to your .env file:');
  console.error('   DATABASE_URL=postgresql://postgres:satyascan@db.lvtaerkugjnynoflfkkh.supabase.co:5432/postgres');
} else {
  console.log('✅ All required environment variables are present!');
}
