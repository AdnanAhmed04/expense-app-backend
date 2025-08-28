# Expense Tracker API (Express + MongoDB Atlas + JWT)

A secure, production-ready backend for your Netlify React expense app.

## 1) Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (free)

## 2) Create MongoDB Atlas Cluster
1. Sign in at https://www.mongodb.com/cloud/atlas and create a **Free** shared cluster.
2. Go to **Database** → **Connect** → **Username & Password** → create a database user.
3. Go to **Network Access** → **IP Access List** → add your IP (or `0.0.0.0/0` for testing).
4. Click **Connect** → **Drivers** and copy the connection string (it starts with `mongodb+srv://...`).

## 3) Configure the project
```bash
# inside the project root
cp .env.example .env
# edit .env and set MONGO_URI, JWT_SECRET, etc.
```

## 4) Install & Run (local)
```bash
npm install
npm run dev
# Server will start on http://localhost:5000
```

## 5) API Overview
**Auth**
- `POST /api/auth/register` → body: `{ name, email, password }`
- `POST /api/auth/login` → body: `{ email, password }`
- `GET /api/auth/me` (Bearer token)

**Transactions** (Bearer token required)
- `GET /api/transactions?start=YYYY-MM-DD&end=YYYY-MM-DD&type=income|expense&category=Food&page=1&limit=20&sort=-date`
- `POST /api/transactions` → `{ type, amount, category, date, note? }`
- `GET /api/transactions/:id`
- `PATCH /api/transactions/:id`
- `DELETE /api/transactions/:id`

**Stats** (Bearer token required)
- `GET /api/stats/summary?start=YYYY-MM-DD&end=YYYY-MM-DD`
- `GET /api/stats/by-category?start=YYYY-MM-DD&end=YYYY-MM-DD&type=expense`
- `GET /api/stats/by-month?year=2025`

## 6) Quick Test (cURL)
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register   -H "Content-Type: application/json"   -d '{"name":"Adnan","email":"adnan@example.com","password":"secret123"}'

# Login -> copy the token from response
curl -X POST http://localhost:5000/api/auth/login   -H "Content-Type: application/json"   -d '{"email":"adnan@example.com","password":"secret123"}'

# Create a transaction (replace TOKEN below)
curl -X POST http://localhost:5000/api/transactions   -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json"   -d '{"type":"expense","amount":1200,"category":"Food","date":"2025-08-25","note":"Lunch"}'
```

## 7) CORS
Set `CORS_ORIGINS` in `.env` with your local and deployed frontend URLs, e.g.
```
CORS_ORIGINS=http://localhost:5173,https://expense-app-adnan.netlify.app
```

## 8) Deploy (Render example)
1. Push this project to a GitHub repo.
2. Go to **Render** → **New +** → **Web Service** → connect repo.
3. Runtime: Node, Build Command: `npm install`, Start Command: `npm start`.
4. Add environment variables from your `.env` (MONGO_URI, JWT_SECRET, etc.).
5. Deploy and update your frontend to call the deployed API URL.

> Generated on 2025-08-28T10:07:51.815520Z
