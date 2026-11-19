# SAHAAYALEARN — PRODUCTION DEPLOYMENT & OPERATIONS GUIDE

## 1. System Requirements

- **Node.js:** v18.0.0 or higher (v20+ LTS recommended)
- **Package Manager:** npm v9+ or pnpm v8+
- **Database:** PostgreSQL v15+ with `pgvector` extension (optional for vector search, local fallback engine provided)
- **Memory:** Minimum 2 GB RAM (4 GB recommended for concurrent voice streaming)
- **Operating Systems:** Ubuntu 22.04 LTS, Debian 12, macOS, or Windows (WSL2)

---

## 2. Environment Variables Configuration

Copy `.env.example` in both root and `server/`:

```bash
# In project root (Frontend)
VITE_API_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000
VITE_DEFAULT_LANGUAGE=kn
VITE_DEFAULT_BOARD="Karnataka State Board"

# In server/ (Backend)
PORT=8000
HOST=0.0.0.0
NODE_ENV=production
DATABASE_URL=postgresql://sahaaya:password@localhost:5432/sahaayalearn_db
JWT_SECRET=super-secret-random-32-byte-hex-key
GEMINI_API_KEY=AIzaSy...
SARVAM_API_KEY=sarvam_live_...
LOG_LEVEL=info
CORS_ORIGIN=https://app.sahaayalearn.in
```

---

## 3. Local Development & Verification

### 3.1 Install Dependencies
```bash
# Frontend dependencies
cd /path/to/sahaayalearn
npm install

# Backend dependencies
cd server
npm install
```

### 3.2 Run Automated Tests
```bash
cd server
npm test
# Verifies RAG retrieval, misconception diagnostics, and auth guards (16/16 tests)
```

### 3.3 Start Services in Development Mode
```bash
# Terminal 1 - Backend Server
cd server
npm run dev

# Terminal 2 - Frontend Development Server
npm run dev
```

Visit `http://localhost:5173` to access the application.

---

## 4. Production Build

### 4.1 Build Frontend
```bash
cd /path/to/sahaayalearn
npm run build
# Generates optimized static assets in dist/ with zero TypeScript errors
```

### 4.2 Build Backend
```bash
cd server
npm run build
# Compiles TypeScript into dist/
```

### 4.3 Run Production Backend
```bash
cd server
node dist/index.js
```

---

## 5. Docker Deployment

### 5.1 Docker Compose Architecture
```yaml
version: '3.8'

services:
  postgres:
    image: pgvector/pgvector:pg16
    restart: always
    environment:
      POSTGRES_DB: sahaayalearn_db
      POSTGRES_USER: sahaaya
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    restart: always
    environment:
      DATABASE_URL: postgresql://sahaaya:${DB_PASSWORD}@postgres:5432/sahaayalearn_db
      GEMINI_API_KEY: ${GEMINI_API_KEY}
      SARVAM_API_KEY: ${SARVAM_API_KEY}
      PORT: 8000
    depends_on:
      - postgres
    ports:
      - "8000:8000"

  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    restart: always
    ports:
      - "80:80"

volumes:
  pgdata:
```

---

## 6. Offline / Edge Server Fallback Mode

For rural deployments with intermittent internet connectivity:
1. The frontend's `SahaayaApiClient` (`src/services/api.ts`) includes a zero-latency fallback curriculum engine.
2. If the backend or upstream network is unreachable, the client automatically serves cached NCERT and Karnataka State Board modules, pre-loaded spaced repetition decks, and offline misconception diagnostics.
3. Once connectivity is restored, telemetry and progress sync automatically to the central Academic Twin database.
