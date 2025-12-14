# SatyaScan - Quick Start Guide

## 🚀 Run the Project (Single Command)

From the root directory, simply run:

```bash
npm start
```

This will:
- Start the backend server on **http://localhost:5000**
- Start the frontend server on **http://localhost:3000**
- Run both concurrently in the same terminal

## 📦 First Time Setup

### 1. Install Node.js Dependencies

```bash
npm run install:all
```

This will install dependencies for the root, backend, and frontend.

### 2. Install Python Dependencies (for ML Model)

```bash
cd backend
pip install -r requirements.txt
```

**Or** use the test script to check everything:
```bash
.\TEST_ML.bat
```

### 3. Environment Variables (Optional - for Chatbot)

The chatbot (LUCI) requires a Gemini API key. Create `frontend/.env.local`:

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Note**: Product scanning works without this! Only the chatbot needs the API key.

## 🛠️ Available Commands

- `npm start` - Start both backend and frontend servers
- `npm run start:backend` - Start only the backend server
- `npm run start:frontend` - Start only the frontend server
- `npm run install:all` - Install all dependencies

## 🌐 Access Points

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📁 Project Structure

```
ml-scaning-ui_ux/
├── backend/           → Express + MongoDB API (Port 5000)
├── frontend/          → React + Vite App (Port 3000)
├── package.json       → Root package with npm start
└── RUN.bat           → Alternative: Batch file to run both
```

## 🔍 Troubleshooting

If you get "port already in use" errors:
1. Stop any running instances
2. Kill processes on ports 3000 and 5000
3. Run `npm start` again

---

**Note**: The backend may show "database disconnected" status. This is normal if MongoDB is not configured. The application will still work for local development.
