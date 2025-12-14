# SatyaScan - Backend & Frontend Setup

This project has **TWO separate parts** that need to run simultaneously:

## Project Structure

```
Avishkar_Project_SatyaScan/
├── ui-page/
│   └── ml-scaning-ui_ux/          # ← FRONTEND (React + Vite)
│       ├── components/
│       ├── services/
│       ├── App.tsx
│       ├── package.json
│       └── .env.local             # Frontend config
│
│       └── server/                # ← BACKEND (Express + MongoDB)
│           ├── config/
│           ├── models/
│           ├── routes/
│           ├── server.js
│           ├── package.json
│           └── .env               # Backend config
```

---

## ⚙️ How to Run Both Servers

### Terminal 1: Backend Server (Port 5000)

```bash
# Navigate to backend folder
cd e:\Avishkar_Project_SatyaScan\ui-page\ml-scaning-ui_ux\server

# Start backend
npm start
```

**Expected Output:**
```
🚀 Server is running on port 5000
✅ MongoDB Connected: cluster0.4h7xoyg.mongodb.net
```

---

### Terminal 2: Frontend Server (Port 5173)

```bash
# Navigate to frontend folder
cd e:\Avishkar_Project_SatyaScan\ui-page\ml-scaning-ui_ux

# Start frontend (ALREADY RUNNING)
npm run dev
```

**Expected Output:**
```
VITE v6.2.0 ready in XXX ms
Local: http://localhost:5173/
```

---

## ✅ Both Servers Must Be Running

| Server | Port | Purpose |
|--------|------|---------|
| **Backend** | 5000 | API + MongoDB database |
| **Frontend** | 5173 | React UI (Vite dev server) |

### Communication Flow:
```
Browser (5173) → API calls → Backend (5000) → MongoDB Atlas
```

---

## 🔧 Configuration Files

### Backend (.env)
Location: `server/.env`

```env
MONGODB_URI=mongodb+srv://mdibransiddique01:MD%40IBRAN%40SIDDIQUE@cluster0.4h7xoyg.mongodb.net/satyascan
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env.local)
Location: `.env.local` (root of ml-scaning-ui_ux)

```env
GEMINI_API_KEY=AIzaSyALD9SGUnLIkZXQHdK3gL_lAZhye-iaUHI
VITE_API_URL=http://localhost:5000
```

---

## 🚨 Before First Run

**1. Whitelist IP in MongoDB Atlas:**
- Go to https://cloud.mongodb.com
- **Network Access** → **Add IP Address** → **Add Current IP**
- Wait 2-3 minutes

**2. Install Dependencies (if not done):**

```bash
# Backend dependencies
cd server
npm install

# Frontend dependencies (if needed)
cd ..
npm install
```

---

## 🧪 Testing the Setup

1. **Start Backend** (Terminal 1)
2. **Start Frontend** (Terminal 2 - already running)
3. **Open Browser**: http://localhost:5173
4. **Perform a scan** → Check console for:
   ```
   ✅ Scan saved to database successfully
   ```
5. **View Dashboard** → Should show scan data
6. **Refresh page** → History should persist (from MongoDB)

---

## 📌 Quick Commands Reference

```bash
# Backend
cd e:\Avishkar_Project_SatyaScan\ui-page\ml-scaning-ui_ux\server
npm start

# Frontend  
cd e:\Avishkar_Project_SatyaScan\ui-page\ml-scaning-ui_ux
npm run dev
```

---

## ❓ Troubleshooting

**Backend won't start:**
- Check MongoDB IP whitelist
- Verify credentials in `server/.env`
- See `server/TROUBLESHOOTING.md`

**Frontend can't reach backend:**
- Ensure backend is running on port 5000
- Check `.env.local` has correct `VITE_API_URL`
- Restart frontend server after env changes

**CORS errors:**
- Verify `FRONTEND_URL` in `server/.env` matches frontend port
