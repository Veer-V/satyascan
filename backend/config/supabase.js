import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://lvtaerkugjnynoflfkkh.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
  console.error('❌ Missing SUPABASE_KEY in .env file');
  console.error('   Required: SUPABASE_KEY=your_anon_key');
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseKey);

console.log('✅ Supabase client initialized');
console.log(`📍 Connected to: ${supabaseUrl}`);
