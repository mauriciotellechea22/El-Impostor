# El Impostor - Deployment Guide

## Railway Deployment

### Backend + Database

1. **Create Railway Project:**
   ```bash
   railway init
   ```

2. **Add PostgreSQL Database:**
   - Go to Railway dashboard
   - Click "New" → "Database" → "PostgreSQL"
   - Copy the `DATABASE_URL`

3. **Configure Environment Variables:**
   ```
   DATABASE_URL=<from_railway_postgres>
   PORT=3001
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   ```

4. **Deploy:**
   ```bash
   railway up
   ```

5. **Initialize Database:**
   ```bash
   railway run npm run db:setup
   ```

### Frontend (Vercel)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy from client directory:**
   ```bash
   cd client
   vercel
   ```

3. **Set Environment Variable:**
   - Go to Vercel project settings
   - Add `VITE_API_URL` = Railway backend URL

4. **Redeploy:**
   ```bash
   vercel --prod
   ```

## Local Testing

### 1. Setup Database
```bash
createdb elimpostor
```

### 2. Configure Environment
Create `server/.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/elimpostor
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

### 3. Initialize Database
```bash
cd server
npm install
npm run db:setup
```

### 4. Install Client Dependencies
```bash
cd ../client
npm install
```

### 5. Run Development Servers
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

### 6. Test
- Open http://localhost:5173
- Create room in one browser tab
- Join room in another tab
- Play!

## Estimated Costs

| Service | Free Tier | Recommended Tier | Cost/month |
|---------|-----------|------------------|------------|
| Railway | $5 credit | Hobby | $5-20 |
| Vercel | Unlimited | Free | $0 |

**Total:** ~$5-20/month for hobby deployment
