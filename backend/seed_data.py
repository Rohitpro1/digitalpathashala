import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
import uuid
from datetime import datetime, timezone
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

async def seed_database():
    print("Starting database seeding...")
    
    # Clear existing data
    await db.users.delete_many({})
    await db.lessons.delete_many({})
    await db.digital_literacy_modules.delete_many({})
    
    # Create sample users
    users = [
        {
            "id": str(uuid.uuid4()),
            "name": "Admin User",
            "email": "admin@school.com",
            "password": hash_password("admin123"),
            "role": "admin",
            "school": "Government School Nabha",
            "language_preference": "punjabi",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Gurpreet Kaur",
            "email": "teacher@school.com",
            "password": hash_password("teacher123"),
            "role": "teacher",
            "school": "Government School Nabha",
            "class_name": "Class 8A",
            "language_preference": "punjabi",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Simran Singh",
            "email": "student1@school.com",
            "password": hash_password("student123"),
            "role": "student",
            "school": "Government School Nabha",
            "class_name": "Class 8A",
            "language_preference": "punjabi",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Rajesh Kumar",
            "email": "student2@school.com",
            "password": hash_password("student123"),
            "role": "student",
            "school": "Government School Nabha",
            "class_name": "Class 8A",
            "language_preference": "hindi",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.users.insert_many(users)
    print(f"✓ Created {len(users)} users")
    
    # Create sample lessons
    lessons = [
        {
            "id": str(uuid.uuid4()),
            "title": {
                "punjabi": "ਵਿਗਿਆਨ: ਪਾਣੀ ਦਾ ਚੱਕਰ",
                "hindi": "विज्ञान: जल चक्र",
                "english": "Science: The Water Cycle"
            },
            "description": {
                "punjabi": "ਇਸ ਪਾਠ ਵਿੱਚ ਅਸੀਂ ਪਾਣੀ ਦੇ ਚੱਕਰ ਬਾਰੇ ਸਿੱਖਾਂਗੇ",
                "hindi": "इस पाठ में हम जल चक्र के बारे में सीखेंगे",
                "english": "In this lesson, we will learn about the water cycle"
            },
            "content": {
                "punjabi": "ਪਾਣੀ ਦਾ ਚੱਕਰ ਇੱਕ ਕੁਦਰਤੀ ਪ੍ਰਕਿਰਿਆ ਹੈ ਜਿਸ ਵਿੱਚ ਪਾਣੀ ਧਰਤੀ ਤੋਂ ਵਾਸ਼ਪੀਕਰਨ ਰਾਹੀਂ ਵਾਤਾਵਰਣ ਵਿੱਚ ਜਾਂਦਾ ਹੈ ਅਤੇ ਬਾਰਸ਼ ਰਾਹੀਂ ਵਾਪਸ ਆਉਂਦਾ ਹੈ।",
                "hindi": "जल चक्र एक प्राकृतिक प्रक्रिया है जिसमें पानी वाष्पीकरण द्वारा पृथ्वी से वायुमंडल में जाता है और वर्षा द्वारा वापस आता है।",
                "english": "The water cycle is a natural process where water moves from the Earth to the atmosphere through evaporation and returns through precipitation."
            },
            "subject": "Science",
            "grade": "Class 8",
            "language": "multilingual",
            "media_type": "text",
            "thumbnail": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
            "created_by": users[1]['id'],
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": {
                "punjabi": "ਗਣਿਤ: ਭਿੰਨ ਅਤੇ ਦਸ਼ਮਲਵ",
                "hindi": "गणित: भिन्न और दशमलव",
                "english": "Mathematics: Fractions and Decimals"
            },
            "description": {
                "punjabi": "ਭਿੰਨਾਂ ਅਤੇ ਦਸ਼ਮਲਵਾਂ ਨੂੰ ਸਮਝਣਾ",
                "hindi": "भिन्नों और दशमलवों को समझना",
                "english": "Understanding fractions and decimals"
            },
            "content": {
                "punjabi": "ਭਿੰਨ ਇੱਕ ਪੂਰੀ ਦਾ ਹਿੱਸਾ ਹੁੰਦੀ ਹੈ। ਉਦਾਹਰਨ: 1/2 ਦਾ ਮਤਲਬ ਹੈ ਅੱਧਾ।",
                "hindi": "भिन्न एक पूर्ण का हिस्सा होती है। उदाहरण: 1/2 का मतलब है आधा।",
                "english": "A fraction is a part of a whole. Example: 1/2 means half."
            },
            "subject": "Mathematics",
            "grade": "Class 8",
            "language": "multilingual",
            "media_type": "text",
            "thumbnail": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
            "created_by": users[1]['id'],
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": {
                "punjabi": "ਇਤਿਹਾਸ: ਭਾਰਤ ਦੀ ਆਜ਼ਾਦੀ",
                "hindi": "इतिहास: भारत की स्वतंत्रता",
                "english": "History: India's Independence"
            },
            "description": {
                "punjabi": "ਭਾਰਤ ਦੀ ਆਜ਼ਾਦੀ ਦੀ ਲੜਾਈ ਬਾਰੇ",
                "hindi": "भारत की स्वतंत्रता संग्राम के बारे में",
                "english": "About India's freedom struggle"
            },
            "content": {
                "punjabi": "15 ਅਗਸਤ 1947 ਨੂੰ ਭਾਰਤ ਬ੍ਰਿਟਿਸ਼ ਸ਼ਾਸਨ ਤੋਂ ਆਜ਼ਾਦ ਹੋਇਆ।",
                "hindi": "15 अगस्त 1947 को भारत ब्रिटिश शासन से स्वतंत्र हुआ।",
                "english": "On August 15, 1947, India gained independence from British rule."
            },
            "subject": "History",
            "grade": "Class 8",
            "language": "multilingual",
            "media_type": "text",
            "thumbnail": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400",
            "created_by": users[1]['id'],
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.lessons.insert_many(lessons)
    print(f"✓ Created {len(lessons)} lessons")
    
    # Create digital literacy modules
    modules = [
        {
            "id": str(uuid.uuid4()),
            "title": {
                "punjabi": "ਕੰਪਿਊਟਰ ਦੀਆਂ ਬੁਨਿਆਦੀ ਗੱਲਾਂ",
                "hindi": "कंप्यूटर की मूल बातें",
                "english": "Computer Basics"
            },
            "description": {
                "punjabi": "ਕੀਬੋਰਡ, ਮਾਊਸ ਅਤੇ ਫਾਈਲ ਪ੍ਰਬੰਧਨ ਸਿੱਖੋ",
                "hindi": "कीबोर्ड, माउस और फाइल प्रबंधन सीखें",
                "english": "Learn keyboard, mouse, and file management"
            },
            "category": "computer_basics",
            "level": "beginner",
            "content": {
                "topics": [
                    "Introduction to Computer Parts",
                    "Using Keyboard and Mouse",
                    "File and Folder Management",
                    "Basic Operations"
                ]
            },
            "exercises": [
                {
                    "id": str(uuid.uuid4()),
                    "type": "quiz",
                    "question": "What is the main input device?",
                    "options": ["Monitor", "Keyboard", "Printer", "Speaker"],
                    "answer": "Keyboard"
                }
            ],
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": {
                "punjabi": "ਇੰਟਰਨੈੱਟ ਸੁਰੱਖਿਆ",
                "hindi": "इंटरनेट सुरक्षा",
                "english": "Internet Safety"
            },
            "description": {
                "punjabi": "ਔਨਲਾਈਨ ਸੁਰੱਖਿਅਤ ਰਹਿਣਾ ਸਿੱਖੋ",
                "hindi": "ऑनलाइन सुरक्षित रहना सीखें",
                "english": "Learn to stay safe online"
            },
            "category": "internet_safety",
            "level": "beginner",
            "content": {
                "topics": [
                    "Privacy Protection",
                    "Safe Browsing",
                    "Cyberbullying Awareness",
                    "Password Security"
                ]
            },
            "exercises": [
                {
                    "id": str(uuid.uuid4()),
                    "type": "quiz",
                    "question": "Should you share your password with friends?",
                    "options": ["Yes", "No"],
                    "answer": "No"
                }
            ],
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": {
                "punjabi": "ਟਾਈਪਿੰਗ ਅਭਿਆਸ",
                "hindi": "टाइपिंग अभ्यास",
                "english": "Typing Practice"
            },
            "description": {
                "punjabi": "ਤੇਜ਼ ਅਤੇ ਸਹੀ ਟਾਈਪਿੰਗ ਸਿੱਖੋ",
                "hindi": "तेज और सही टाइपिंग सीखें",
                "english": "Learn fast and accurate typing"
            },
            "category": "typing",
            "level": "beginner",
            "content": {
                "topics": [
                    "Home Row Keys",
                    "Touch Typing Technique",
                    "Speed Building",
                    "Practice Exercises"
                ]
            },
            "exercises": [
                {
                    "id": str(uuid.uuid4()),
                    "type": "typing",
                    "text": "The quick brown fox jumps over the lazy dog"
                }
            ],
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": {
                "punjabi": "ਕੋਡਿੰਗ ਦੀ ਸ਼ੁਰੂਆਤ",
                "hindi": "कोडिंग की शुरुआत",
                "english": "Introduction to Coding"
            },
            "description": {
                "punjabi": "ਬੁਨਿਆਦੀ ਪ੍ਰੋਗਰਾਮਿੰਗ ਸੰਕਲਪ ਸਿੱਖੋ",
                "hindi": "बुनियादी प्रोग्रामिंग अवधारणाएँ सीखें",
                "english": "Learn basic programming concepts"
            },
            "category": "coding",
            "level": "beginner",
            "content": {
                "topics": [
                    "What is Coding?",
                    "Sequences and Patterns",
                    "Loops and Conditions",
                    "Simple Programs"
                ]
            },
            "exercises": [
                {
                    "id": str(uuid.uuid4()),
                    "type": "coding",
                    "instruction": "Create a sequence to move forward 3 steps"
                }
            ],
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": {
                "punjabi": "ਰਚਨਾਤਮਕ ਸਾਧਨ",
                "hindi": "रचनात्मक उपकरण",
                "english": "Creative Tools"
            },
            "description": {
                "punjabi": "ਡਿਜੀਟਲ ਚਿੱਤਰਕਾਰੀ ਅਤੇ ਡਿਜ਼ਾਈਨ",
                "hindi": "डिजिटल चित्रकला और डिजाइन",
                "english": "Digital drawing and design"
            },
            "category": "creative",
            "level": "beginner",
            "content": {
                "topics": [
                    "Using Paint Tools",
                    "Colors and Shapes",
                    "Creating Simple Graphics",
                    "Digital Art Basics"
                ]
            },
            "exercises": [
                {
                    "id": str(uuid.uuid4()),
                    "type": "creative",
                    "instruction": "Draw a house using basic shapes"
                }
            ],
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.digital_literacy_modules.insert_many(modules)
    print(f"✓ Created {len(modules)} digital literacy modules")
    
    print("\n=== Seeding Complete ===")
    print("\nTest Credentials:")
    print("Admin: admin@school.com / admin123")
    print("Teacher: teacher@school.com / teacher123")
    print("Student: student1@school.com / student123")
    print("Student: student2@school.com / student123")

if __name__ == "__main__":
    asyncio.run(seed_database())
