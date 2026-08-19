# PressIt 🗜️

PressIt is a modern, full-stack web application designed for high-performance image compression and management. It features a robust backend for handling complex compression logic, rate limiting, and user authentication, paired with a Next.js frontend frontend.

> **⚠️ Project Status: Work in Progress (WIP)**  
> The **Server/Backend** is mostly complete and functional, featuring a robust architecture with JWT auth, Redis rate limiting, and MongoDB integration.  
> The **Client/Frontend** is currently under heavy development and requires further fixes and polish.

---

## 🏗️ Project Architecture

This repository is structured as a monorepo containing the following directories:

- `/server`: The Express.js backend API
- `/client`: The Next.js React frontend
- `/admin`: The Admin Dashboard frontend (WIP)

---

## 💻 Tech Stack

### Server (Backend)

The backend is built for performance, security, and scalability.

- **Framework:** Node.js with Express.js (v5)
- **Language:** TypeScript
- **Database:** MongoDB (via Mongoose 9.x)
- **Caching & Rate Limiting:** Redis (via `ioredis` & Upstash)
- **Authentication:** JWT (JSON Web Tokens), Google OAuth (`google-auth-library`), bcryptjs
- **Image Processing & Storage:** Sharp (for compression), Cloudinary (for cloud storage), Multer (for uploads)
- **Security:** Helmet, CORS, custom CSRF protection, express-rate-limit
- **Email Services:** Nodemailer
- **Task Scheduling:** Node-cron

### Client (Frontend) _[WIP]_

The client leverages the latest React features and Tailwind for rapid styling.

- **Framework:** Next.js (v16.2.9)
- **Library:** React (v19.2.4)
- **Styling:** Tailwind CSS (v4)
- **Data Fetching:** TanStack React Query (v5)
- **UI Components:** Base UI, Shadcn, class-variance-authority
- **Authentication:** `@react-oauth/google`
- **Icons:** FontAwesome & Lucide React
- **Client-side Compression:** `browser-image-compression`

### Admin (Dashboard) _[WIP]_

The administrative dashboard for managing users, subscriptions, and platform analytics.

- **Framework:** Next.js (v16.3.1)
- **Library:** React (v19.2.8)
- **Styling:** Tailwind CSS (v4)
- **Data Fetching:** TanStack React Query (v5)
- **UI Components:** Base UI, Shadcn, class-variance-authority
- **Charts & Data Visualization:** Recharts
- **Date Management:** date-fns
- **Icons:** FontAwesome & Lucide React
- **Authentication:** `@react-oauth/google`

---

## ✨ Key Features

- **Advanced Image Compression:** Utilizes `sharp` for fast, lossless, and lossy image compression.
- **Tiered Rate Limiting:** Redis-backed rate limiting that strictly enforces daily compression limits based on user subscription tiers (Guest, Free, Plus, Pro).
- **Authentication System:** Secure email/password login and Google OAuth integration.
- **Cloud Storage:** Direct integration with Cloudinary for secure and reliable image hosting.
- **Admin Dashboard (WIP):** Analytics and revenue tracking for subscription management.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v20+)
- MongoDB (Local or Atlas)
- Redis (Local or Upstash)
- Cloudinary Account

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and add the required environment variables:

   ```env
   PORT=3001
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:3000

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Redis
   REDIS_URL=your_redis_url
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Client Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Admin Setup

1. Navigate to the admin directory:
   ```bash
   cd admin
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3001](http://localhost:3001) (or the port specified in terminal) in your browser.
