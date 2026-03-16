import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Globe, User, CheckCircle } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { useStore } from '@/store/useStore';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { login } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      login(email);
      navigate('/');
      setIsLoading(false);
    }, 1000);
  };

  const levels = [
    { id: 'A1', label: 'A1', desc: '入门' },
    { id: 'A2', label: 'A2', desc: '基础' },
    { id: 'B1', label: 'B1', desc: '中级' },
  ];

  const languages = [
    { id: 'en', label: '英语', flag: '🇺🇸' },
    { id: 'ja', label: '日语', flag: '🇯🇵' },
    { id: 'ko', label: '韩语', flag: '🇰🇷' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <Globe className="text-white" size={26} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              LinguaLearn
            </span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">创建账户</h1>
          <p className="text-gray-500">加入我们开始语言学习之旅</p>
        </div>

        <Card className="p-8">
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="选择用户名"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">邮箱地址</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">密码至少8位</p>
              </div>

              <Button type="submit" className="w-full" size="lg">
                下一步
              </Button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">选择你的目标语言</h3>
                <div className="grid grid-cols-3 gap-3">
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      className="p-4 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all text-center"
                    >
                      <div className="text-3xl mb-1">{lang.flag}</div>
                      <div className="font-medium">{lang.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">选择你的水平</h3>
                <div className="grid grid-cols-3 gap-3">
                  {levels.map((level) => (
                    <button
                      key={level.id}
                      className="p-4 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all"
                    >
                      <div className="font-bold text-lg">{level.label}</div>
                      <div className="text-sm text-gray-500">{level.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setStep(1)}>
                  上一步
                </Button>
                <Button className="flex-1" onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? '创建中...' : '创建账户'}
                </Button>
              </div>
            </div>
          )}

          <p className="text-center text-gray-500 mt-6">
            已有账户？{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
              立即登录
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
