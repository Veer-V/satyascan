# MongoDB Atlas IP Whitelisting Guide

## Your IP Information

**Private IP (Local Network)**: 192.168.1.204
**Public IP**: [Will be detected below]

---

## Quick Steps to Whitelist Your IP

### Step 1: Go to MongoDB Atlas
Open: **https://cloud.mongodb.com**

### Step 2: Add Your IP
1. Click **"Network Access"** (left sidebar under Security)
2. Click **"ADD IP ADDRESS"** (green button)

### Step 3: Choose ONE Option

**Option A: Add Specific IP (More Secure)**
- Enter your public IP manually
- Add a comment like "My Development Machine"
- Click **"Confirm"**

**Option B: Allow All IPs (Easier for Development)**
- Click **"ALLOW ACCESS FROM ANYWHERE"**
- This adds `0.0.0.0/0`
- Click **"Confirm"**
- ⚠️ Less secure, but useful when your IP changes

### Step 4: Wait
Wait **2-3 minutes** for changes to take effect

### Step 5: Test Connection
```bash
cd backend
node test-db-connection.js
```

---

## After Whitelisting

Once your IP is whitelisted:
- ✅ Backend will connect to MongoDB
- ✅ VS Code MongoDB extension will work
- ✅ Your app can save/load data
- ✅ All database features enabled

---

## Recommendation

**For development, use Option B (Allow All IPs)** so you don't have to update it every time your IP changes.
