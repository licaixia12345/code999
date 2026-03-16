import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, Bell, Shield, BookOpen, Award, Clock, Flame, Target, LogOut } from 'lucide-react';
import { Card, Button, Badge, ProgressBar } from '@/components/ui';
import { useStore } from '@/store/useStore';

export default function Profile() {
  const { user, stats, achievements, isAuthenticated, logout } = useStore();
  const [activeTab, setActiveTab] = useState('overview');

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">请先登录</h2>
          <Link to="/login">
            <Button>前往登录</Button>
          </Link>
        </div>
      </div>
    );
  }

  const unlockedCount = achievements.filter(a => a.is_unlocked).length;

  const tabs = [
    { id: 'overview', label: '概览', icon: <User size={18} /> },
    { id: 'achievements', label: '成就', icon: <Award size={18} /> },
    { id: 'settings', label: '设置', icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-6">
            <img
              src={user.avatar_url}
              alt={user.username}
              className="w-24 h-24 rounded-full border-4 border-white/30"
            />
            <div>
              <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
              <p className="text-primary-100 mb-3">{user.email}</p>
              <div className="flex items-center gap-4">
                <Badge variant="primary">Level {user.level}</Badge>
                <span className="flex items-center gap-1 text-primary-100">
                  <Flame size={16} />
                  {stats.streakDays} 天连续学习
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <div className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut size={18} />
                  退出登录
                </button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <Card>
                  <h2 className="text-xl font-bold mb-6">学习统计</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <Clock className="mx-auto text-primary-500 mb-2" size={24} />
                      <div className="text-2xl font-bold">{Math.floor(stats.totalStudyMinutes / 60)}h</div>
                      <div className="text-sm text-gray-500">总学习时长</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <BookOpen className="mx-auto text-success-500 mb-2" size={24} />
                      <div className="text-2xl font-bold">{stats.coursesCompleted}</div>
                      <div className="text-sm text-gray-500">完成课程</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <Target className="mx-auto text-accent-500 mb-2" size={24} />
                      <div className="text-2xl font-bold">{stats.wordsLearned}</div>
                      <div className="text-sm text-gray-500">已学单词</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <Award className="mx-auto text-yellow-500 mb-2" size={24} />
                      <div className="text-2xl font-bold">{unlockedCount}</div>
                      <div className="text-sm text-gray-500">获得成就</div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h2 className="text-xl font-bold mb-6">学习目标</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span>每日学习时间</span>
                        <span className="text-primary-500">30/60 分钟</span>
                      </div>
                      <ProgressBar value={50} size="md" color="primary" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span>本周课程进度</span>
                        <span className="text-success-500">3/5 课程</span>
                      </div>
                      <ProgressBar value={60} size="md" color="success" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span>月度单词目标</span>
                        <span className="text-accent-500">150/200 单词</span>
                      </div>
                      <ProgressBar value={75} size="md" color="accent" />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-6">
                <Card>
                  <h2 className="text-xl font-bold mb-6">我的成就</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-xl text-center ${
                          achievement.is_unlocked
                            ? 'bg-gradient-to-br from-primary-50 to-accent-50'
                            : 'bg-gray-50 opacity-50'
                        }`}
                      >
                        <div className="text-4xl mb-2">{achievement.icon}</div>
                        <div className="font-medium mb-1">{achievement.name}</div>
                        <div className="text-sm text-gray-500">{achievement.description}</div>
                        {achievement.is_unlocked && achievement.unlocked_at && (
                          <div className="text-xs text-success-500 mt-2">
                            {achievement.unlocked_at}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <Card>
                  <h2 className="text-xl font-bold mb-6">个人设置</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <User className="text-gray-500" size={20} />
                        <div>
                          <div className="font-medium">个人信息</div>
                          <div className="text-sm text-gray-500">修改用户名、头像</div>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm">编辑</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Bell className="text-gray-500" size={20} />
                        <div>
                          <div className="font-medium">通知设置</div>
                          <div className="text-sm text-gray-500">管理推送通知</div>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm">编辑</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Shield className="text-gray-500" size={20} />
                        <div>
                          <div className="font-medium">隐私安全</div>
                          <div className="text-sm text-gray-500">密码和账户安全</div>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm">编辑</Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
