# 🌀 TeamPulse

**TeamPulse** is a lightweight full-stack app that helps teams track daily check-ins by logging mood, completed tasks, and blockers. It's designed for transparency, team wellbeing, and efficient daily stand-ups.

---

## 🚀 Features

- Daily check-in form with mood, tasks, and blockers
- JWT-based authentication (user & admin roles)
- Admin-only team dashboard
- Redis caching to optimize performance
- AWS Secrets Manager for secure config
- Styled with Tailwind CSS for a clean and modern UI
- Includes error handling and basic validations

---

## 🛠 Tech Stack

### Frontend
- React 19
- React Router 7
- Tailwind CSS
- Axios

### Backend
- Node.js / Express
- PostgreSQL (via Prisma ORM)
- Redis (with ioredis)
- AWS Secrets Manager (for Redis + DB credentials)

---

## 📦 Installation

### 1. Clone the Repo
```bash
git clone https://github.com/your-username/teampulse.git
cd teampulse
```

### 2. Setup the Server
```bash
cd server
npm install
```

### 3. Setting Up Local Redis with Docker

To run a local Redis instance using Docker:
```bash
docker run --name teampulse-redis -p 6379:6379 -d redis
```

Create a `.env` file in `/server`:
```
PORT=3001
DATABASE_URL=postgresql://your-user:your-password@your-db-url:5432/your-db-name
JWT_SECRET=your-super-secret-key
NODE_ENV=development
REDIS_HOST=localhost
REDIS_PORT=6379
```

Then run:
```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

### 3. Setup the Client
```bash
cd ../client
npm install
npm start
```

---

## 🧪 Test Admin Account (for Demo)
```txt
email: admin@example.com
password: admin123
```

---

## 🌐 Routes Overview

### Public
- `/login`
- `/register`

### Protected
- `/dashboard` – User check-in
- `/team-dashboard` – Admin-only team check-ins

---

## 📁 Project Structure

```
client/
├── components/
├── layouts/
├── pages/
├── styles/
└── App.tsx

server/
├── controllers/
├── services/
├── middlewares/
├── utils/
└── index.ts
```

---

## 📜 License

MIT
