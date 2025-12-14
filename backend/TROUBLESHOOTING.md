# MongoDB Authentication Failed - Fix Guide

## Error
```
MongoServerError: bad auth : authentication failed
```

## Most Common Causes & Solutions

### 1. ✅ IP Address Not Whitelisted (MOST LIKELY)

**This is the #1 reason for authentication failures with MongoDB Atlas.**

**Steps to Fix:**

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Log in with your credentials
3. Select your project (where cluster0 is located)
4. Click **"Network Access"** in the left sidebar
5. Click **"Add IP Address"** button
6. Choose one of these options:
   - **Recommended**: Click "Add Current IP Address" (safest)
   - **For Testing Only**: Click "Allow Access from Anywhere" (0.0.0.0/0)
7. Click **"Confirm"**
8. **WAIT 2-3 MINUTES** for the changes to take effect
9. Try starting the server again

---

### 2. Check Database User Credentials

1. In MongoDB Atlas, click **"Database Access"** in left sidebar
2. Verify the user exists: `mdibransiddique01`
3. Check that the password is: `MD@IBRAN@SIDDIQUE`
4. If password is wrong, click **"Edit"** → **"Edit Password"** → Set new password
5. **Important**: If you change the password, update `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:NEW_PASSWORD_HERE@cluster0.4h7xoyg.mongodb.net/satyascan
   ```
   Replace special characters:
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`
   - `&` → `%26`

---

### 3. Verify User Has Correct Permissions

1. In **Database Access**, check the user
2. Should have role: **"Atlas admin"** OR **"Read and write to any database"**
3. If not, click **"Edit"** → Update role → **"Save"**

---

## How to Test After Fixing

1. **Restart the backend server:**
   ```bash
   cd e:\Avishkar_Project_SatyaScan\ui-page\ml-scaning-ui_ux\server
   npm start
   ```

2. **Look for success message:**
   ```
   ✅ MongoDB Connected: cluster0.4h7xoyg.mongodb.net
   📊 Database: satyascan
   🔗 Mongoose connected to MongoDB
   ```

3. **If still failing**, check MongoDB Atlas → Cluster → **"Connect"** → **"Connect your application"**
   - Verify the connection string matches

---

## Current Configuration

**Connection String (in server/.env):**
```
mongodb+srv://mdibransiddique01:MD%40IBRAN%40SIDDIQUE@cluster0.4h7xoyg.mongodb.net/satyascan
```

**Username:** `mdibransiddique01`  
**Password:** `MD@IBRAN@SIDDIQUE` (encoded as `MD%40IBRAN%40SIDDIQUE`)  
**Cluster:** `cluster0.4h7xoyg.mongodb.net`  
**Database:** `satyascan`

---

## Alternative: Get Connection String from Atlas

1. In MongoDB Atlas, click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Select **Driver: Node.js**, **Version: 5.5 or later**
4. Copy the connection string
5. Replace `<password>` with your actual password (URL-encoded)
6. Replace `<dbname>` with `satyascan`
7. Update `server/.env` with this new string

---

**After whitelisting your IP, the server should connect successfully!**
