import { useState } from 'react';
import { MessageCircle, Heart, Share2, Plus, Search, Filter } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { useStore } from '@/store/useStore';

export default function Community() {
  const { communityPosts, isAuthenticated, user } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [showCreatePost, setShowCreatePost] = useState(false);

  const languages = [
    { code: 'all', label: '全部' },
    { code: 'en', label: '英语' },
    { code: 'ja', label: '日语' },
    { code: 'ko', label: '韩语' },
    { code: 'zh', label: '中文' },
  ];

  const filteredPosts = communityPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = selectedLanguage === 'all' || post.language === selectedLanguage;
    return matchesSearch && matchesLanguage;
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">学习社区</h1>
            <p className="text-gray-600">与其他学习者交流分享</p>
          </div>
          {isAuthenticated && (
            <Button onClick={() => setShowCreatePost(true)}>
              <Plus size={18} className="mr-2" />
              发布帖子
            </Button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-3/4">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="搜索帖子..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
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
            </div>

            <div className="space-y-4">
              {filteredPosts.map((post, index) => (
                <Card key={post.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="flex items-start gap-4">
                    <img
                      src={post.avatar_url}
                      alt={post.username}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{post.username}</span>
                        <Badge variant="primary" size="sm">{getLanguageLabel(post.language)}</Badge>
                        <span className="text-gray-400 text-sm">{post.created_at}</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
                      <div className="flex items-center gap-6 text-gray-500">
                        <button className="flex items-center gap-2 hover:text-primary-500 transition-colors">
                          <Heart size={18} />
                          <span>{post.likes_count}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-primary-500 transition-colors">
                          <MessageCircle size={18} />
                          <span>{post.comments_count}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-primary-500 transition-colors">
                          <Share2 size={18} />
                          <span>分享</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">未找到帖子</h3>
                <p className="text-gray-500">试试调整搜索条件</p>
              </div>
            )}
          </div>

          <div className="lg:w-1/4">
            <Card className="sticky top-24">
              <h3 className="font-semibold mb-4">社区统计</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">总帖子数</span>
                  <span className="font-medium">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">活跃用户</span>
                  <span className="font-medium">5,678</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">今日新帖</span>
                  <span className="font-medium">89</span>
                </div>
              </div>

              <hr className="my-4" />

              <h3 className="font-semibold mb-4">热门话题</h3>
              <div className="flex flex-wrap gap-2">
                {['#英语学习', '#日语N1', '#韩语TOPIK', '#留学', '#口语练习'].map((tag) => (
                  <Badge key={tag} variant="gray" className="cursor-pointer hover:bg-primary-100">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
