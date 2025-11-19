from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'rural-education-secret-key-2025')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24 * 7  # 1 week

security = HTTPBearer()

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ============= Models =============

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    role: str  # 'student', 'teacher', 'admin'
    school: Optional[str] = None
    class_name: Optional[str] = None
    language_preference: str = 'punjabi'
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str
    school: Optional[str] = None
    class_name: Optional[str] = None
    language_preference: str = 'punjabi'

class UserLogin(BaseModel):
    email: str
    password: str

class Lesson(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: Dict[str, str]  # {"punjabi": "", "hindi": "", "english": ""}
    description: Dict[str, str]
    content: Dict[str, str]
    subject: str
    grade: str
    language: str
    media_type: str = 'text'  # text, video, interactive
    thumbnail: Optional[str] = None
    created_by: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LessonCreate(BaseModel):
    title: Dict[str, str]
    description: Dict[str, str]
    content: Dict[str, str]
    subject: str
    grade: str
    language: str
    media_type: str = 'text'
    thumbnail: Optional[str] = None

class DigitalLiteracyModule(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: Dict[str, str]
    description: Dict[str, str]
    category: str  # 'computer_basics', 'internet_safety', 'typing', 'coding', 'creative'
    level: str  # 'beginner', 'intermediate', 'advanced'
    content: Dict[str, Any]
    exercises: List[Dict[str, Any]] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Assignment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    lesson_id: Optional[str] = None
    teacher_id: str
    class_name: str
    due_date: datetime
    total_marks: int = 100
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AssignmentCreate(BaseModel):
    title: str
    description: str
    lesson_id: Optional[str] = None
    class_name: str
    due_date: str
    total_marks: int = 100

class Submission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    assignment_id: str
    student_id: str
    content: str
    marks: Optional[int] = None
    feedback: Optional[str] = None
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SubmissionCreate(BaseModel):
    assignment_id: str
    content: str

class Attendance(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_id: str
    class_name: str
    date: str
    status: str  # 'present', 'absent'
    marked_by: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AttendanceCreate(BaseModel):
    students: List[Dict[str, str]]  # [{"student_id": "", "status": ""}]
    class_name: str
    date: str

class Progress(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_id: str
    lesson_id: Optional[str] = None
    module_id: Optional[str] = None
    completion_percentage: float = 0.0
    time_spent: int = 0  # in seconds
    last_accessed: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProgressUpdate(BaseModel):
    lesson_id: Optional[str] = None
    module_id: Optional[str] = None
    completion_percentage: float
    time_spent: int

# ============= Helper Functions =============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, email: str, role: str) -> str:
    expiration = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    payload = {
        'user_id': user_id,
        'email': email,
        'role': role,
        'exp': expiration
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(token: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)
    user = await db.users.find_one({"id": payload['user_id']}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

async def get_current_teacher(user: dict = Depends(get_current_user)):
    if user['role'] not in ['teacher', 'admin']:
        raise HTTPException(status_code=403, detail="Not authorized. Teachers only.")
    return user

async def get_current_admin(user: dict = Depends(get_current_user)):
    if user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Not authorized. Admins only.")
    return user

# ============= Auth Routes =============

@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_pw = hash_password(user_data.password)
    
    # Create user
    user_dict = user_data.model_dump(exclude={'password'})
    user = User(**user_dict)
    doc = user.model_dump()
    doc['password'] = hashed_pw
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.users.insert_one(doc)
    
    # Create token
    token = create_token(user.id, user.email, user.role)
    
    return {
        "token": token,
        "user": user.model_dump()
    }

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user['id'], user['email'], user['role'])
    user.pop('password', None)
    
    return {
        "token": token,
        "user": user
    }

@api_router.get("/auth/me")
async def get_me(user: dict = Depends(get_current_user)):
    user.pop('password', None)
    return user

# ============= Lesson Routes =============

@api_router.get("/lessons")
async def get_lessons(language: Optional[str] = None, subject: Optional[str] = None, grade: Optional[str] = None):
    query = {}
    if language:
        query['language'] = language
    if subject:
        query['subject'] = subject
    if grade:
        query['grade'] = grade
    
    lessons = await db.lessons.find(query, {"_id": 0}).to_list(1000)
    return lessons

@api_router.get("/lessons/{lesson_id}")
async def get_lesson(lesson_id: str):
    lesson = await db.lessons.find_one({"id": lesson_id}, {"_id": 0})
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson

@api_router.post("/lessons")
async def create_lesson(lesson_data: LessonCreate, user: dict = Depends(get_current_teacher)):
    lesson_dict = lesson_data.model_dump()
    lesson = Lesson(**lesson_dict, created_by=user['id'])
    doc = lesson.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.lessons.insert_one(doc)
    return lesson

# ============= Digital Literacy Routes =============

@api_router.get("/digital-literacy")
async def get_digital_literacy_modules(category: Optional[str] = None, level: Optional[str] = None):
    query = {}
    if category:
        query['category'] = category
    if level:
        query['level'] = level
    
    modules = await db.digital_literacy_modules.find(query, {"_id": 0}).to_list(1000)
    return modules

@api_router.get("/digital-literacy/{module_id}")
async def get_digital_literacy_module(module_id: str):
    module = await db.digital_literacy_modules.find_one({"id": module_id}, {"_id": 0})
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    return module

# ============= Assignment Routes =============

@api_router.get("/assignments")
async def get_assignments(user: dict = Depends(get_current_user)):
    query = {}
    if user['role'] == 'student':
        query['class_name'] = user.get('class_name')
    elif user['role'] == 'teacher':
        query['teacher_id'] = user['id']
    
    assignments = await db.assignments.find(query, {"_id": 0}).to_list(1000)
    return assignments

@api_router.post("/assignments")
async def create_assignment(assignment_data: AssignmentCreate, user: dict = Depends(get_current_teacher)):
    assignment_dict = assignment_data.model_dump()
    assignment_dict['due_date'] = datetime.fromisoformat(assignment_data.due_date)
    assignment = Assignment(**assignment_dict, teacher_id=user['id'])
    doc = assignment.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['due_date'] = doc['due_date'].isoformat()
    
    await db.assignments.insert_one(doc)
    return assignment

# ============= Submission Routes =============

@api_router.get("/submissions")
async def get_submissions(assignment_id: Optional[str] = None, user: dict = Depends(get_current_user)):
    query = {}
    if user['role'] == 'student':
        query['student_id'] = user['id']
    if assignment_id:
        query['assignment_id'] = assignment_id
    
    submissions = await db.submissions.find(query, {"_id": 0}).to_list(1000)
    return submissions

@api_router.post("/submissions")
async def create_submission(submission_data: SubmissionCreate, user: dict = Depends(get_current_user)):
    if user['role'] != 'student':
        raise HTTPException(status_code=403, detail="Only students can submit assignments")
    
    submission = Submission(**submission_data.model_dump(), student_id=user['id'])
    doc = submission.model_dump()
    doc['submitted_at'] = doc['submitted_at'].isoformat()
    
    await db.submissions.insert_one(doc)
    return submission

@api_router.put("/submissions/{submission_id}/grade")
async def grade_submission(submission_id: str, marks: int, feedback: Optional[str] = None, user: dict = Depends(get_current_teacher)):
    result = await db.submissions.update_one(
        {"id": submission_id},
        {"$set": {"marks": marks, "feedback": feedback}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Submission not found")
    return {"message": "Graded successfully"}

# ============= Attendance Routes =============

@api_router.post("/attendance")
async def mark_attendance(attendance_data: AttendanceCreate, user: dict = Depends(get_current_teacher)):
    records = []
    for student_data in attendance_data.students:
        attendance = Attendance(
            student_id=student_data['student_id'],
            class_name=attendance_data.class_name,
            date=attendance_data.date,
            status=student_data['status'],
            marked_by=user['id']
        )
        doc = attendance.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        records.append(doc)
    
    if records:
        await db.attendance.insert_many(records)
    return {"message": f"{len(records)} attendance records marked"}

@api_router.get("/attendance")
async def get_attendance(class_name: Optional[str] = None, date: Optional[str] = None, user: dict = Depends(get_current_user)):
    query = {}
    if user['role'] == 'student':
        query['student_id'] = user['id']
    if class_name:
        query['class_name'] = class_name
    if date:
        query['date'] = date
    
    attendance = await db.attendance.find(query, {"_id": 0}).to_list(1000)
    return attendance

# ============= Progress Routes =============

@api_router.post("/progress")
async def update_progress(progress_data: ProgressUpdate, user: dict = Depends(get_current_user)):
    if user['role'] != 'student':
        raise HTTPException(status_code=403, detail="Only students can update progress")
    
    query = {"student_id": user['id']}
    if progress_data.lesson_id:
        query['lesson_id'] = progress_data.lesson_id
    if progress_data.module_id:
        query['module_id'] = progress_data.module_id
    
    existing = await db.progress.find_one(query)
    
    if existing:
        await db.progress.update_one(
            query,
            {"$set": {
                "completion_percentage": progress_data.completion_percentage,
                "time_spent": progress_data.time_spent,
                "last_accessed": datetime.now(timezone.utc).isoformat()
            }}
        )
    else:
        progress = Progress(
            student_id=user['id'],
            lesson_id=progress_data.lesson_id,
            module_id=progress_data.module_id,
            completion_percentage=progress_data.completion_percentage,
            time_spent=progress_data.time_spent
        )
        doc = progress.model_dump()
        doc['last_accessed'] = doc['last_accessed'].isoformat()
        await db.progress.insert_one(doc)
    
    return {"message": "Progress updated"}

@api_router.get("/progress")
async def get_progress(student_id: Optional[str] = None, user: dict = Depends(get_current_user)):
    query = {}
    if user['role'] == 'student':
        query['student_id'] = user['id']
    elif student_id:
        query['student_id'] = student_id
    
    progress = await db.progress.find(query, {"_id": 0}).to_list(1000)
    return progress

# ============= Analytics Routes =============

@api_router.get("/analytics/class/{class_name}")
async def get_class_analytics(class_name: str, user: dict = Depends(get_current_teacher)):
    # Get students in class
    students = await db.users.find({"class_name": class_name, "role": "student"}, {"_id": 0}).to_list(1000)
    student_ids = [s['id'] for s in students]
    
    # Get attendance stats
    attendance_records = await db.attendance.find({"student_id": {"$in": student_ids}}, {"_id": 0}).to_list(10000)
    
    # Get submission stats
    submissions = await db.submissions.find({"student_id": {"$in": student_ids}}, {"_id": 0}).to_list(10000)
    
    # Get progress stats
    progress_records = await db.progress.find({"student_id": {"$in": student_ids}}, {"_id": 0}).to_list(10000)
    
    return {
        "total_students": len(students),
        "attendance_records": len(attendance_records),
        "total_submissions": len(submissions),
        "avg_progress": sum([p.get('completion_percentage', 0) for p in progress_records]) / len(progress_records) if progress_records else 0,
        "students": students
    }

# ============= Students List Route =============

@api_router.get("/students")
async def get_students(class_name: Optional[str] = None, user: dict = Depends(get_current_teacher)):
    query = {"role": "student"}
    if class_name:
        query['class_name'] = class_name
    
    students = await db.users.find(query, {"_id": 0, "password": 0}).to_list(1000)
    return students

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
