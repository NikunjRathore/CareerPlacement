# Setup and Deployment Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend root:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/career_placement
JWT_SECRET=your-secret-key-here
ADMIN_SECRET_KEY=your-secret-key-here
CLIENT_URL=http://localhost:5173
```

### Frontend Setup
```bash
cd frontend
npm install
```

Create `.env.local` file in frontend root:
```
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Server runs on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
App runs on http://localhost:5173

## Features

### User Features
1. **Authentication** - Register and login with JWT
2. **Dashboard** - View notifications and quick links
3. **Job Listings** - Browse available positions
4. **Profile Management** - Update personal information
5. **Resume Upload** - Upload and manage resume
6. **Coding Profile** - Track coding profiles (LeetCode, HackerRank, etc.)
7. **Application Tracker** - Track job applications
8. **Placement Readiness** - Self-assessment tool
9. **Company Targeting** - Target specific companies
10. **Interview Prep** - Interview preparation resources
11. **Mock Interviews** - Practice mock interviews
12. **Placement Stats** - View placement statistics

### Admin Features
1. **Add Companies** - Register new companies
2. **Post Jobs** - Create job postings
3. **Send Notifications** - Broadcast notifications to all users
4. **Placement Stats** - Create and manage placement statistics
5. **Delete Stats** - Remove outdated statistics

## Admin Access

### Becoming an Admin
1. Register a user account normally
2. Use the promote endpoint to make user admin:
```bash
POST /api/admin/promote-to-admin
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
Body: { "adminSecretKey": "your-secret-key-here" }
```

### Admin Dashboard
Navigate to `/admin` (automatically redirected if admin role detected)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/admin/promote-to-admin` - Promote user to admin

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs/add_job` - Create job (admin only)

### Companies
- `GET /api/company` - Get all companies
- `POST /api/company/add_company` - Add company (admin only)

### Notifications
- `GET /api/notifications` - Get all notifications
- `POST /api/notifications/add_notification` - Send notification (admin only)

### Placement Stats
- `GET /api/stats/latest` - Get latest stats (public)
- `GET /api/stats/:year` - Get stats by year (public)
- `POST /api/stats/admin` - Create stats (admin only)
- `GET /api/stats/admin` - Get all stats (admin only)
- `DELETE /api/stats/admin/:id` - Delete stats (admin only)

### User Profile
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update profile (protected)

### Resume
- `POST /api/resume/upload` - Upload resume (protected)
- `GET /api/resume` - Get resume (protected)

### Coding Profile
- `POST /api/coding-profile` - Create/update coding profile (protected)
- `GET /api/coding-profile` - Get coding profile (protected)

### Application Tracker
- `POST /api/applications` - Create application (protected)
- `GET /api/applications` - Get applications (protected)
- `PUT /api/applications/:id` - Update application (protected)

## Database Models

### User
- email (unique)
- password (hashed)
- fullName
- phone
- role (user/admin)
- createdAt

### Job
- company
- role
- location
- ctc
- offerType
- dept (departments)
- minCgpa
- minGradYear
- date (deadline)
- description
- rounds (interview rounds)

### Company
- name (unique)
- website
- logo
- industry
- description

### PlacementStatistics
- year (unique)
- total_students
- placed_students
- placement_percentage (auto-calculated)
- package_stats (highest, lowest, average, median)
- roles_offered (array)
- department_stats
- company_stats

## Deployment

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy dist folder

### Backend (Heroku/Railway/Render)
1. Set environment variables
2. Deploy backend folder
3. Update CLIENT_URL in environment

## Troubleshooting

### CORS Issues
- Update CLIENT_URL in backend .env
- Check origin in cors configuration

### Database Connection
- Verify MongoDB URI
- Ensure MongoDB is running
- Check firewall settings

### Auth Token Issues
- Clear localStorage in browser
- Re-login to get new token
- Check JWT_SECRET in backend

## Environment Variables Reference

**Backend (.env)**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/career_placement
JWT_SECRET=your-secure-jwt-secret
ADMIN_SECRET_KEY=your-secure-admin-key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Frontend (.env.local)**
```
VITE_API_URL=http://localhost:5000/api
```

## Security Considerations
1. Never commit .env files
2. Use strong JWT_SECRET and ADMIN_SECRET_KEY
3. Validate all inputs on backend
4. Use HTTPS in production
5. Implement rate limiting for auth endpoints
6. Keep dependencies updated

## Performance Optimization
1. Frontend uses Vite for fast builds
2. API responses are cached where appropriate
3. Lazy loading for routes
4. Mongoose indexing on frequently queried fields

## Support & Troubleshooting
For issues, check:
1. Console errors (browser F12)
2. Network tab for API responses
3. Backend terminal for server logs
4. MongoDB connection status
