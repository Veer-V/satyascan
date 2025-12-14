# Quick Start: Connect MongoDB Database

## Your IP Address
**Current IP**: `106.219.57.11`

## Step 1: Whitelist IP in MongoDB Atlas (2 minutes)

1. Go to https://cloud.mongodb.com/
2. Click **Network Access** (left sidebar)
3. Click **+ ADD IP ADDRESS** button  
4. Choose one:
   - **Option A (Recommended for Dev)**: Click "ALLOW ACCESS FROM ANYWHERE" → Confirm
   - **Option B**: Enter IP `106.219.57.11` → Confirm
5. **Wait 2-3 minutes** for changes to apply

## Step 2: Test Connection

```bash
cd backend
node test-db-connection.js
```

**Expected Output**: ✅ DATABASE TEST COMPLETED SUCCESSFULLY

## Step 3: Start Application

```bash
npm start
```

Look for: `✅ MongoDB Connected: cluster0.4h7xoyg.mongodb.net`

## Step 4: Test Scanning

1. Open http://localhost:5173
2. Click "NEW SCAN"
3. Upload any product image
4. Check backend logs for: `✅ Scan saved successfully`
5. Go to History → verify scan appears

**Data persists** = Refresh page, scan is still there ✅

---

## Troubleshooting

**Still can't connect after whitelisting?**
- Wait 3 minutes and try again
- Use "Allow from Anywhere" (0.0.0.0/0) instead
- Restart backend server

**For detailed help**: See `implementation_plan.md`
