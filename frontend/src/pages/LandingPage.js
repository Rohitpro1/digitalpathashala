import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Globe, Wifi, Smartphone, Award } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-900">Digital Pathshala</h1>
          </div>
          <div className="flex gap-3">
            <Link to="/login">
              <Button variant="outline" data-testid="header-login-btn">Login</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-emerald-600 hover:bg-emerald-700" data-testid="header-register-btn">Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Bridging the Digital Divide in Rural Education
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Empowering government schools in Nabha and nearby rural areas with offline-first digital learning, 
            multilingual content, and essential digital literacy skills.
          </p>
          <div className="flex gap-4 justify-center pt-6">
            <Link to="/register">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8" data-testid="hero-get-started-btn">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8" data-testid="hero-login-btn">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">The Challenge We're Addressing</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-semibold text-lg mb-2 text-red-900">Outdated Infrastructure</h3>
                <p className="text-sm text-red-700">Limited computer labs, old equipment, and lack of modern technology in rural schools.</p>
              </div>
              <div className="p-6 bg-orange-50 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-lg mb-2 text-orange-900">Poor Connectivity</h3>
                <p className="text-sm text-orange-700">Unreliable internet access making online learning nearly impossible.</p>
              </div>
              <div className="p-6 bg-amber-50 rounded-lg border border-amber-200">
                <h3 className="font-semibold text-lg mb-2 text-amber-900">Low Digital Literacy</h3>
                <p className="text-sm text-amber-700">Students and teachers lack basic digital skills, widening the urban-rural gap.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Solution</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 card-hover">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Wifi className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Offline-First Learning</h3>
              <p className="text-sm text-gray-600">Full functionality even without internet. Content syncs automatically when connected.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 card-hover">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Multilingual Content</h3>
              <p className="text-sm text-gray-600">Lessons available in Punjabi, Hindi, and English for better comprehension.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 card-hover">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Digital Literacy Modules</h3>
              <p className="text-sm text-gray-600">Computer basics, internet safety, typing practice, and coding fundamentals.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 card-hover">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Teacher Dashboard</h3>
              <p className="text-sm text-gray-600">Track attendance, monitor progress, create assignments, and manage classes easily.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 card-hover">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Low-End Device Support</h3>
              <p className="text-sm text-gray-600">Optimized for basic smartphones and older computers commonly found in rural areas.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 card-hover">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Interactive Lessons</h3>
              <p className="text-sm text-gray-600">Engaging content with exercises, quizzes, and hands-on learning activities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Expected Outcomes */}
      <section className="bg-emerald-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Expected Impact</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-lg mb-3 text-emerald-900">For Students</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">✓</span>
                  <span>Access quality education regardless of connectivity</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">✓</span>
                  <span>Develop essential digital skills for future careers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">✓</span>
                  <span>Learn in their preferred language</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">✓</span>
                  <span>Bridge the urban-rural education gap</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-lg mb-3 text-emerald-900">For Teachers</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">✓</span>
                  <span>Simple tools to track student progress</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">✓</span>
                  <span>Efficient attendance and assignment management</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">✓</span>
                  <span>Detailed analytics on class performance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">✓</span>
                  <span>Easy content creation and sharing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Rural Education?</h2>
          <p className="text-lg mb-8 text-emerald-50 max-w-2xl mx-auto">
            Join thousands of students and teachers already using Digital Pathshala to bridge the digital divide.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 text-lg px-8" data-testid="cta-register-btn">
              Start Learning Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-6 h-6 text-emerald-500" />
            <span className="text-xl font-semibold text-white">Digital Pathshala</span>
          </div>
          <p className="text-sm">
            Empowering rural education through technology | Punjab Education Department Initiative
          </p>
          <p className="text-xs mt-4 text-gray-500">
            © 2025 Digital Pathshala. Built for Government Schools in Nabha and surrounding areas.
          </p>
        </div>
      </footer>
    </div>
  );
}
