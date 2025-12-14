# How to Get Your Supabase Connection Pooler URL

## Step-by-Step Instructions

1. **Open your Supabase Database Settings**
   - Go to: https://supabase.com/dashboard/project/lvtaerkugjnynoflfkkh/settings/database

2. **Find "Connection String" Section**
   - Scroll down to the "Connection String" section
   - You'll see multiple tabs:
     - URI
     - JDBC
     - .NET
     - Golang
     - etc.

3. **Look for "Connection Pooling" Section**
   - Below the connection strings, there should be a **"Connection pooling"** section
   - This will have a different URL that uses **port 6543** instead of 5432

4. **The Pooler URL Format**
   Your connection pooler URL should look like this:
   ```
   postgresql://postgres.lvtaerkugjnynoflfkkh:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
   ```

5. **Replace [YOUR-PASSWORD] with `satyascan`**
   ```
   postgresql://postgres.lvtaerkugjnynoflfkkh:satyascan@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
   ```

6. **Update Your .env File**
   Replace the current DATABASE_URL in your `.env` with the pooler URL:
   ```env
   DATABASE_URL=postgresql://postgres.lvtaerkugjnynoflfkkh:satyascan@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
   ```

7. **Restart Your Server**
   Stop the current server (Ctrl+C) and restart:
   ```bash
   node server.js
   ```

## Why Connection Pooler?

- ✅ **Better for serverless/backend apps**: Designed for applications with many connections
- ✅ **More reliable**: Uses optimized routing
- ✅ **No DNS issues**: Better network compatibility
- ✅ **Port 6543**: Different port than direct connection (5432)

## Alternative: Transaction Mode

If the pooler URL above doesn't work, try the transaction mode:
```
postgresql://postgres.lvtaerkugjnynoflfkkh:satyascan@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?pgbouncer=true
```

## Can't Find It?

If you can't find the connection pooler section in your dashboard:

**Manual Construction**:
The format is typically:
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

For your project:
- PROJECT-REF: `lvtaerkugjnynoflfkkh`
- PASSWORD: `satyascan`
- REGION: Likely `ap-south-1` (India) or check your project region

So try:
```
postgresql://postgres.lvtaerkugjnynoflfkkh:satyascan@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

## After Updating

Test the connection:
```bash
curl http://localhost:5000/api/health
```

You should see:
```json
{"database": {"connected": true}}
```
