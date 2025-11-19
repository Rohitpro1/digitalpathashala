# Digital Pathshala - Rural Education Digital Learning Ecosystem

## Problem Statement

Government schools in Nabha and nearby rural areas face critical challenges:

- **Outdated Infrastructure**: Limited computer labs with old equipment
- **Poor Connectivity**: Unreliable internet access making online learning difficult
- **Low Digital Literacy**: Students and teachers lack basic digital skills
- **Language Barriers**: Educational content not available in local languages
- **Urban-Rural Gap**: Widening education disparity between urban and rural students

## Solution Overview

Digital Pathshala is an **offline-first digital learning platform** specifically designed for rural government schools. It bridges the digital divide by providing:

### Core Features

1. **Offline-First Architecture**
   - Full functionality without internet connection
   - Progressive Web App (PWA) with service workers
   - Background data synchronization when online
   - Local storage using IndexedDB

2. **Multilingual Content**
   - Lessons available in Punjabi (ਪੰਜਾਬੀ), Hindi (हिन्दी), and English
   - Live language switching without page reload
   - Content localization for better comprehension

3. **Digital Literacy Modules**
   - **Computer Basics**: Keyboard, mouse, file management
   - **Internet Safety**: Privacy, cyberbullying awareness, safe browsing
   - **Typing Practice**: Touch typing with exercises
   - **Coding Basics**: Introduction to programming concepts
   - **Creative Tools**: Digital drawing and design basics

4. **Student Portal**
   - Interactive lessons with progress tracking
   - Digital literacy module access
   - Assignment submission
   - Multi-language support
   - Time-spent tracking

5. **Teacher Dashboard**
   - Student management and monitoring
   - Attendance tracking system
   - Assignment creation and management
   - Class analytics and progress reports
   - Simple, intuitive interface

6. **Admin Panel**
   - Content management system
   - User management
   - System-wide analytics
   - Full teacher dashboard access

### Technical Architecture

**Backend (FastAPI + MongoDB)**
- JWT-based authentication
- Role-based access control (student, teacher, admin)
- RESTful API endpoints
- MongoDB for flexible data storage
- Async operations for performance

**Frontend (React + PWA)**
- Modern, responsive UI
- Offline-first design
- Service worker for caching
- Work Sans font for headings, Inter for body text
- Emerald green color scheme (education-friendly)
- Optimized for low-end devices

**Database Collections**
- users (with role management)
- lessons (multilingual content)
- digital_literacy_modules
- assignments
- submissions
- attendance
- progress_tracking

## Key Stakeholders

1. **Rural Students**: Primary beneficiaries gaining digital skills and quality education
2. **Teachers**: Equipped with tools to track progress and manage classes efficiently
3. **School Administrators**: Oversight and system management capabilities
4. **Parents**: Indirect beneficiaries seeing improved student outcomes
5. **Punjab Education Department**: Supporting rural education digitization

## Expected Outcomes

### For Students
✓ Access quality education regardless of connectivity
✓ Develop essential digital skills for future careers
✓ Learn in their preferred language (Punjabi/Hindi/English)
✓ Bridge the urban-rural education gap
✓ Interactive learning with progress tracking

### For Teachers
✓ Simple tools to track student progress
✓ Efficient attendance and assignment management
✓ Detailed analytics on class performance
✓ Easy content delivery in multiple languages
✓ Reduced administrative burden

### For Schools
✓ Modern education platform at low infrastructure cost
✓ Works on existing low-end devices
✓ No constant internet requirement
✓ Comprehensive student data management
✓ Scalable solution for multiple schools

## Demo Credentials

### Admin Access
- Email: `admin@school.com`
- Password: `admin123`
- Access: Full system management + teacher capabilities

### Teacher Access
- Email: `teacher@school.com`
- Password: `teacher123`
- Access: Class management, attendance, assignments, analytics

### Student Access
- Email: `student1@school.com` (Punjabi preference)
- Password: `student123`
- Access: Lessons, digital literacy modules, assignments

- Email: `student2@school.com` (Hindi preference)
- Password: `student123`
- Access: Lessons, digital literacy modules, assignments

## Sample Content Included

### Lessons (Multilingual)
1. **Science**: Water Cycle (ਪਾਣੀ ਦਾ ਚੱਕਰ / जल चक्र / Water Cycle)
2. **Mathematics**: Fractions and Decimals (ਭਿੰਨ ਅਤੇ ਦਸ਼ਮਲਵ / भिन्न और दशमलव)
3. **History**: India's Independence (ਭਾਰਤ ਦੀ ਆਜ਼ਾਦੀ / भारत की स्वतंत्रता)

### Digital Literacy Modules
1. **Computer Basics** (💻): Keyboard, mouse, file management
2. **Internet Safety** (🔒): Privacy, cyberbullying, safe browsing
3. **Typing Practice** (⌨️): Home row keys, touch typing
4. **Introduction to Coding** (📝): Sequences, loops, conditions
5. **Creative Tools** (🎨): Digital art basics

## Technology Stack

- **Frontend**: React 19, React Router, Axios, Shadcn/UI, Tailwind CSS
- **Backend**: FastAPI, Python 3.11
- **Database**: MongoDB with Motor (async driver)
- **Authentication**: JWT with bcrypt password hashing
- **PWA**: Service Workers, IndexedDB, Background Sync
- **Deployment**: Optimized for Kubernetes with hot reload

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Lessons
- `GET /api/lessons` - Get all lessons (with filters)
- `GET /api/lessons/{id}` - Get specific lesson
- `POST /api/lessons` - Create new lesson (teacher/admin)

### Digital Literacy
- `GET /api/digital-literacy` - Get all modules
- `GET /api/digital-literacy/{id}` - Get specific module

### Assignments
- `GET /api/assignments` - Get assignments
- `POST /api/assignments` - Create assignment (teacher)
- `POST /api/submissions` - Submit assignment (student)
- `PUT /api/submissions/{id}/grade` - Grade submission (teacher)

### Attendance
- `POST /api/attendance` - Mark attendance (teacher)
- `GET /api/attendance` - Get attendance records

### Progress
- `POST /api/progress` - Update learning progress
- `GET /api/progress` - Get progress data

### Analytics
- `GET /api/analytics/class/{class_name}` - Get class analytics
- `GET /api/students` - Get students list (teacher/admin)

## Design Philosophy

### Colors
- **Primary**: Emerald Green (#10b981) - Represents growth and learning
- **Accent**: Teal, Cyan - Calming, educational colors
- **Background**: Light gradients (emerald-50, teal-50, cyan-50)
- **Teacher Dashboard**: Blue/Indigo tones
- **Digital Literacy**: Purple/Pink tones

### Typography
- **Headings**: Work Sans (professional, clean)
- **Body**: Inter (highly readable)
- **Local Fonts**: Properly rendered Punjabi and Hindi characters

### Accessibility
- High contrast for visibility
- Large touch targets for low-end devices
- Minimal animations for performance
- Works on screens as small as 320px

## Offline Functionality

### Service Worker Features
- Caches static assets (CSS, JS, images)
- Network-first strategy for API calls
- Cache-first strategy for static content
- Background sync for data updates
- Offline indicator in UI

### Local Storage Strategy
- User authentication token
- User preferences (language, theme)
- Progress data (synced when online)
- Lesson content (downloaded for offline access)

## Performance Optimizations

1. **Lazy Loading**: Components loaded on demand
2. **Image Optimization**: Compressed thumbnails, lazy loading
3. **Code Splitting**: Separate bundles for student/teacher/admin
4. **Caching**: Aggressive caching with service workers
5. **Minimal Dependencies**: Only essential libraries included
6. **Async Operations**: Non-blocking database queries
7. **Pagination**: Large lists paginated for performance

## Future Enhancements

1. **Video Lessons**: Support for offline video content
2. **Interactive Quizzes**: More engaging assessment tools
3. **Peer Learning**: Student collaboration features
4. **Parent Portal**: Progress tracking for parents
5. **Mobile Apps**: Native Android app for better offline support
6. **Voice Lessons**: Audio content in local languages
7. **Gamification**: Badges, points, leaderboards
8. **AI Tutoring**: Personalized learning recommendations

## Installation & Setup

### Prerequisites
- Python 3.11+
- Node.js 16+
- MongoDB
- Yarn package manager

### Backend Setup
```bash
cd /app/backend
pip install -r requirements.txt
python seed_data.py  # Load sample data
```

### Frontend Setup
```bash
cd /app/frontend
yarn install
```

### Environment Variables
Backend (.env):
- MONGO_URL: MongoDB connection string
- DB_NAME: Database name
- JWT_SECRET: Secret key for JWT tokens
- CORS_ORIGINS: Allowed CORS origins

Frontend (.env):
- REACT_APP_BACKEND_URL: Backend API URL

### Running the Application
Backend runs on port 8001, frontend on port 3000. Both have hot reload enabled.

## Project Structure

```
/app
├── backend/
│   ├── server.py          # FastAPI application
│   ├── seed_data.py       # Database seeding script
│   ├── requirements.txt   # Python dependencies
│   └── .env              # Backend environment variables
├── frontend/
│   ├── src/
│   │   ├── App.js        # Main React component
│   │   ├── App.css       # Global styles
│   │   ├── pages/        # Page components
│   │   │   ├── LandingPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── StudentDashboard.js
│   │   │   ├── TeacherDashboard.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── LessonViewer.js
│   │   │   └── ModuleViewer.js
│   │   └── components/
│   │       └── ui/        # Shadcn UI components
│   ├── public/
│   │   ├── service-worker.js
│   │   └── manifest.json
│   └── .env              # Frontend environment variables
└── PROJECT_OVERVIEW.md   # This file
```

## Support & Contribution

This project is built to support the Punjab Education Department's initiative to digitize rural education. 

**Contact**: For questions, support, or contributions, please reach out to the development team.

---

**Built with ❤️ for Rural Education in Punjab**

*Digital Pathshala - Empowering every student, regardless of location or connectivity*
