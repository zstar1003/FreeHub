import { Newspaper, Calendar, Tag, ExternalLink, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
}

export function AINewsPage() {
  const { language } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updateTime, setUpdateTime] = useState('');

  // 加载 AI 新闻数据
  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}ai-news.json`);
        const data = await response.json();
        setNews(data);

        // 获取最后更新时间
        const lastModified = response.headers.get('last-modified');
        if (lastModified) {
          const date = new Date(lastModified);
          setUpdateTime(date.toISOString().split('T')[0]);
        } else {
          setUpdateTime(new Date().toISOString().split('T')[0]);
        }
      } catch (error) {
        console.error('Failed to load AI news:', error);
        setUpdateTime(new Date().toISOString().split('T')[0]);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      '大模型': 'from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700',
      '开源': 'from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700',
      '产品': 'from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700',
      '研究': 'from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700',
      '图像生成': 'from-pink-100 to-pink-200 dark:from-pink-900/40 dark:to-pink-800/40 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-700',
      '视频生成': 'from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700',
      '平台': 'from-cyan-100 to-cyan-200 dark:from-cyan-900/40 dark:to-cyan-800/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700',
      '国产': 'from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700',
    };
    return colors[category] || 'from-gray-100 to-gray-200 dark:from-gray-900/40 dark:to-gray-800/40 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/30">
      {loading ? (
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-fade-in">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{language === 'zh' ? '加载中...' : 'Loading...'}</p>
          </div>
        </div>
      ) : (
        <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 text-white shadow-lg">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {language === 'zh' ? 'AI 新闻' : 'AI News'}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2">
              {language === 'zh'
                ? '最新的 AI 行业动态、产品发布和技术突破，为您带来前沿的人工智能资讯。'
                : 'Latest AI industry trends, product releases, and technological breakthroughs bringing you cutting-edge artificial intelligence news.'}
            </p>
            {updateTime && (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                {language === 'zh' ? `数据更新时间：${updateTime}` : `Data updated: ${updateTime}`}
              </p>
            )}
          </div>

          {/* News List */}
          <div className="max-w-5xl mx-auto space-y-3 sm:space-y-4">
            {news.map((item, index) => (
              <article
                key={item.id}
                className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-card-hover hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 sm:p-6"
                >
                  {/* Title and Category */}
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4 mb-3">
                    <h2 className="text-base sm:text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 flex-1">
                      {item.title}
                    </h2>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium bg-gradient-to-r border whitespace-nowrap flex-shrink-0 self-start ${getCategoryColor(item.category)}`}>
                      <Tag className="h-3 w-3" />
                      {item.category}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3 sm:mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Meta Information */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 text-xs text-gray-500 dark:text-gray-500">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-1.5">
                        <Newspaper className="h-3.5 w-3.5" />
                        <span className="truncate max-w-[120px] sm:max-w-none">{item.source}</span>
                      </div>
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{item.publishedAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <span className="font-medium text-xs">{language === 'zh' ? '查看详情' : 'Read more'}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </a>

                {/* Hover Effect Indicator */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary-500 to-blue-500 dark:from-primary-600 dark:to-blue-600 opacity-0 transition-opacity group-hover:opacity-100" />
              </article>
            ))}
          </div>

        </main>
      )}
    </div>
  );
}
