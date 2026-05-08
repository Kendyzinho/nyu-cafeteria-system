# Deployment Guide

## Target architecture

- Frontend: Angular static app (Nginx)
- Backend: NestJS API
- Database: MySQL

## Option A: Docker Compose (recommended for staging)

```bash
docker compose up --build -d
```

Services:

- Frontend: `http://localhost:4200`
- Backend: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/docs`
- MySQL: `localhost:3306`

## Option B: Cloud deployment

- Frontend: Vercel/Netlify
- Backend: Render/Railway/Fly
- DB: Managed MySQL

### Minimum environment variables

- `DB_HOST`
- `DB_PORT`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`
- `JWT_EXPIRES_IN_SECONDS`
- `PORT`

## Post-deploy smoke tests

1. `GET /api`
2. `POST /api/auth/login`
3. `GET /docs`
4. Access frontend routes by role
