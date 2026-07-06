# 🚀 CareerPlacement

A full-stack placement management platform that helps students track applications, prepare for placements, analyze readiness, and discover eligible opportunities while enabling administrators to manage companies, jobs, and placement workflows efficiently.

🌐 **Live Demo:** [CareerPlacement Demo](https://career-placement.vercel.app/?utm_source=chatgpt.com)

---

## ✨ Features

### 👨‍🎓 Student Features

* Secure JWT-based authentication and authorization
* Apply to placement opportunities posted by administrators
* Track application status throughout the recruitment process
* ATS-based resume evaluation and scoring
* Personalized placement readiness scoring
* Coding profile tracking and progress monitoring
* Placement analytics dashboard
* View application history and records
* Smart job eligibility filtering based on:

  * Branch
  * CGPA
  * Graduation year
  * Placement criteria

### 👨‍💼 Admin Features

* Create and manage companies
* Post placement opportunities
* Update recruitment statuses
* Manage placement workflows
* Monitor student applications
* Maintain centralized placement records

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JWT Authentication
* Role-Based Access Control (RBAC)
* Password Hashing
* CORS Policies

### Deployment

* Frontend: Vercel
* Database: MongoDB Atlas

---

## 🏗️ System Architecture

The platform follows a modern full-stack architecture:

* **Frontend:** React + Vite for a responsive user experience
* **Backend:** REST APIs built using Express.js
* **Authentication:** JWT-based role-driven authorization
* **Database:** MongoDB for flexible placement and user data management
* **Security:** CORS protection and centralized authentication workflows

---

## 📊 Core Modules

### 📄 ATS Resume Evaluation

Analyze resumes and generate scores to help students improve their chances during recruitment processes.

### 📈 Placement Analytics Dashboard

Visualize:

* Total applications
* Application statuses
* Placement progress
* Readiness metrics
* Career preparation insights

### 💻 Coding Profile Tracking

Track competitive programming and coding preparation progress to support placement readiness.

### 🎯 Smart Eligibility Engine

Automatically match opportunities based on:

* Academic branch
* CGPA requirements
* Graduation year
* Company-specific eligibility criteria

---

## 🔐 Role-Based Access Control

| Feature                       | Student | Admin |
| ----------------------------- | ------- | ----- |
| Apply for Jobs                | ✅       | ❌     |
| View Application History      | ✅       | ❌     |
| Resume Evaluation             | ✅       | ❌     |
| Placement Analytics           | ✅       | ✅     |
| Add Companies                 | ❌       | ✅     |
| Create Job Openings           | ❌       | ✅     |
| Manage Recruitment Status     | ❌       | ✅     |
| Placement Workflow Management | ❌       | ✅     |

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone <repository-url>
cd CareerPlacement
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file inside the backend directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

---

## 🚀 Future Enhancements

* Email notifications for placement updates
* AI-powered placement recommendations
* Advanced analytics and insights
* Export placement reports
* Calendar integration for recruitment schedules
* Automated coding profile synchronization
* Mobile application support

---

## 🎯 Motivation

CareerPlacement was built to simplify the campus placement journey by combining application tracking, preparation tools, analytics, and intelligent opportunity matching into a single platform.

The goal is to help students stay organized, improve their readiness, and make informed career decisions while giving administrators efficient placement management capabilities.

---

## 👨‍💻 Author

**Nikunj**

If you like this project, feel free to ⭐ the repository!
