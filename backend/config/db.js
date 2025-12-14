import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ Missing DATABASE_URL in .env file');
  console.error('   Required: DATABASE_URL=postgresql://...');
  process.exit(1);
}

const sql = postgres(connectionString);

console.log('✅ PostgreSQL client initialized');
console.log('📍 Connected to: Supabase PostgreSQL');

export default sql;
