import { Link } from 'react-router-dom';
import { 
  ArrowRight, BookOpen, Headphones, Mic, PenTool, 
  Flame, Trophy, Target, Zap, Play, Star 
} from 'lucide-react';
import { Button, Card, Badge, ProgressBar } from '@/components/ui';
import { useStore } from '@/store/useStore';

export default function Home() {
  const { courses, stats, achievements, isAuthenticated } = useStore();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', color: 'from-blue-500 to-cyan-500' },
    { code: 'ja', name: '日本語', flag: '🇯🇵', color: 'from-red-500 to-pink-500' },
    { code: 'ko', name: '한국어', flag: '🇰🇷', color: 'from-purple-500 to-indigo-500' },
  ];

  const features = [
    { icon: <BookOpen size={24} />, title: '单词记忆', desc: '智能闪卡系统', color: 'bg-blue-500' },
    { icon: <PenTool size={24} />, title: '语法练习', desc: '交互式练习', color: 'bg-green-500' },
    { icon: <Mic size={24} />, title: '口语跟读', desc: 'AI发音评分', color: 'bg-purple-500' },
    { icon: <Headphones size={24} />, title: '听力训练', desc: '原声材料', color: 'bg-orange-500' },
  ];

  const recentAchievements = achievements.filter(a => a.is_unlocked).slice(0, 4);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20 lg:py-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
          <div className="absolute top-40 -left-40 w-60 h-60 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="accent" size="md" className="mb-6">
              <Zap size={14} className="mr-1" />
              开启你的语言学习之旅
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent">
                用科技赋能语言学习
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              沉浸式多语言学习体验，从英语、日语到韩语，
              <br className="hidden md:block" />
              专属你的个性化学习路径
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/courses">
                <Button size="lg" className="group">
                  立即开始学习
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to={isAuthenticated ? "/learn" : "/register"}>
                <Button variant="outline" size="lg">
                  <Play size={18} className="mr-2" />
                  免费试用
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex justify-center gap-8 mt-16 text-center">
            {languages.map((lang) => (
              <div key={lang.code} className="flex items-center gap-2">
                <span className="text-3xl">{lang.flag}</span>
                <span className="font-medium text-gray-700">{lang.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {isAuthenticated && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">今日学习</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center" hover>
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Flame className="text-primary-500" size={24} />
                </div>
                <div className="text-3xl font-bold text-primary-600">{stats.streakDays}</div>
                <div className="text-sm text-gray-500">连续学习天数</div>
              </Card>
              <Card className="text-center" hover>
                <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Trophy className="text-success-500" size={24} />
                </div>
                <div className="text-3xl font-bold text-success-600">{stats.coursesCompleted}</div>
                <div className="text-sm text-gray-500">完成课程</div>
              </Card>
              <Card className="text-center" hover>
                <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Target className="text-accent-500" size={24} />
                </div>
                <div className="text-3xl font-bold text-accent-600">{stats.wordsLearned}</div>
                <div className="text-sm text-gray-500">已学单词</div>
              </Card>
              <Card className="text-center" hover>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Zap className="text-orange-500" size={24} />
                </div>
                <div className="text-3xl font-bold text-orange-600">{Math.floor(stats.totalStudyMinutes / 60)}h</div>
                <div className="text-sm text-gray-500">总学习时长</div>
              </Card>
            </div>

            {recentAchievements.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Star className="text-yellow-500" size={20} />
                  最近成就
                </h3>
                <div className="flex flex-wrap gap-3">
                  {recentAchievements.map((achievement) => (
                    <Badge key={achievement.id} variant="accent" size="md">
                      <span className="mr-1">{achievement.icon}</span>
                      {achievement.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">学习模块</h2>
            <p className="text-gray-600">全面的互动式学习体验</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link key={index} to="/learn">
                <Card className="text-center h-full" hover>
                  <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">热门课程</h2>
            <Link to="/courses">
              <Button variant="outline" size="sm">
                查看全部
                <ArrowRight size={16} className="ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.slice(0, 4).map((course) => (
              <Link key={course.id} to={`/courses/${course.id}`}>
                <Card padding="none" className="overflow-hidden h-full" hover>
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={course.cover_image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="primary">
                        {course.language === 'en' ? '英语' : course.language === 'ja' ? '日语' : course.language === 'ko' ? '韩语' : '中文'}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge variant="gray">{course.level}</Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{course.total_lessons} 课时</span>
                      <span>{Math.floor(course.total_duration / 60)}h</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <ProgressBar value={course.enrolled_count % 100} max={100} size="sm" color="success" />
                      <span className="text-xs text-gray-400">{course.enrolled_count.toLocaleString()}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">准备好开始了吗？</h2>
          <p className="text-primary-100 mb-8 text-lg">加入数百万学习者的行列</p>
          <Link to={isAuthenticated ? "/courses" : "/register"}>
            <Button size="lg" className="bg-white text-primary-600 hover:bg-primary-50">
              {isAuthenticated ? '选择课程' : '免费注册'}
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
