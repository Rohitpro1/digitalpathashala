import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookOpen, Users, FileText, Calendar, LogOut, BarChart3, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function TeacherDashboard({ user, onLogout }) {
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, assignmentsRes, submissionsRes] = await Promise.all([
        axios.get(`${API}/students`, { params: { class_name: user.class_name } }),
        axios.get(`${API}/assignments`),
        axios.get(`${API}/submissions`)
      ]);

      setStudents(studentsRes.data);
      setAssignments(assignmentsRes.data);
      setSubmissions(submissionsRes.data);

      if (user.class_name) {
        const analyticsRes = await axios.get(`${API}/analytics/class/${user.class_name}`);
        setAnalytics(analyticsRes.data);
      }

      // Initialize attendance data
      setAttendanceData(studentsRes.data.map(s => ({ student_id: s.id, status: 'present' })));
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      await axios.post(`${API}/assignments`, {
        title: formData.get('title'),
        description: formData.get('description'),
        class_name: user.class_name,
        due_date: formData.get('due_date'),
        total_marks: parseInt(formData.get('total_marks'))
      });
      toast.success('Assignment created successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to create assignment');
    }
  };

  const handleMarkAttendance = async () => {
    try {
      await axios.post(`${API}/attendance`, {
        students: attendanceData,
        class_name: user.class_name,
        date: attendanceDate
      });
      toast.success('Attendance marked successfully');
    } catch (error) {
      toast.error('Failed to mark attendance');
    }
  };

  const toggleAttendance = (studentId) => {
    setAttendanceData(prev => prev.map(item => 
      item.student_id === studentId 
        ? { ...item, status: item.status === 'present' ? 'absent' : 'present' }
        : item
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Teacher Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome, {user.name}</p>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={onLogout} data-testid="teacher-logout-btn">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-2 border-blue-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-blue-600" data-testid="total-students-count">{students.length}</p>
                <Users className="w-8 h-8 text-blue-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-purple-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-purple-600" data-testid="total-assignments-count">{assignments.length}</p>
                <FileText className="w-8 h-8 text-purple-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-emerald-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-emerald-600" data-testid="total-submissions-count">{submissions.length}</p>
                <CheckCircle className="w-8 h-8 text-emerald-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-amber-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-amber-600" data-testid="avg-progress">{analytics?.avg_progress?.toFixed(0) || 0}%</p>
                <BarChart3 className="w-8 h-8 text-amber-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="bg-white border shadow-sm">
            <TabsTrigger value="students" data-testid="teacher-tab-students">
              <Users className="w-4 h-4 mr-2" />
              Students
            </TabsTrigger>
            <TabsTrigger value="attendance" data-testid="teacher-tab-attendance">
              <Calendar className="w-4 h-4 mr-2" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="assignments" data-testid="teacher-tab-assignments">
              <FileText className="w-4 h-4 mr-2" />
              Assignments
            </TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Students in {user.class_name}</CardTitle>
                <CardDescription>Manage and monitor your students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                      data-testid={`student-item-${student.id}`}
                    >
                      <div>
                        <p className="font-semibold">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Class {student.class_name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Mark Attendance</CardTitle>
                <CardDescription>Track daily attendance for {user.class_name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label htmlFor="attendance-date">Date</Label>
                    <Input
                      id="attendance-date"
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      data-testid="attendance-date-input"
                    />
                  </div>
                  <Button onClick={handleMarkAttendance} className="bg-emerald-600 hover:bg-emerald-700" data-testid="mark-attendance-btn">
                    Save Attendance
                  </Button>
                </div>

                <div className="space-y-2">
                  {students.map((student) => {
                    const attendance = attendanceData.find(a => a.student_id === student.id);
                    const isPresent = attendance?.status === 'present';

                    return (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                        data-testid={`attendance-student-${student.id}`}
                      >
                        <p className="font-medium">{student.name}</p>
                        <Button
                          size="sm"
                          variant={isPresent ? "default" : "outline"}
                          className={isPresent ? "bg-emerald-600 hover:bg-emerald-700" : "border-red-300 text-red-600 hover:bg-red-50"}
                          onClick={() => toggleAttendance(student.id)}
                          data-testid={`attendance-toggle-${student.id}`}
                        >
                          {isPresent ? 'Present' : 'Absent'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Assignments</CardTitle>
                    <CardDescription>Create and manage assignments</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700" data-testid="create-assignment-btn">
                        Create Assignment
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Assignment</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCreateAssignment} className="space-y-4" data-testid="create-assignment-form">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input id="title" name="title" required data-testid="assignment-title-input" />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea id="description" name="description" required data-testid="assignment-description-input" />
                        </div>
                        <div>
                          <Label htmlFor="due_date">Due Date</Label>
                          <Input id="due_date" name="due_date" type="datetime-local" required data-testid="assignment-due-date-input" />
                        </div>
                        <div>
                          <Label htmlFor="total_marks">Total Marks</Label>
                          <Input id="total_marks" name="total_marks" type="number" defaultValue={100} required data-testid="assignment-marks-input" />
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" data-testid="assignment-submit-btn">
                          Create Assignment
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assignments.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No assignments created yet</p>
                  ) : (
                    assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="p-4 bg-gray-50 rounded-lg border"
                        data-testid={`teacher-assignment-${assignment.id}`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{assignment.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                            <div className="flex gap-4 mt-3 text-sm text-gray-600">
                              <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                              <span>Marks: {assignment.total_marks}</span>
                              <span>Class: {assignment.class_name}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
