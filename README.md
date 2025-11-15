# 📊 Number Communication Tree

A simple full-stack application built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Drizzle ORM**.  
This app allows users to register, login, and perform mathematical operations in a collaborative "discussion tree."

---

## 🚀 Features

- **Authentication**
  - Register new accounts
  - Login with username & password
  - JWT-based authentication stored in `localStorage`
  - Logout endpoint to clear session

- **Discussion Tree**
  - Start a new discussion with a starting number
  - Add operations (+, -, *, /) to existing nodes
  - Each node stores:
    - `id`, `parentId`
    - `operation`, `leftValue`, `rightValue`
    - `result`
    - `userId`
    - `username` (linked to the user who created it by userId)

- **Frontend**
  - Built with Next.js (App Router)
  - Styled using Tailwind CSS
  - Pages:
    - `HomePage`: shows the discussion tree, start form, operation form
    - `LoginPage`: login form with link to register
    - `RegisterPage`: register form with link to login

- **Backend (API Routes)**
  - `/api/register` → create new user
  - `/api/login` → authenticate user and return JWT
  - `/api/logout` → invalidate session (client removes token)
  - `/api/start` → create a starting node
  - `/api/operation` → add an operation node
  - `/api/tree` → fetch all nodes (with optional join to show username)

---

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Drizzle ORM + PostgreSQL (or Supabase)
- **Auth**: JWT (JSON Web Token)
- **Language**: TypeScript

---

## 📂 Project Structure

- /app 
    - /login/page.tsx # Login page 
    - /register/page.tsx# Register page 
    - /page.tsx # Home page (discussion tree) 
    - /db
        - /schema.ts # Database schema (users, nodes) 
        - /index.ts # Database connection
- /pages/api 
    - /login.ts # Login endpoint 
    - /register.ts # Register endpoint 
    - /start.ts # Start new discussion node 
    - /operation.ts # Add operation node 
    - /tree.ts # Fetch discussion tree 

---

## 🔑 Authentication Flow

1. **Register** → `/api/register`  
   - Creates a new user with hashed password.  
2. **Login** → `/api/login`  
   - Validates credentials, returns JWT.  
   - Token stored in `localStorage`.  
3. **Protected APIs** (`/api/start`, `/api/operation`)  
   - Require `Authorization: Bearer <token>` header.  

---

## 🖥️ UI Overview

- **HomePage**
  - Shows login/register buttons if not logged in
  - Shows logout button if logged in
  - Start new discussion form
  - Add operation form
  - Discussion tree with clickable nodes

- **LoginPage**
  - Username & password inputs
  - Login button
  - Link to Register

- **RegisterPage**
  - Username & password inputs
  - Register button
  - Link to Login

---

## ⚙️ Setup & Run

1. Clone the repository:
   ```bash
   git clone https://github.com/dipaadipati/ellty-assignment-mini-app.git
   cd ellty-assignment-mini-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables (.env.local):

   ```bash
   DATABASE_URL=your_database_url
   JWT_SECRET=your_secret_key
   ```

4. Run development server:

   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 in your browser.

---

## 🧪 Testing

- Unit tests with **Jest** and **node-mocks-http**
- Example tests:
    - `/api/register` → should create user or return error
    - `/api/login` → should authenticate or reject invalid credentials
    - Tree operations → should add nodes correctly

---

## 📌 Notes

- All UI and API messages are in English for global readiness.

- Tailwind CSS is used for modern, responsive styling.

- JWT tokens are stored in localStorage (simple demo approach).

- For production, consider implementing token blacklist or refresh tokens.

---

## 🧑‍💻 Author

- Developed by **Adipati Rezkya**
- Full-stack developer specializing in Next.js, TypeScript, Tailwind CSS, and backend automation.