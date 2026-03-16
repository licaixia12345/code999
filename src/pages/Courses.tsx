import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BookOpen, Clock, Users } from 'lucide-react';
import { Card, Badge, Button, ProgressBar } from '@/components/ui';
import { useStore } from '@/store/useStore';

export default function Courses() {
  const { courses } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const languages = [
    { code: 'all', label: '全部语言' },
    { code: 'en', label: '英语' },
    { code: 'ja', label: '日语' },
    { code: 'ko', label: '韩语' },
    { code: 'zh', label: '中文' },
  ];

  const levels = ['all', 'A1', 'A2', 'B1', 'B2', 'C1'];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = selectedLanguage === 'all' || course.language === selectedLanguage;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    return matchesSearch && matchesLanguage && matchesLevel;
  });

  const getLanguageLabel = (code: string) => {
    const labels: Record<string, string> = {
      en: '英语', ja: '日语', ko: '韩语', zh: '中文'
    };
    return labels[code] || code;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">课程中心</h1>
          <p className="text-gray-600">选择适合你的语言课程</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="搜索课程..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">全部级别</option>
              {levels.filter(l => l !== 'all').map((level) => (
                <option key={level} value={level}>Level {level}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course, index) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <Card padding="none" className="overflow-hidden h-full group" hover>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={course.cover_image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="primary">{getLanguageLabel(course.language)}</Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="gray">{course.level}</Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-semibold text-lg line-clamp-2">{course.title}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <BookOpen size={16} />
                      {course.total_lessons} 课
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {Math.floor(course.total_duration / 60)}h
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={16} />
                      {(course.enrolled_count / 1000).toFixed(1)}k
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ProgressBar
                      value={course.enrolled_count % 100}
                      max={100}
                      size="sm"
                      color={course.language === 'en' ? 'primary' : course.language === 'ja' ? 'accent' : 'success'}
                    />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">未找到课程</h3>
            <p className="text-gray-500">试试调整筛选条件</p>
          </div>
        )}
      </div>
    </div>
  );
}
