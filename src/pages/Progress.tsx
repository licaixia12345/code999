import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Trophy, Target, Flame, BookOpen, Star } from 'lucide-react';
import { Card, Badge, ProgressBar } from '@/components/ui';
import { useStore } from '@/store/useStore';

export default function Progress() {
  const { stats, achievements, progress, courses } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const daysInMonth = new Date(
    selectedMonth.getFullYear(),
    selectedMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    selectedMonth.getFullYear(),
    selectedMonth.getMonth(),
    1
  ).getDay();

  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

  const prevMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1));
  };

  const studyDays = [1, 3, 5, 8, 10, 12, 15, 17, 20, 22, 25, 28];

  const unlockedAchievements = achievements.filter(a => a.is_unlocked);
  const lockedAchievements = achievements.filter(a => !a.is_unlocked);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">学习进度</h1>
          <p className="text-gray-600">追踪你的学习轨迹</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Flame className="text-primary-500" size={28} />
            </div>
            <div className="text-3xl font-bold text-primary-600 mb-1">{stats.streakDays}</div>
            <div className="text-gray-500">连续学习天数</div>
          </Card>

          <Card className="text-center">
            <div className="w-14 h-14 bg-success-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="text-success-500" size={28} />
            </div>
            <div className="text-3xl font-bold text-success-600 mb-1">{stats.coursesCompleted}</div>
            <div className="text-gray-500">完成课程</div>
          </Card>

          <Card className="text-center">
            <div className="w-14 h-14 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="text-accent-500" size={28} />
            </div>
            <div className="text-3xl font-bold text-accent-600 mb-1">{stats.wordsLearned}</div>
            <div className="text-gray-500">已学单词</div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">学习日历</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="font-medium min-w-[100px] text-center">
                  {selectedMonth.getFullYear()}年 {monthNames[selectedMonth.getMonth()]}
                </span>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
                <div key={day} className="text-center text-sm text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isStudyDay = studyDays.includes(day);
                const isToday = new Date().getDate() === day && 
                  new Date().getMonth() === selectedMonth.getMonth() &&
                  new Date().getFullYear() === selectedMonth.getFullYear();

                return (
                  <div
                    key={day}
                    className={`
                      aspect-square rounded-lg flex items-center justify-center text-sm
                      transition-all
                      ${isStudyDay ? 'bg-success-500 text-white' : 'bg-gray-100 text-gray-500'}
                      ${isToday ? 'ring-2 ring-primary-500 ring-offset-2' : ''}
                      ${!isStudyDay && 'opacity-50'}
                    `}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-success-500 rounded" />
                <span>学习日</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 rounded" />
                <span>未学习</span>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-6">学习统计</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2 text-gray-600">
                    <BookOpen size={18} />
                    总学习时长
                  </span>
                  <span className="font-semibold">{Math.floor(stats.totalStudyMinutes / 60)}小时 {stats.totalStudyMinutes % 60}分钟</span>
                </div>
                <ProgressBar value={stats.totalStudyMinutes} max={3000} size="md" color="primary" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2 text-gray-600">
                    <Target size={18} />
                    课程完成率
                  </span>
                  <span className="font-semibold">{Math.round((stats.coursesCompleted / 10) * 100)}%</span>
                </div>
                <ProgressBar value={stats.coursesCompleted} max={10} size="md" color="success" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2 text-gray-600">
                    <Star size={18} />
                    经验值
                  </span>
                  <span className="font-semibold">{stats.xpPoints} XP</span>
                </div>
                <ProgressBar value={stats.xpPoints % 1000} max={1000} size="md" color="accent" />
              </div>
            </div>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-6">成就徽章</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`text-center ${achievement.is_unlocked ? '' : 'opacity-50 grayscale'}`}
                hover
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <div className="font-medium text-sm mb-1">{achievement.name}</div>
                <div className="text-xs text-gray-500">{achievement.description}</div>
                {achievement.is_unlocked && achievement.unlocked_at && (
                  <div className="text-xs text-success-500 mt-2">
                    {achievement.unlocked_at}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
