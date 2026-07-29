# Deployment Guide

CareerOS-AI utilizes a distributed, 100% free-tier deployment stack optimized for performance and zero-cost scaling.

## Architecture Mapping
- **Frontend**: Vercel (Edge Network)
- **Backend**: Render (Docker Web Service)
- **Database**: Neon (Serverless PostgreSQL)

## 1. Database Deployment (Neon)
1. Create a project at [Neon.tech](https://neon.tech).
2. Retrieve the Postgres connection string.
3. Ensure the string ends with `?sslmode=require`.

## 2. Backend Deployment (Render)
1. Create a new Web Service at [Render](https://render.com).
2. Connect this GitHub repository.
3. Render will automatically detect the `render.yaml` infrastructure-as-code file.
4. Supply the following required environment variables in the Render Dashboard:
   - `DATABASE_URL`: The Neon connection string
   - `DATABASE_USERNAME`: Neon database user
   - `DATABASE_PASSWORD`: Neon database password
   - `JWT_SECRET`: A secure 256-bit hexadecimal string
   - `CORS_ALLOWED_ORIGINS`: Your Vercel production URL (e.g., `https://careeros-ai.vercel.app`)

## 3. Frontend Deployment (Vercel)
1. Import this repository into [Vercel](https://vercel.com).
2. Set the **Root Directory** to `frontend`.
3. The framework will automatically be detected as Vite.
4. Add the following environment variable:
   - `VITE_API_BASE_URL`: Your Render backend URL (e.g., `https://careeros-backend.onrender.com/api/v1`)
5. Deploy. The `vercel.json` file ensures SPA routing works natively.
