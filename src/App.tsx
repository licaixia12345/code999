import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import Home from '@/pages/Home';
import Courses from '@/pages/Courses';
import CourseDetail from '@/pages/CourseDetail';
import Learn from '@/pages/Learn';
import Vocabulary from '@/pages/Vocabulary';
import Grammar from '@/pages/Grammar';
import Speaking from '@/pages/Speaking';
import Listening from '@/pages/Listening';
import Progress from '@/pages/Progress';
import Community from '@/pages/Community';
import Profile from '@/pages/Profile';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/vocabulary" element={<Vocabulary />} />
          <Route path="/learn/grammar" element={<Grammar />} />
          <Route path="/learn/speaking" element={<Speaking />} />
          <Route path="/learn/listening" element={<Listening />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}
