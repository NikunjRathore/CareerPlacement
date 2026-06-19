# API Reference Guide

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require:
```
Headers: {
  Authorization: "Bearer <jwt_token>"
}
```

---

## Auth Endpoints

### Register
```
POST /auth/register
Body: {
  name: string,
  email: string,
  password: string
}
Response: { id, name, email, token }
```

### Login
```
POST /auth/login
Body: {
  email: string,
  password: string
}
Response: { id, name, email, token }
```

### Get Current User
```
GET /auth/me
Headers: Authorization Bearer token
Response: { User object }
```

---

## User Endpoints

### Update Profile
```
PUT /users/profile
Headers: Authorization Bearer token
Body: {
  name, email, phone, department, gradYear, cgpa, bio
}
Response: { Updated user object }
```

---

## Coding Profile Endpoints

### Get Coding Profile
```
GET /coding-profile
Headers: Authorization Bearer token
Response: { CodingProfile object }
```

### Create/Update Coding Profile
```
POST /coding-profile
Headers: Authorization Bearer token
Body: {
  leetcode: { username, rating, problems_solved },
  hackerrank: { username, rating },
  codechef: { username, rating, problems_solved },
  github: { username, repositories, followers }
}
Response: { CodingProfile object with overall_score }
```

### Delete Coding Profile
```
DELETE /coding-profile
Headers: Authorization Bearer token
Response: { message: "success" }
```

---

## Application Tracker Endpoints

### Get All Applications
```
GET /applications
Headers: Authorization Bearer token
Response: [ ApplicationTracker objects ]
```

### Get Application Statistics
```
GET /applications/stats
Headers: Authorization Bearer token
Response: {
  total_applications: number,
  by_status: { status: count },
  selected_count: number,
  rejected_count: number
}
```

### Create New Application
```
POST /applications
Headers: Authorization Bearer token
Body: {
  job_id: string,
  company_id: string
}
Response: { ApplicationTracker object }
```

### Get Single Application
```
GET /applications/:id
Headers: Authorization Bearer token
Response: { ApplicationTracker object }
```

### Update Application
```
PUT /applications/:id
Headers: Authorization Bearer token
Body: {
  status: string,              // applied, screening, round1, round2, round3, interview, selected, rejected, waitlist
  current_round: number,
  rounds_completed: array,
  rounds_pending: array,
  notes: string,
  interview_date: date,
  offer_package: number
}
Response: { Updated ApplicationTracker object }
```

### Delete Application
```
DELETE /applications/:id
Headers: Authorization Bearer token
Response: { message: "success" }
```

---

## Resume Endpoints

### Get Resume
```
GET /resume
Headers: Authorization Bearer token
Response: { Resume object with ATS score }
```

### Upload Resume
```
POST /resume
Headers: Authorization Bearer token
Content-Type: multipart/form-data
Body:
  file: <PDF/DOC file>
  extracted_text: string (optional)
Response: { Resume object with ATS analysis }
```

### Get ATS Details
```
GET /resume/ats/details
Headers: Authorization Bearer token
Response: {
  ats_score: number,
  score_breakdown: { format, keyword, content, sections },
  keywords_found: number,
  total_keywords: number,
  suggestions: array,
  sections: object
}
```

### Update Resume Suggestions
```
PUT /resume/suggestions
Headers: Authorization Bearer token
Body: {
  suggestions: array
}
Response: { Resume object }
```

### Delete Resume
```
DELETE /resume
Headers: Authorization Bearer token
Response: { message: "success" }
```

---

## Company Data Endpoints

### Get Company Historical Data (Public)
```
GET /company-data/history/:company_id
Response: [ CompanyData objects for all years ]
```

### Get Latest Year Company Data (Public)
```
GET /company-data/latest
Response: [ CompanyData objects for current year ]
```

### Get Recommended Companies
```
GET /company-data/recommended
Headers: Authorization Bearer token
Response: [ CompanyData objects matching user CGPA ]
```

### Get User's Target Companies
```
GET /company-data/targets
Headers: Authorization Bearer token
Response: [ CompanyData objects ]
```

### Add Company to Targets
```
POST /company-data/targets
Headers: Authorization Bearer token
Body: {
  company_id: string
}
Response: { message: "success", target_companies: array }
```

### Remove Company from Targets
```
DELETE /company-data/targets/:company_id
Headers: Authorization Bearer token
Response: { message: "success", target_companies: array }
```

### Add Company Historical Data (Admin Only)
```
POST /company-data
Headers: Authorization Bearer token
Body: {
  company_id: string,
  year: number,
  slots_offered: number,
  students_interviewed: number,
  students_selected: number,
  min_package: number,
  max_package: number,
  avg_package: number,
  min_cgpa: number,
  cutoff_cgpa: number,
  roles: array,
  department_stats: array,
  interview_type: string,
  duration: string
}
Response: { CompanyData object }
```

---

## Placement Readiness Endpoints

### Get Readiness Score
```
GET /readiness/score
Headers: Authorization Bearer token
Response: {
  current_score: number,
  total_score: number,
  max_score: 100,
  breakdown: {
    academic: { score, max },
    coding_profile: { score, max },
    resume: { score, max },
    applications: { score, max },
    target_companies: { score, max }
  },
  suggestions: array
}
```

### Calculate/Update Readiness Score
```
POST /readiness/calculate
Headers: Authorization Bearer token
Response: { Readiness score object }
```

### Get Readiness Progress
```
GET /readiness/progress
Headers: Authorization Bearer token
Response: {
  profile_completion: { academic_info, coding_profile, resume, target_companies },
  completion_percentage: number,
  applications: {
    total: number,
    applied: number,
    shortlisted: number,
    selected: number,
    rejected: number
  }
}
```

---

## Jobs Endpoints

### Get All Jobs
```
GET /jobs
Query Params: (optional)
  department: string
  minCgpa: number
Response: [ Jobs objects with company details ]
```

### Create Job (Admin)
```
POST /jobs/add_job
Headers: Authorization Bearer token
Body: {
  company: string,
  role: string,
  location: array,
  ctc: number,
  offerType: string,
  dept: array,
  minCgpa: number,
  minGradYear: number,
  date: date,
  description: string
}
Response: { Job object }
```

---

## Company Endpoints

### Get All Companies
```
GET /company
Response: [ Company objects ]
```

### Create Company (Admin)
```
POST /company/add_company
Headers: Authorization Bearer token
Body: {
  name: string,
  website: string,
  logo: string,
  industry: string,
  description: string
}
Response: { Company object }
```

---

## Notification Endpoints

### Get All Notifications
```
GET /notifications
Response: [ Notification objects ]
```

### Create Notification (Admin Only)
```
POST /notifications/add_notification
Headers: Authorization Bearer token
Body: {
  title: string *required,
  message: string *required,
  type: string *required (info, warning, urgent)
}
Response: { Notification object }
```

---

## Error Response Format

All errors follow this format:
```json
{
  "message": "Error description",
  "error": "Detailed error",
  "details": {}
}
```

### Common Error Codes

- `400` - Bad Request (missing fields, validation error)
- `401` - Unauthorized (no token, invalid token)
- `403` - Forbidden (not admin, not authorized)
- `404` - Not Found (resource doesn't exist)
- `500` - Server Error

---

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Notes

1. All dates should be in ISO format (YYYY-MM-DD)
2. All monetary values are in LPA (Lakhs Per Annum)
3. CGPA should be between 0-10
4. Use admin email containing "admin" for admin endpoints
5. JWT tokens expire in 24 hours
