# 🧠 MindCode

> A full-stack web platform for college-level coding education — built with React, Firebase, and the Monaco Editor.

---

## 📖 Overview

**MindCode** is an interactive learning management and assessment platform designed for students and faculty in programming courses. It supports live code practice, structured examinations, faculty-managed learning modules, and real-time progress tracking — all within a modern, dark-themed UI.

---

## ✨ Features

### 👨‍🎓 Student Portal
- **Dashboard** — Overview of enrolled courses, progress, and recent activity
- **Learning Modules** — View step-by-step learning content with progress checkpoints
- **Practice Page** — Topic-based coding practice with Monaco Editor (syntax highlighting, auto-complete)
- **Exam Page** — Timed, proctored coding assessments with auto-submission
- **Profile Page** — View and manage personal account information

### 👨‍🏫 Faculty Portal
- **Faculty Dashboard** — Manage courses, students, and learning modules
- **Module Builder** — Create and update rich-text learning modules with versioning
- **Exam Management** — Create and schedule coding exams with test cases
- **Student Analytics** — View student performance using Recharts visualizations
- **Export Reports** — Download student data as PDF or Excel (jsPDF / XLSX)

### 🔐 Authentication
- Separate login flows for **Students** and **Faculty**
- Firebase Authentication with email/password
- Forgot-password flow for both user types

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 + Vite |
| Routing | React Router DOM v5 |
| Styling | Tailwind CSS v3 |
| Code Editor | Monaco Editor (`@monaco-editor/react`) |
| Backend / DB | Firebase (Auth + Firestore) |
| Rich Text | React Quill |
| Charts | Recharts |
| PDF Export | jsPDF + jspdf-autotable |
| Excel Export | XLSX |
| Icons | Lucide React |

---

## 📁 Project Structure

```
mindcode/
├── public/                  # Static assets (logo, favicon, images)
├── src/
│   ├── api/                 # Firebase API helper functions
│   ├── components/
│   │   ├── editor/          # Monaco-based code editor components
│   │   ├── faculty/         # Faculty-specific UI components
│   │   ├── student/         # Student-specific UI components
│   │   ├── ui/              # Shared/reusable UI components
│   │   └── workspace/       # Coding workspace components
│   ├── context/             # React Context (AuthContext)
│   ├── firebase/            # Firebase config & initialization
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Route-level page components
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── PracticePage.jsx
│   │   ├── ExamPage.jsx
│   │   ├── LearningModulesView.jsx
│   │   ├── FacultyDashboardPage.jsx
│   │   └── ...
│   ├── utils/               # Utility/helper functions
│   ├── App.jsx              # Root component with routing
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles
├── .env                     # Environment variables (Firebase keys)
├── index.html               # HTML entry point
├── vite.config.js           # Vite bundler config
├── tailwind.config.js       # Tailwind CSS config
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v16+ and npm
- A [Firebase](https://firebase.google.com/) project with **Authentication** and **Firestore** enabled

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/mindcode.git
cd mindcode/mindcode

# 2. Install dependencies
npm install

# 3. Configure environment variables
#    Copy .env.example to .env and fill in your Firebase credentials
cp .env.example .env
```

### Environment Variables (`.env`)

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Running the App

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` by default.

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

---

## 🗺️ Route Map

| Path | Role | Description |
|---|---|---|
| `/` | Public | Home / Landing Page |
| `/login` | Student | Student Login |
| `/forgot-password` | Student | Student Password Reset |
| `/dashboard` | Student | Student Dashboard |
| `/profile` | Student | Student Profile |
| `/practice/:topicId` | Student | Topic-based Code Practice |
| `/exam/:examId/:submissionId` | Student | Live Exam Environment |
| `/faculty-login` | Faculty | Faculty Login |
| `/faculty-setup` | Faculty | Faculty Account Setup |
| `/faculty-forgot-password` | Faculty | Faculty Password Reset |
| `/faculty-dashboard` | Faculty | Faculty Dashboard |

---

## 👥 Developers

| Name | Role | GitHub | Contact |
|---|---|---|---|
| Aravindaswamy Gunturu | Full Stack Developer | [iarvindswamy](https://github.com/iarvindswamy) | 8522855282 |
| Poojan Sri Paara | Full Stack Developer | [parapoojansri-hue](https://github.com/parapoojansri-hue) | 8309529483 |
| Pavan Kumar Gade | Full Stack Developer | [pavankumargade09](https://github.com/pavankumargade09) | 8529927443 |

---

## 📄 License

This project is intended for academic use. All rights reserved © 2026 MindCode Team.
