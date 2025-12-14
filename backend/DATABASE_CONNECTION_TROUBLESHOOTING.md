# Database Connection Troubleshooting

## Issue Detected

The PostgreSQL connection is failing with:
```
getaddrinfo ENOTFOUND db.lvtaerkugjnynoflfkkh.supabase.co
```

## Diagnosis Results

✅ Server starts successfully on port 5000
✅ Hostname resolves via NS lookup (IPv6: `2406:da1a:6b0:f616:7d7c:6952:c6fb:aaaa`)
❌ Database connection fails

## Possible Causes

1. **IPv6 vs IPv4 Issue**: The hostname resolves to IPv6, but Node.js might be trying IPv4
2. **Network/Firewall**: Corporate firewall or network blocking PostgreSQL port 5432
3. **Connection Pooler**: Might need to use Supabase's connection pooler instead

## Solutions to Try

### Option 1: Use Supabase Connection Pooler (Recommended)

Instead of direct database connection, use Supabase's connection pooler which is designed for serverless/edge functions:

```env
DATABASE_URL=postgresql://postgres.lvtaerkugjnynoflfkkh:satyascan@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

Or use this transaction mode pooler:

```env
DATABASE_URL=postgresql://postgres.lvtaerkugjnynoflfkkh:satyascan@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?pgbouncer=true
```

### Option 2: Use Supabase REST API Instead

Go back to using `@supabase/supabase-js` with the REST API credentials:

```env
SUPABASE_URL=https://lvtaerkugjnynoflfkkh.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

This doesn't require direct PostgreSQL connection and works over HTTPS.

### Option 3: Check Supabase Dashboard for Correct Connection String

1. Go to: https://supabase.com/dashboard/project/lvtaerkugjnynoflfkkh/settings/database
2. Look for "Connection string" section
3. Copy the EXACT connection string provided there
4. It should show both:
   - Direct connection (port 5432)
   - Connection pooler (port 6543)

### Option 4: Test with SSL Options

Add SSL configuration to the connection string:

```env
DATABASE_URL=postgresql://postgres:satyascan@db.lvtaerkugjnynoflfkkh.supabase.co:5432/postgres?sslmode=require
```

## Current Status

Server is running but cannot connect to database. API responds but database operations will fail.

**Next Step**: Please choose one of the options above or check your Supabase dashboard for the correct connection string.
