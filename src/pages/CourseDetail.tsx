import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Play, BookOpen, Clock, Users, 
  CheckCircle, Lock, Calendar, Award 
} from 'lucide-react';
import { Button, Card, Badge, ProgressBar } from '@/components/ui';
import { useStore } from '@/store/useStore';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses, progress } = useStore();

  const course = courses.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">课程未找到</h2>
          <Button onClick={() => navigate('/courses')}>返回课程列表</Button>
        </div>
      </div>
    );
  }

  const courseProgress = progress.filter((p) => p.course_id === course.id);
  const completedLessons = courseProgress.filter((p) => p.is_completed).length;
  const overallProgress = courseProgress.length > 0
    ? Math.round(courseProgress.reduce((acc, p) => acc + p.completion_percent, 0) / courseProgress.length)
    : 0;

  const lessons = [
    { id: '1', title: 'Introduction & Greetings', type: 'vocabulary', duration: 15, isLocked: false },
    { id: '2', title: 'Basic Vocabulary Set 1', type: 'vocabulary', duration: 20, isLocked: false },
    { id: '3', title: 'Simple Sentences', type: 'grammar', duration: 25, isLocked: completedLessons >= 1 },
    { id: '4', title: 'Numbers & Counters', type: 'vocabulary', duration: 20, isLocked: completedLessons >= 2 },
    { id: '5', title: 'Question Formation', type: 'grammar', duration: 25, isLocked: completedLessons >= 3 },
    { id: '6', title: 'Listening Practice 1', type: 'listening', duration: 15, isLocked: completedLessons >= 4 },
    { id: '7', title: 'Speaking Practice', type: 'speaking', duration: 20, isLocked: completedLessons >= 5 },
    { id: '8', title: 'Review & Quiz', type: 'grammar', duration: 30, isLocked: completedLessons >= 6 },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vocabulary': return <BookOpen size={16} />;
      case 'grammar': return <Award size={16} />;
      case 'listening': return <Play size={16} />;
      case 'speaking': return <Play size={16} />;
      default: return <BookOpen size={16} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'vocabulary': return '单词';
      case 'grammar': return '语法';
      case 'listening': return '听力';
      case 'speaking': return '口语';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-12">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/courses')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            返回课程
          </button>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="flex gap-2 mb-4">
                <Badge variant="primary">
                  {course.language === 'en' ? '英语' : course.language === 'ja' ? '日语' : course.language === 'ko' ? '韩语' : '中文'}
                </Badge>
                <Badge variant="gray">{course.level}</Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-primary-100 mb-6">{course.description}</p>
              
              <div className="flex flex-wrap gap-6 text-primary-100">
                <span className="flex items-center gap-2">
                  <BookOpen size={18} />
                  {course.total_lessons} 课时
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={18} />
                  {Math.floor(course.total_duration / 60)}h {course.total_duration % 60}min
                </span>
                <span className="flex items-center gap-2">
                  <Users size={18} />
                  {course.enrolled_count.toLocaleString()} 学习者
                </span>
              </div>
            </div>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold mb-2">{overallProgress}%</div>
                <div className="text-primary-100">课程进度</div>
              </div>
              <ProgressBar value={overallProgress} size="lg" color="success" className="mb-6" />
              <div className="text-center text-sm text-primary-100 mb-4">
                {completedLessons} / {lessons.length} 课时已完成
              </div>
              <Link to="/learn/vocabulary">
                <Button className="w-full" size="lg">
                  {overallProgress > 0 ? '继续学习' : '开始学习'}
                  <Play size={18} className="ml-2" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">课程内容</h2>
        
        <div className="space-y-3">
          {lessons.map((lesson, index) => {
            const isCompleted = courseProgress.some(
              (p) => p.lesson_id === lesson.id && p.is_completed
            );
            const lessonProgress = courseProgress.find(
              (p) => p.lesson_id === lesson.id
            );

            return (
              <Card
                key={lesson.id}
                className={`flex items-center gap-4 ${lesson.isLocked ? 'opacity-60' : ''}`}
                hover={!lesson.isLocked}
              >
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center
                  ${isCompleted ? 'bg-success-500 text-white' : lesson.isLocked ? 'bg-gray-200 text-gray-400' : 'bg-primary-100 text-primary-500'}
                `}>
                  {isCompleted ? <CheckCircle size={20} /> : lesson.isLocked ? <Lock size={20} /> : <span className="font-semibold">{index + 1}</span>}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold ${lesson.isLocked ? 'text-gray-400' : ''}`}>
                      {lesson.title}
                    </h3>
                    <Badge variant="gray" size="sm">{getTypeLabel(lesson.type)}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {lesson.duration} min
                    </span>
                    {lessonProgress && !isCompleted && (
                      <span className="text-primary-500">{lessonProgress.completion_percent}% 完成</span>
                    )}
                  </div>
                </div>

                <div className="text-gray-400">
                  {getTypeIcon(lesson.type)}
                </div>

                {!lesson.isLocked && (
                  <Link to="/learn/vocabulary">
                    <Button variant={isCompleted ? 'secondary' : 'primary'} size="sm">
                      {isCompleted ? '复习' : '开始'}
                    </Button>
                  </Link>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
