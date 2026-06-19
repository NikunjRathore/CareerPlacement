# Quick Start Guide - Career Placement System

## 📋 Prerequisites

- Node.js (v14+)
- MongoDB (local or cloud)
- npm or yarn

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Clone & Install

```bash
# Backend setup
cd backend
npm install

# Frontend setup (in new terminal)
cd frontend
npm install
```

### Step 2: Environment Variables

**Backend (.env)**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/career-placement
TOKEN_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:5173
```

**Frontend (.env.local)**
```
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Start Services

**Terminal 1 - Backend**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend**
```bash
cd frontend
npm run dev
```

Backend runs on: `http://localhost:5000`  
Frontend runs on: `http://localhost:5173`

---

## 🎯 First Time User Flow

### 1. Create Account
- Go to `/register`
- Fill in name, email, password
- Submit

### 2. Complete Profile
- Go to `/profile`
- Fill academic info: Department, Graduation Year, CGPA
- Save

### 3. Add Coding Profile (Optional)
- Go to `/coding-profile`
- Link LeetCode, HackerRank, CodeChef accounts
- Save (auto-calculates score)

### 4. Upload Resume
- Go to `/resume`
- Upload PDF or paste text
- View ATS score (target > 70)

### 5. Check Readiness Score
- Go to `/readiness`
- See overall placement readiness
- Follow suggestions to improve

### 6. Target Companies
- Go to `/company-targeting`
- View recommended companies
- Add companies to targets
- See historical data and cutoffs

### 7. Apply & Track
- Go to `/jobs`
- Apply for jobs
- Go to `/applications`
- Track each application's progress

---

## 🧪 Test Data for Demo

### Create Admin Account
```
Email: admin@college.com
Password: admin123
```

### Test Job Application
1. Admin adds a company: "Tech Corp"
2. Admin adds a job for that company
3. Student applies to the job
4. Student tracks application status

### Create Test Notification
```bash
curl -X POST http://localhost:5000/api/notifications/add_notification \
  -H "Authorization: Bearer <student_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Placement Drive",
    "message": "Tech Corp hiring now",
    "type": "info"
  }'
```

---

## 📊 Admin Features

### Add Company
1. Go to `/admin`
2. Click "Add Company"
3. Fill company details
4. Submit

### Add Job
1. Go to `/admin`
2. Click "Add Job"
3. Select company
4. Fill job details (role, CTC, requirements)
5. Submit

### Add Historical Data (Optional)
```bash
POST /api/company-data
Body: {
  company_id: "...",
  year: 2023,
  slots_offered: 10,
  students_interviewed: 50,
  students_selected: 8,
  min_package: 8.5,
  max_package: 15.0,
  avg_package: 12.0,
  min_cgpa: 7.0,
  cutoff_cgpa: 7.5,
  roles: ["Software Engineer", "Data Scientist"]
}
```

---

## 🔑 Key Workflows

### For Students

**Workflow 1: Get Placement Ready**
```
Register → Complete Profile → Add Coding Profile 
→ Upload Resume → Check Readiness Score → Improve
```

**Workflow 2: Apply for Jobs**
```
Browse Jobs → Apply → Track Application 
→ Update Rounds → View Status
```

**Workflow 3: Target Companies**
```
View Recommendations → Add to Targets 
→ Check Historical Data → Apply for Jobs
```

### For Admins

**Workflow 1: Setup Placements**
```
Add Companies → Add Jobs → Broadcast Notifications
```

**Workflow 2: Track Statistics**
```
Monitor applications → View placement stats
```

---

## 🆘 Troubleshooting

### Issue: "Not authorized" error
**Solution:** Make sure token is included in Authorization header

### Issue: ATS score shows 0
**Solution:** Upload resume text or PDF file content for analysis

### Issue: Readiness score not updating
**Solution:** Click "Calculate" button to update score

### Issue: Can't add notification
**Solution:** Ensure your email contains "admin" in the email address

### Issue: MongoDB connection error
**Solution:** 
```bash
# Check MongoDB is running
# or use MongoDB Atlas (cloud) connection string
```

---

## 📱 Feature Overview

| Feature | Location | What It Does |
|---------|----------|-------------|
| Coding Profile | `/coding-profile` | Track LeetCode, HackerRank scores |
| Resume | `/resume` | Upload resume and check ATS score |
| Applications | `/applications` | Track job applications and rounds |
| Readiness | `/readiness` | See placement readiness score (0-100) |
| Companies | `/company-targeting` | View and target companies |
| Interview Prep | `/interview-prep` | Track DSA and mock interviews |

---

## 🎓 Learning Resources

### DSA Topics to Cover (In Order)
1. Arrays & Strings
2. Linked Lists
3. Stacks & Queues
4. Trees & BST
5. Graphs
6. Dynamic Programming
7. Sorting & Searching

### Recommended Platforms
- LeetCode: Problem solving
- GeeksforGeeks: Concepts and explanations
- InterviewBit: Company-specific questions
- HackerRank: Practice problems

---

## 🚢 Deployment

### Deploy Backend (Heroku Example)
```bash
cd backend
# Add Procfile:
# web: npm start

git push heroku main
```

### Deploy Frontend (Vercel Example)
```bash
cd frontend
npm run build
vercel --prod
```

### Update API URLs
- Production backend URL
- Update `VITE_API_URL` in frontend `.env`

---

## 📞 Support & Help

### Check Logs
- Backend: `npm start` terminal
- Frontend: Browser console (F12)
- Network: Browser Network tab

### Debug API Issues
```bash
# Test backend health
curl http://localhost:5000/

# Test authentication
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/auth/me
```

---

## 📈 Next Steps

1. **Customize**: Modify colors, add your college logo
2. **Add Data**: Import real company and job data
3. **Extend**: Add more features based on needs
4. **Deploy**: Move to production server
5. **Monitor**: Track student placements

---

**Version:** 2.0 (Advanced Features)  
**Last Updated:** 2024  
**Status:** ✅ Ready to Use
