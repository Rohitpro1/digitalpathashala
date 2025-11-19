import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function LessonViewer({ user, onLogout }) {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [language, setLanguage] = useState(user.language_preference || 'punjabi');
  const [progress, setProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLesson();
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [id]);

  useEffect(() => {
    if (timeSpent > 0 && timeSpent % 10 === 0) {
      updateProgress();
    }
  }, [timeSpent]);

  const fetchLesson = async () => {
    try {
      const response = await axios.get(`${API}/lessons/${id}`);
      setLesson(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load lesson');
      setLoading(false);
    }
  };

  const updateProgress = async () => {
    try {
      const newProgress = Math.min(progress + 10, 100);
      setProgress(newProgress);

      await axios.post(`${API}/progress`, {
        lesson_id: id,
        completion_percentage: newProgress,
        time_spent: timeSpent
      });
    } catch (error) {
      console.error('Failed to update progress');
    }
  };

  const handleComplete = async () => {
    try {
      await axios.post(`${API}/progress`, {
        lesson_id: id,
        completion_percentage: 100,
        time_spent: timeSpent
      });
      toast.success('Lesson completed!');
      setProgress(100);
    } catch (error) {
      toast.error('Failed to mark lesson as complete');
    }
  };

  const getLanguageText = (textObj) => {
    if (typeof textObj === 'string') return textObj;
    return textObj?.[language] || textObj?.['english'] || '';
  };

  const languageNames = {
    punjabi: 'ਪੰਜਾਬੀ',
    hindi: 'हिन्दी',
    english: 'English'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Lesson not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to={`/${user.role}`}>
              <Button variant="outline" size="sm" data-testid="lesson-back-btn">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>

            <div className="language-toggle">
              {['punjabi', 'hindi', 'english'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={language === lang ? 'active' : ''}
                  data-testid={`lesson-language-${lang}-btn`}
                >
                  {languageNames[lang]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              {lesson.thumbnail && (
                <img
                  src={lesson.thumbnail}
                  alt={getLanguageText(lesson.title)}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-emerald-600" />
                <CardTitle className="text-2xl" data-testid="lesson-title">{getLanguageText(lesson.title)}</CardTitle>
              </div>
              <p className="text-gray-600" data-testid="lesson-description">{getLanguageText(lesson.description)}</p>
              <div className="flex gap-3 mt-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">{lesson.subject}</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">{lesson.grade}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-600" data-testid="lesson-progress">{progress}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              <div className="prose max-w-none">
                <div className="text-gray-800 leading-relaxed" data-testid="lesson-content">
                  {getLanguageText(lesson.content)}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t">
                <div className="text-sm text-gray-600">
                  Time spent: {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
                </div>
                <Button
                  onClick={handleComplete}
                  disabled={progress === 100}
                  className="bg-emerald-600 hover:bg-emerald-700"
                  data-testid="lesson-complete-btn"
                >
                  {progress === 100 ? 'Completed' : 'Mark as Complete'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
