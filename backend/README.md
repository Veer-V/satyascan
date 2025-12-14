# Quick Start Guide - MongoDB Backend

## 🚀 Start the Backend Server

```bash
cd e:\Avishkar_Project_SatyaScan\ui-page\ml-scaning-ui_ux\server
npm start
```

## ⚠️ Before First Run

### Configure MongoDB Atlas Network Access

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Login → **Network Access** (left sidebar)
3. Click **"Add IP Address"**
4. Select **"Add Current IP Address"** → **Confirm**
5. Wait 1-2 minutes

### Verify Server is Connected

When the server starts successfully, you should see:
``<truncated>
└── .env                   # MongoDB connection string
```

## Environment Variables

### Backend (server/.env)
```
MONGODB_URI=mongodb+srv://mdibransiddique01:MD%40IBRAN%40SIDDIQUE@cluster0.4h7xoyg.mongodb.net/satyascan
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env.local)
```
GEMINI_API_KEY=<your-key>
VITE_API_URL=http://localhost:5000
```

## Troubleshooting

**Problem**: MongoDB connection error  
**Solution**: Whitelist your IP in MongoDB Atlas

**Problem**: CORS error  
**Solution**: Check FRONTEND_URL in server/.env matches your Vite port

**Problem**: API calls fail  
**Solution**: Ensure backend is running on port 5000

## Check Database

View saved scans in MongoDB Atlas:
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. **Database** → **Browse Collections**
3. Select: `satyascan` database → `scanhistories` collection
