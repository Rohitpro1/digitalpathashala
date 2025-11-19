import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Award, LogOut, Globe, FileText, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function StudentDashboard({ user, onLogout }) {
  const [lessons, setLessons] = useState([]);
  const [modules, setModules] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [progress, setProgress] = useState([]);
  const [language, setLanguage] = useState(user.language_preference || 'punjabi');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [lessonsRes, modulesRes, assignmentsRes, progressRes] = await Promise.all([
        axios.get(`${API}/lessons`),
        axios.get(`${API}/digital-literacy`),
        axios.get(`${API}/assignments`),
        axios.get(`${API}/progress`)
      ]);

      setLessons(lessonsRes.data);
      setModules(modulesRes.data);
      setAssignments(assignmentsRes.data);
      setProgress(progressRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getLanguageText = (textObj) => {
    if (typeof textObj === 'string') return textObj;
    return textObj?.[language] || textObj?.['english'] || '';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      computer_basics: '💻',
      internet_safety: '🔒',
      typing: '⌨️',
      coding: '📝',
      creative: '🎨'
    };
    return icons[category] || '📚';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-emerald-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Digital Pathshala</h1>
                <p className="text-sm text-gray-600">Welcome, {user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <div className="language-toggle">
                {['punjabi', 'hindi', 'english'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={language === lang ? 'active' : ''}
                    data-testid={`language-${lang}-btn`}
                  >
                    {languageNames[lang]}
                  </button>
                ))}
              </div>

              <Button variant="outline" size="sm" onClick={onLogout} data-testid="logout-btn">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="lessons" className="space-y-6">
          <TabsList className="bg-white border shadow-sm">
            <TabsTrigger value="lessons" data-testid="tab-lessons">
              <BookOpen className="w-4 h-4 mr-2" />
              Lessons
            </TabsTrigger>
            <TabsTrigger value="digital-literacy" data-testid="tab-digital-literacy">
              <Award className="w-4 h-4 mr-2" />
              Digital Literacy
            </TabsTrigger>
            <TabsTrigger value="assignments" data-testid="tab-assignments">
              <FileText className="w-4 h-4 mr-2" />
              Assignments
            </TabsTrigger>
          </TabsList>

          {/* Lessons Tab */}
          <TabsContent value="lessons" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson) => {
                const lessonProgress = progress.find(p => p.lesson_id === lesson.id);
                const completionPercentage = lessonProgress?.completion_percentage || 0;

                return (
                  <Card key={lesson.id} className="card-hover border-2 border-gray-100 bg-white" data-testid={`lesson-card-${lesson.id}`}>
                    <CardHeader>
                      {lesson.thumbnail && (
                        <img
                          src={lesson.thumbnail}
                          alt={getLanguageText(lesson.title)}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                      )}
                      <CardTitle className="text-lg">{getLanguageText(lesson.title)}</CardTitle>
                      <CardDescription>{getLanguageText(lesson.description)}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{lesson.subject}</span>
                        <span className="text-gray-600">{lesson.grade}</span>
                      </div>
                      <Progress value={completionPercentage} className="h-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{Math.round(completionPercentage)}% complete</span>
                        <Link to={`/lesson/${lesson.id}`}>
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" data-testid={`lesson-view-btn-${lesson.id}`}>
                            {completionPercentage > 0 ? 'Continue' : 'Start'}
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Digital Literacy Tab */}
          <TabsContent value="digital-literacy" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => {
                const moduleProgress = progress.find(p => p.module_id === module.id);
                const completionPercentage = moduleProgress?.completion_percentage || 0;

                return (
                  <Card key={module.id} className="card-hover border-2 border-gray-100 bg-white" data-testid={`module-card-${module.id}`}>
                    <CardHeader>
                      <div className="text-4xl mb-2">{getCategoryIcon(module.category)}</div>
                      <CardTitle className="text-lg">{getLanguageText(module.title)}</CardTitle>
                      <CardDescription>{getLanguageText(module.description)}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{module.level}</span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full capitalize">{module.category.replace('_', ' ')}</span>
                      </div>
                      <Progress value={completionPercentage} className="h-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{Math.round(completionPercentage)}% complete</span>
                        <Link to={`/module/${module.id}`}>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700" data-testid={`module-view-btn-${module.id}`}>
                            {completionPercentage > 0 ? 'Continue' : 'Start'}
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-4">
            <div className="space-y-4">
              {assignments.length === 0 ? (
                <Card className="bg-white">
                  <CardContent className="py-12 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No assignments yet</p>
                  </CardContent>
                </Card>
              ) : (
                assignments.map((assignment) => (
                  <Card key={assignment.id} className="bg-white border-2 border-gray-100" data-testid={`assignment-card-${assignment.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{assignment.title}</CardTitle>
                          <CardDescription className="mt-2">{assignment.description}</CardDescription>
                        </div>
                        <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          <p>Due: {new Date(assignment.due_date).toLocaleDateString()}</p>
                          <p>Marks: {assignment.total_marks}</p>
                        </div>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" data-testid={`assignment-submit-btn-${assignment.id}`}>
                          Submit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
