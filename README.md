# 🎉 Eventora - Full-Stack MERN Event Booking Platform

> A modern full-stack Event Booking & Management platform built using the MERN Stack with secure authentication, OTP verification, role-based access, and a powerful Admin Dashboard.

---

# 🌐 Live Demo

### 🔗 Live Application
**https://eventora-mern-six.vercel.app**

---

# 👨‍💼 Admin Demo Credentials

Use these credentials to explore the Admin Dashboard.

**Email:** `admin@eventora.com`

**Password:** `password123`

➡️ After login, admin will automatically access the Admin Dashboard.

---

# 👤 User Demo Credentials

**Email:** `user@eventora.com`

**Password:** `password123`

---

# 📌 Project Overview

Eventora is a full-stack MERN Event Booking Platform where users can browse events, register securely using Email OTP verification, and book tickets for both free and paid events.

Administrators can manage events, verify bookings, monitor revenue, approve or reject booking requests, and view platform analytics from a dedicated dashboard.

---

# ✨ Features

## 🔐 Authentication & Security

- JWT Authentication
- Password Encryption using bcrypt
- Email OTP Verification
- Protected Routes
- Role-Based Authorization
- Secure Session Management

---

## 👤 User Features

- User Registration
- Login System
- Email OTP Verification
- Browse Events
- Search Events
- Filter by Category
- Book Free Events
- Book Paid Events
- Booking History
- Cancel Booking
- User Dashboard

---

## 👨‍💼 Admin Features

- Secure Admin Login
- Admin Dashboard
- Create Events
- Update Events
- Delete Events
- Manage Users
- View Bookings
- Approve Booking Requests
- Reject Booking Requests
- Mark Payment Status
- Revenue Analytics
- Booking Statistics
- Event Statistics

---

## 🎫 Smart Booking System

- OTP Verification before Booking
- Pending Approval Workflow
- Seat Availability Validation
- Overbooking Protection
- Booking Confirmation
- Email Notifications

---

## 📊 Admin Dashboard Analytics

- Total Users
- Total Events
- Total Bookings
- Pending Requests
- Confirmed Bookings
- Paid Revenue
- Booking Status Analytics

---

## 📧 Email Services

- Registration OTP
- Booking OTP
- Booking Confirmation
- Nodemailer Integration

---

# 🛠 Tech Stack

## Frontend

- React.js
- React Router DOM
- Axios
- Tailwind CSS
- Vite

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs
- Nodemailer

---

# 📂 Project Structure

```
Eventora-MERN
│
├── client
│   ├── src
│   ├── public
│   └── package.json
│
├── server
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   ├── seed.js
│   └── package.json
│
└── README.md
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the **server** folder.

```env
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

EMAIL_USER=your_gmail@gmail.com

EMAIL_PASS=your_google_app_password

PORT=5000
```

Create a `.env` file inside the **client** folder.

```env
VITE_API_URL=http://localhost:5000/api
```

For Production (Vercel)

```env
VITE_API_URL=https://eventora-mern-26rr.onrender.com/api
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/ChaurasiyaDharmendra/Eventora-MERN.git
```

```
cd Eventora-MERN
```

---

## Install Dependencies

```bash
npm install

npm run install:all
```

---

## Run Application

### Single Command

```bash
npm run dev
```

---

### Backend

```bash
cd server

npm install

npm run dev
```

---

### Frontend

```bash
cd client

npm install

npm run dev
```

---

# 🌱 Seed Demo Data

```bash
cd server

node seed.js
```

This creates:

- Admin Account
- Demo User
- Sample Events
- Demo Bookings

---

# 🔐 Demo Credentials

## Admin

Email

```
golu78dk@gmail.com
```

Password

```
password123
```

---

## User

Email

```
user@eventora.com
```

Password

```
password123
```

---

# 📸 Key Modules

- Authentication
- OTP Verification
- Event Management
- Booking Management
- Admin Dashboard
- Revenue Tracking
- User Dashboard
- Email Notifications

---

# 💼 Resume Highlights

✔ Full-Stack MERN Project

✔ JWT Authentication

✔ Email OTP Verification

✔ Role-Based Authorization

✔ Admin Dashboard

✔ Booking Management System

✔ MongoDB Atlas Integration

✔ Responsive UI

✔ REST API

✔ Production Deployment

---

# 🌍 Deployment

Frontend

**Vercel**

Backend

**Render**

Database

**MongoDB Atlas**

---

# 👨‍💻 Developer

**Dharmendra Chaurasiya**

B.Tech Information Technology

Full Stack MERN Developer

GitHub:
https://github.com/ChaurasiyaDharmendra

---

## ⭐ If you like this project, don't forget to give it a Star ⭐