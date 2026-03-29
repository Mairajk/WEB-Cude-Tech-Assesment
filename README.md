# 📝 BlogMS — Blog Management System

A full-stack Blog Management System built with the MERN stack featuring JWT authentication and role-based access control.

## 🔗 Live Demo

- **Frontend:** https://web-cude-tech-assesment.vercel.app/
- **Backend:** https://web-cude-tech-assesment-production.up.railway.app/api/health

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose
- **Frontend:** React 18, React Router v6, Axios, Tailwind CSS
- **Auth:** JWT (Access + Refresh Tokens)
- **Validation:** Express Validator (backend), React Hook Form + Yup (frontend)

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js v20
- MongoDB Atlas account
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/blog-management-system.git
cd blog-management-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/blog_assessment
JWT_SECRET=your-secret-jwt-key
JWT_REFRESH_SECRET=your-secret-refresh-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Start backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

### Default Login Credentials

| Role   | Email            | Password     |
| ------ | ---------------- | ------------ |
| Admin  | test03@gmail.com | TestUser.123 |
| Author | test01@gmail.com | TestUser.123 |

---

## 📡 API Endpoints

| Method | Endpoint                  | Access  | Description         |
| ------ | ------------------------- | ------- | ------------------- |
| POST   | `/api/auth/register`      | Public  | Register user       |
| POST   | `/api/auth/login`         | Public  | Login user          |
| POST   | `/api/auth/logout`        | Private | Logout user         |
| POST   | `/api/auth/refresh`       | Public  | Refresh token       |
| GET    | `/api/auth/me`            | Private | Current user        |
| GET    | `/api/posts`              | Public  | Get published posts |
| GET    | `/api/posts/my`           | Private | Get posts by role   |
| POST   | `/api/posts`              | Private | Create post         |
| PUT    | `/api/posts/:id`          | Private | Update post         |
| DELETE | `/api/posts/:id`          | Private | Delete post         |
| PATCH  | `/api/posts/:id/status`   | Private | Publish/unpublish   |
| GET    | `/api/posts/:id/comments` | Public  | Get comments        |
| POST   | `/api/posts/:id/comments` | Private | Add comment         |
| GET    | `/api/stats/posts`        | Admin   | Blog statistics     |
