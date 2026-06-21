# Project Setup Guide

This guide contains the exact terminal commands required to initialize this project from scratch.

## 1. Prerequisites
- Install **Node.js** (v18+)
- Install **Git**
- Create a **MongoDB Atlas** account and obtain your connection string.

## 2. Root Project Initialization
```bash
# Create the root directory
mkdir RD-INFRO-TECHNOLOGY
cd RD-INFRO-TECHNOLOGY

# Initialize Git
git init
```

## 3. Backend Setup
```bash
# Create backend directory
mkdir backend
cd backend

# Initialize package.json
npm init -y

# Install core dependencies
npm install express mongoose cors dotenv bcryptjs jsonwebtoken

# Install development dependencies
npm install -D nodemon

# Create folder structure
mkdir config controllers middleware models routes
type nul > server.js
type nul > .env
cd ..
```

## 4. Frontend Setup
```bash
# Initialize React app using Vite
npm create vite@latest frontend -- --template react
cd frontend

# Install core dependencies
npm install
npm install react-router-dom axios lucide-react

# Install and configure Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Create folder structure
cd src
mkdir components pages context services
cd ../..
```

## 5. Environment Variables Configuration

**Backend (`backend/.env`):**
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/employee_management
JWT_SECRET=your_super_secret_jwt_key
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

## 6. Running the Project Locally

Open two separate terminals from the root `RD-INFRO-TECHNOLOGY` directory.

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
