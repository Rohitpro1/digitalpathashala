import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Award, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function ModuleViewer({ user, onLogout }) {
  const { id } = useParams();
  const [module, setModule] = useState(null);
  const [language, setLanguage] = useState(user.language_preference || 'punjabi');
  const [progress, setProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModule();
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

  const fetchModule = async () => {
    try {
      const response = await axios.get(`${API}/digital-literacy/${id}`);
      setModule(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load module');
      setLoading(false);
    }
  };

  const updateProgress = async () => {
    try {
      const newProgress = Math.min(progress + 10, 100);
      setProgress(newProgress);

      await axios.post(`${API}/progress`, {
        module_id: id,
        completion_percentage: newProgress,
        time_spent: timeSpent
      });
    } catch (error) {
      console.error('Failed to update progress');
    }
  };

  const handleExerciseComplete = (exerciseId) => {
    if (!completedExercises.includes(exerciseId)) {
      setCompletedExercises([...completedExercises, exerciseId]);
      toast.success('Exercise completed!');
      const newProgress = Math.min(progress + 20, 100);
      setProgress(newProgress);
    }
  };

  const handleComplete = async () => {
    try {
      await axios.post(`${API}/progress`, {
        module_id: id,
        completion_percentage: 100,
        time_spent: timeSpent
      });
      toast.success('Module completed!');
      setProgress(100);
    } catch (error) {
      toast.error('Failed to mark module as complete');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Module not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to={`/${user.role}`}>
              <Button variant="outline" size="sm" data-testid="module-back-btn">
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
                  data-testid={`module-language-${lang}-btn`}
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
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl">{getCategoryIcon(module.category)}</div>
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2" data-testid="module-title">{getLanguageText(module.title)}</CardTitle>
                  <p className="text-gray-600" data-testid="module-description">{getLanguageText(module.description)}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">{module.level}</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full capitalize">{module.category.replace('_', ' ')}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-600" data-testid="module-progress">{progress}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              <Tabs defaultValue="content" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="content" className="flex-1" data-testid="module-tab-content">Content</TabsTrigger>
                  <TabsTrigger value="exercises" className="flex-1" data-testid="module-tab-exercises">Exercises</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-600" />
                      Topics Covered
                    </h3>
                    <ul className="space-y-3">
                      {module.content?.topics?.map((topic, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="exercises" className="space-y-4">
                  {module.exercises && module.exercises.length > 0 ? (
                    module.exercises.map((exercise, index) => (
                      <Card key={exercise.id || index} className="bg-gray-50" data-testid={`exercise-${index}`}>
                        <CardHeader>
                          <CardTitle className="text-lg">Exercise {index + 1}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {exercise.type === 'quiz' && (
                            <>
                              <p className="font-medium" data-testid={`exercise-question-${index}`}>{exercise.question}</p>
                              <div className="space-y-2">
                                {exercise.options?.map((option, optIndex) => (
                                  <Button
                                    key={optIndex}
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => {
                                      if (option === exercise.answer) {
                                        handleExerciseComplete(exercise.id);
                                      } else {
                                        toast.error('Try again!');
                                      }
                                    }}
                                    data-testid={`exercise-option-${index}-${optIndex}`}
                                  >
                                    {option}
                                  </Button>
                                ))}
                              </div>
                            </>
                          )}
                          {exercise.type === 'typing' && (
                            <div>
                              <p className="font-medium mb-2">Type this text:</p>
                              <p className="bg-white p-4 rounded border font-mono" data-testid={`exercise-text-${index}`}>{exercise.text}</p>
                              <Button
                                onClick={() => handleExerciseComplete(exercise.id)}
                                className="mt-4 bg-purple-600 hover:bg-purple-700"
                                data-testid={`exercise-complete-btn-${index}`}
                              >
                                Complete
                              </Button>
                            </div>
                          )}
                          {completedExercises.includes(exercise.id) && (
                            <div className="flex items-center gap-2 text-emerald-600">
                              <CheckCircle2 className="w-5 h-5" />
                              <span className="font-medium">Completed!</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">No exercises available</p>
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex items-center justify-between pt-6 border-t">
                <div className="text-sm text-gray-600">
                  Time spent: {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
                </div>
                <Button
                  onClick={handleComplete}
                  disabled={progress === 100}
                  className="bg-purple-600 hover:bg-purple-700"
                  data-testid="module-complete-btn"
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
