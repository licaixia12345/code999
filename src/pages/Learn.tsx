import { Link } from 'react-router-dom';
import { BookOpen, PenTool, Mic, Headphones, Sparkles } from 'lucide-react';
import { Card, Badge } from '@/components/ui';

export default function Learn() {
  const modules = [
    {
      id: 'vocabulary',
      icon: <BookOpen size={32} />,
      title: '单词记忆',
      description: '智能闪卡系统，科学记忆曲线',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
      stats: '1,234 词',
    },
    {
      id: 'grammar',
      icon: <PenTool size={32} />,
      title: '语法练习',
      description: '交互式语法题，即时反馈',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500',
      stats: '500+ 题目',
    },
    {
      id: 'speaking',
      icon: <Mic size={32} />,
      title: '口语跟读',
      description: 'AI评分，流利口语',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500',
      stats: '200+ 场景',
    },
    {
      id: 'listening',
      icon: <Headphones size={32} />,
      title: '听力训练',
      description: '原声材料，全面提升',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-500',
      stats: '150+ 音频',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">学习中心</h1>
          <p className="text-gray-600">选择学习模块开始你的语言之旅</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {modules.map((module, index) => (
            <Link
              key={module.id}
              to={`/learn/${module.id}`}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card className="h-full group overflow-hidden" hover>
                <div className="flex items-start gap-6">
                  <div className={`w-20 h-20 ${module.bgColor} rounded-2xl flex items-center justify-center ${module.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                    {module.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-bold">{module.title}</h2>
                      <Badge variant="primary" size="sm">{module.stats}</Badge>
                    </div>
                    <p className="text-gray-500 mb-4">{module.description}</p>
                    <div className={`inline-flex items-center gap-2 text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r ${module.color}`}>
                      <Sparkles size={16} />
                      开始学习
                    </div>
                  </div>
                </div>
                
                <div className={`mt-6 h-2 rounded-full bg-gradient-to-r ${module.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">学习建议</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="font-medium mb-2">保持规律</h3>
              <p className="text-sm text-gray-500">每天学习15-30分钟</p>
            </Card>
            <Card className="text-center">
              <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="font-medium mb-2">及时复习</h3>
              <p className="text-sm text-gray-500">定期回顾已学内容</p>
            </Card>
            <Card className="text-center">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-medium mb-2">设定目标</h3>
              <p className="text-sm text-gray-500">明确学习目标</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
