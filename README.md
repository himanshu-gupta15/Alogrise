# 🚀 ALGORISE - Competitive Programming Platform

A full-stack MERN application for competitive programming where users can solve problems, compete in contests, and submit their own problems for community contribution.

---

## 🎓 Interview Preparation
Are you preparing this project for job interviews? We have created a comprehensive, deep-dive interview preparation guide covering architecture, key system designs, technical challenges (like the Stripe state persistence fix), database schemas, and expected questions:
👉 **[Interview Preparation & Project Deep-Dive Guide (INTERVIEW_PREP.md)](file:///Users/himanshugupta/Desktop/web-dev/mern/major_project/ALGORISE/INTERVIEW_PREP.md)**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Problem Submission Workflow](#problem-submission-workflow)
4. [User Roles](#user-roles)
5. [Tech Stack](#tech-stack)
6. [Project Structure](#project-structure)
7. [Setup & Installation](#setup--installation)
8. [Running the Application](#running-the-application)
9. [Key Features Explained](#key-features-explained)
10. [Database Migration](#database-migration)
11. [API Endpoints](#api-endpoints)

---

## 🎯 Overview

**ALGORISE** is a competitive programming platform that allows:
- ✅ Users to solve coding problems
- ✅ Users to submit their own problems (pending admin review)
- ✅ Admins to create, review, approve, and manage problems
- ✅ Leaderboards showing top performers
- ✅ XP/Score system for gamification
- ✅ Contests and challenges
- ✅ Video solutions for problems
- ✅ Interview preparation packs

---

## ✨ Features

### For Users
- 🔐 User authentication (signup/login)
- 📝 Solve coding problems in multiple languages
- 📊 Track solved problems and XP score
- 🏆 Compete in leaderboards
- 📤 **Submit problems for community** (NEW!)
- 📋 View submission history
- 🎥 Watch video solutions
- 🎮 Participate in contests

### For Admins
- 🛡️ Create coding problems directly (auto-published)
- ✅ Review pending problems from users
- 📝 Approve or reject submissions
- ✏️ Edit and delete existing problems
- 📹 Upload video solutions
- 🏅 Create contests and challenges
- 👥 User management

---

## 🔄 Problem Submission Workflow

### Complete User Flow

```
┌─────────────────────────────────────────────────────┐
│                    START (User)                      │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
        ┌──────────────────────────┐
        │  Navigate to Home Page   │
        │  Click "Submit Problem"  │
        └────────────┬─────────────┘
                     │
                     ▼
        ┌──────────────────────────────────┐
        │   Fill Problem Details:          │
        │   - Title                        │
        │   - Description                  │
        │   - Difficulty (Easy/Med/Hard)   │
        │   - Topics (Tags)                │
        │   - Test Cases (Input/Output)    │
        │   - Code Templates               │
        │   - Reference Solution           │
        └────────────┬─────────────────────┘
                     │
                     ▼
        ┌──────────────────────────────────┐
        │   Submit Problem Form            │
        │   ✓ Validation runs              │
        │   ✓ Reference code tested        │
        └────────────┬─────────────────────┘
                     │
                     ▼
    ┌────────────────────────────────────┐
    │  Problem Created: Status = PENDING  │
    │  ✓ Saved to Database                │
    │  ✓ User redirected to /my-problems  │
    └────────────┬──────────────────────┘
                 │
    ┌────────────────────────────────────┐
    │        ADMIN REVIEW PHASE            │
    └────────────┬──────────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────┐
    │  Admin logs in → /admin dashboard  │
    │  Views "Pending Problems" list      │
    │  Shows all pending user submissions │
    └────────────┬──────────────────────┘
                 │
                 ├─────────────┬────────────────┐
                 │             │                │
                 ▼             ▼                ▼
            ┌────────┐   ┌─────────┐   ┌────────────┐
            │ APPROVE │   │ REJECT  │   │ ASK CHANGES│
            └────┬───┘   └────┬────┘   └────┬───────┘
                 │            │             │
                 ▼            ▼             ▼
        ┌─────────────┐  ┌────────┐  ┌──────────────┐
        │Status=      │  │Status= │  │Manual Review │
        │APPROVED     │  │REJECTED│  │with user     │
        └─────┬───────┘  └───┬────┘  └──────┬───────┘
              │              │               │
              ▼              ▼               ▼
        ┌──────────────────────────────────────┐
        │ LIVE ON PLATFORM (Approved only)     │
        │ ✓ Visible in /problems page          │
        │ ✓ Users can solve it                 │
        │ ✓ Appears in leaderboards            │
        │                                      │
        │ NOT VISIBLE (Rejected)               │
        │ ✗ Hidden from users                  │
        │ ✓ Creator can see in /my-problems    │
        └──────────────────────────────────────┘
```

### Admin Direct Create Flow (Faster)
```
Admin → Click "Create Problem" in /admin
  ↓
Fill problem details
  ↓
Submit
  ↓
Status = APPROVED (Automatic!)
  ↓
LIVE immediately 🎉
```

---

## 👥 User Roles

### Regular User
- ✅ Solve problems
- ✅ Submit own problems (go to pending)
- ✅ View their submissions status
- ✅ See only approved problems
- ✅ Compete in public contests

### Admin User
- ✅ All user features
- ✅ Create problems (auto-published)
- ✅ Review pending problems
- ✅ Approve/Reject submissions
- ✅ Edit/Delete problems
- ✅ Upload video solutions
- ✅ Manage contests
- ✅ See all problems (including pending)

---

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **React Router** - Navigation
- **Redux** - State management
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Lucide Icons** - Icon library

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Redis** - Caching (optional)

---

## 📁 Project Structure

```
ALGORISE/
├── frontend/
│   ├── src/
│   │   ├── component/
│   │   │   ├── nav.jsx              (Navigation bar)
│   │   │   ├── AdminPanel.jsx       (Problem creation form)
│   │   │   ├── Leaderboard.jsx      (Rankings)
│   │   │   ├── SubmissionHistory.jsx (Submissions)
│   │   │   └── ... (other components)
│   │   ├── pages/
│   │   │   ├── Admin.jsx            (Admin dashboard - pending problems)
│   │   │   ├── MyProblems.jsx       (User submission tracking)
│   │   │   ├── ProblemDetail.jsx    (Problem solving page)
│   │   │   ├── home.jsx             (All problems list)
│   │   │   └── ... (other pages)
│   │   ├── App.jsx                  (Routes definition)
│   │   └── redux/                   (Redux state)
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── user.js              (User schema)
│   │   │   ├── problem.js           (Problem schema with status field)
│   │   │   ├── submission.js        (User submissions)
│   │   │   └── ... (other models)
│   │   ├── controllers/
│   │   │   ├── userProblem.js       (Core problem logic)
│   │   │   └── ... (other controllers)
│   │   ├── routes/
│   │   │   ├── problemCreator.js    (Problem endpoints)
│   │   │   └── ... (other routes)
│   │   ├── middleware/
│   │   │   ├── userMiddleware.js    (User auth)
│   │   │   ├── adminMiddleware.js   (Admin auth)
│   │   │   └── ... (other middleware)
│   │   └── utils/
│   │       ├── connectDb.js         (Database connection)
│   │       └── ... (helpers)
│   ├── migrate-legacy-problems.js   (Migration script)
│   └── package.json
│
└── README.md (This file!)
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js v14+ installed
- MongoDB running locally or cloud connection
- npm or yarn package manager

### Step 1: Clone & Navigate
```bash
cd /Users/himanshugupta/Desktop/web-dev/mern/major_project/ALGORISE
```

### Step 2: Setup Backend
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
MONGO_URI=mongodb://localhost:27017/algorise
JWT_KEY=your_secret_key_here
NODE_ENV=development
PORT=5000
SKIP_JUDGE_ON_CREATE=true
EOF

# Start backend server
npm start
```

### Step 3: Setup Frontend (New Terminal)
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Step 4: Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 🎮 Running the Application

### Development Mode
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Production Build
```bash
# Frontend
cd frontend && npm run build

# Backend runs with NODE_ENV=production
```

---

## 📖 Key Features Explained

### 1. Problem Status System

Every problem has a `status` field:

| Status | Visibility | Creator | Use Case |
|--------|-----------|---------|----------|
| `approved` | Visible to all users | Any | Problem is published and live |
| `pending` | Only to creator & admin | User | Awaiting admin review |
| `rejected` | Only to creator & admin | User | Admin rejected the submission |
| (null/missing) | Visible to all (legacy) | Admin (old) | Problems created before status feature |

**Access Control:**
```javascript
// User can see:
✓ All approved problems
✓ All legacy problems (no status field)
✓ Their own pending/rejected problems

// Admin can see:
✓ All problems (all statuses)
✓ Pending problems list for review
```

### 2. Problem Submission Process

**User Submission Route:**
```
POST /problem/create (userMiddleware)
  ↓
Creates with status: 'pending'
  ↓
Goes to admin dashboard
```

**Admin Creation Route:**
```
POST /problem/create (but from /admin path)
  ↓
Creates with status: 'approved' (auto)
  ↓
Published immediately
```

### 3. Admin Review

**Admin Dashboard (`/admin`):**
- Shows only `pending` problems
- Displays problem creator info
- Approve button → Updates `status: 'approved'`
- Reject button → Updates `status: 'rejected'`

**Approve/Reject Endpoint:**
```
PUT /problem/update/:id (adminMiddleware)
Body: { status: 'approved' or 'rejected' }
```

### 4. User Tracking

**MyProblems Page (`/my-problems`):**
- Shows all problems created by logged-in user
- Displays status with color coding:
  - 🟢 Green: Approved
  - 🔴 Red: Rejected
  - 🟡 Yellow: Pending

### 5. XP & Score System

- Users earn 10 XP per problem solved
- Score = Total XP accumulated
- Shown on leaderboards
- Part of ranking system

---

## 🔄 Database Migration

### Why Migrate?

Problems created by admins **before** the status feature was added don't have a `status` field. They need to be marked as 'approved' so users can see them.

### Running Migration

```bash
cd backend
node migrate-legacy-problems.js
```

**Expected Output:**
```
🔄 Starting migration of legacy problems...
✅ Migration complete!
📊 Updated 42 problems to approved status
📊 Matched 42 problems total
```

**What It Does:**
- Finds all problems without a `status` field
- Marks them as `status: 'approved'`
- Makes them visible to all users
- Runs once (safe to run multiple times)

---

## 🔌 API Endpoints

### Authentication
```
POST   /auth/signup              Create new account
POST   /auth/login               Login user
POST   /auth/logout              Logout user
```

### Problems - User (userMiddleware)
```
POST   /problem/create           Submit new problem
GET    /problem/getAllProblem    Get all approved problems
GET    /problem/problemById/:id  Get single problem details
GET    /problem/myProblems       Get user's submitted problems
GET    /problem/pending          Get pending problems (admin only)
```

### Problems - Admin (adminMiddleware)
```
PUT    /problem/update/:id       Update problem (approve/reject)
DELETE /problem/delete/:id       Delete problem
POST   /problem/create           Create problem (auto-approved)
```

### Problem Solving
```
GET    /problem/submittedProblem/:pid    Get submissions for problem
GET    /problem/problemSolvedByUser      Get problems solved by user
```

### Other Features
```
GET    /leaderboard              Get top users by XP
POST   /submit                   Submit solution code
GET    /contests                 Get all contests
POST   /video/upload             Upload video solution
```

---

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Role-based access control (user vs admin)
- ✅ Password hashing (bcrypt)
- ✅ Protected routes
- ✅ Status-based visibility
- ✅ Creator-based access
- ✅ Admin middleware validation

---

## 📝 Example Workflows

### Workflow 1: User Submits Problem

```bash
# User goes to home page
# Clicks "Submit Problem" in navigation

# Fills form:
- Title: "Two Sum Problem"
- Description: "Find two numbers that add up to target"
- Difficulty: Medium
- Topics: ["Array", "HashMap"]
- Test cases:
  Input: nums = [2,7,11,15], target = 9
  Output: [0,1]
- Code template (JavaScript)
- Reference solution

# Submits form
# Backend receives: POST /problem/create
# Creates problem with status: 'pending'
# User redirected to /my-problems
# Shows status badge as "PENDING" (yellow)

# Admin logs in → /admin
# Sees pending problem in dashboard
# Clicks "Approve"
# Problem updates to status: 'approved'
# Now visible to all users on /problems page
# User sees status changed to "APPROVED" (green)
```

### Workflow 2: Admin Creates Problem

```bash
# Admin clicks "Create Problem" button in /admin dashboard

# Fills form with problem details
# Submits form
# Backend receives: POST /problem/create (with admin role)
# Creates problem with status: 'approved' (automatic!)
# User redirected to /admin dashboard

# Problem is LIVE immediately
# All users can see it on /problems page
# No approval needed
```

### Workflow 3: Legacy Problem Migration

```bash
# Old admin-created problem exists without status field
# User tries to view it → ERROR (not published)

# Admin runs: node migrate-legacy-problems.js
# Script finds problem without status
# Updates to status: 'approved'
# User refreshes → Problem now visible!
```

---

## 🎯 Common Issues & Solutions

### Issue: Can't see admin-created problems from before
**Solution:** Run migration script
```bash
cd backend && node migrate-legacy-problems.js
```

### Issue: User problems not showing after submit
**Solution:** 
1. Check problem status in DB (should be 'pending')
2. Admin needs to approve it first
3. After approval, it shows to all users

### Issue: Admin can't approve problems
**Solution:**
1. Verify user has admin role in database
2. Check adminMiddleware is working
3. Try logging out and in again

### Issue: XP not increasing
**Solution:**
1. Problem must be approved first
2. Solution must be accepted (correct output)
3. Check user XP field in database

---

## 📱 Testing the Features

### Test User Flow
1. Create new user account
2. Go to home → view problems
3. Click "Submit Problem"
4. Fill and submit form
5. Check /my-problems → see "PENDING" status
6. Login as admin
7. Go to /admin → find pending problem
8. Click Approve
9. Login as regular user → see problem approved

### Test Admin Flow
1. Login as admin
2. Click "Create Problem" in /admin
3. Fill and submit
4. Problem should be live immediately
5. Check /problems → problem visible
6. Regular user should see it

---

## 📚 Learning Resources

- **MongoDB Documentation**: https://docs.mongodb.com/
- **Express.js Guide**: https://expressjs.com/
- **React Documentation**: https://react.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **JWT Auth**: https://jwt.io/

---

## 🤝 Contributing

To add new problems or features:
1. Users submit problems via `/create-problem`
2. Admins review and approve
3. Problems become live after approval
4. Community votes/rates problems

---

## 📞 Support

For issues or questions:
1. Check this README
2. Review error messages in console
3. Check database for data consistency
4. Run migration script if needed

---

## ✅ Checklist for First Time Setup

- [ ] MongoDB is running
- [ ] Backend `.env` file created
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend server started (`npm start`)
- [ ] Frontend dev server started (`npm run dev`)
- [ ] Can access http://localhost:5173
- [ ] Can signup/login
- [ ] Can view problems
- [ ] Migration script runs successfully (for legacy problems)
- [ ] Can submit problem as user
- [ ] Can approve/reject as admin

---

## 🎉 You're All Set!

Your ALGORISE competitive programming platform is ready to use! Start creating and solving problems! 🚀

---

**Last Updated:** May 29, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
