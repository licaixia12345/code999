import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Globe, BookOpen, GraduationCap, Trophy, Users, User, 
  Menu, X, LogOut, Settings 
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button, Dropdown, DropdownItem } from '@/components/ui';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout, currentLanguage, setCurrentLanguage } = useStore();

  const navLinks = [
    { path: '/', label: '首页', icon: <Globe size={18} /> },
    { path: '/courses', label: '课程', icon: <BookOpen size={18} /> },
    { path: '/learn', label: '学习', icon: <GraduationCap size={18} /> },
    { path: '/progress', label: '进度', icon: <Trophy size={18} /> },
    { path: '/community', label: '社区', icon: <Users size={18} /> },
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' },
    { code: 'zh', label: '中文' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <Globe className="text-white" size={22} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              LinguaLearn
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  location.pathname === link.path
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value)}
              className="hidden sm:block px-3 py-1.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>

            {isAuthenticated ? (
              <Dropdown
                trigger={
                  <div className="flex items-center gap-2 cursor-pointer">
                    <img
                      src={user?.avatar_url}
                      alt={user?.username}
                      className="w-9 h-9 rounded-full border-2 border-primary-200"
                    />
                    <span className="hidden sm:block text-sm font-medium">{user?.username}</span>
                  </div>
                }
                align="right"
              >
                <Link to="/profile">
                  <DropdownItem icon={<User size={16} />}>个人资料</DropdownItem>
                </Link>
                <DropdownItem icon={<Settings size={16} />}>设置</DropdownItem>
                <DropdownItem icon={<LogOut size={16} />} onClick={logout}>
                  退出登录
                </DropdownItem>
              </Dropdown>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">登录</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">注册</Button>
                </Link>
              </div>
            )}

            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slide-down">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                  location.pathname === link.path
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
