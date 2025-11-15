import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { ExternalLink, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  titleZh?: string;
  titleEn?: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
  hot?: string;
  mobileUrl?: string;
  description?: string;
  descriptionZh?: string;
  descriptionEn?: string;
}

export function HottestNewsPage() {
  const { language } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadNews = async () => {
      try {
        const timestamp = new Date().getTime();
        const response = await fetch(`${import.meta.env.BASE_URL}hottest-news.json?t=${timestamp}`);
        const data: NewsItem[] = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Failed to load hottest news:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const getTitle = (item: NewsItem) => {
    if (language === 'zh') {
      return item.titleZh || item.title;
    } else {
      return item.titleEn || item.title;
    }
  };

  const getDescription = (item: NewsItem) => {
    if (language === 'zh') {
      return item.descriptionZh || item.description || '';
    } else {
      return item.descriptionEn || item.description || '';
    }
  };

  const toggleSource = (source: string) => {
    setExpandedSources(prev => ({
      ...prev,
      [source]: !prev[source]
    }));
  };

  // 按来源分组
  const groupedNews = news.reduce((acc, item) => {
    if (!acc[item.source]) {
      acc[item.source] = [];
    }
    acc[item.source].push(item);
    return acc;
  }, {} as Record<string, NewsItem[]>);

  // 来源图标和颜色配置
  const sourceConfig: Record<string, { icon: string; bgColor: string; textColor: string }> = {
    'Github': { icon: 'G', bgColor: 'bg-gray-800', textColor: 'text-gray-800 dark:text-gray-300' },
    'Hacker News': { icon: 'Y', bgColor: 'bg-orange-500', textColor: 'text-orange-500 dark:text-orange-400' },
    'Product Hunt': { icon: 'P', bgColor: 'bg-red-500', textColor: 'text-red-500 dark:text-red-400' },
    'V2EX': { icon: 'V', bgColor: 'bg-gray-700', textColor: 'text-gray-700 dark:text-gray-400' },
    '知乎': { icon: '知', bgColor: 'bg-blue-600', textColor: 'text-blue-600 dark:text-blue-400' },
    '稀土掘金': { icon: '掘', bgColor: 'bg-blue-500', textColor: 'text-blue-500 dark:text-blue-400' },
    '少数派': { icon: '少', bgColor: 'bg-red-600', textColor: 'text-red-600 dark:text-red-400' },
    '酷安': { icon: '酷', bgColor: 'bg-green-600', textColor: 'text-green-600 dark:text-green-400' },
    '华尔街见闻': { icon: '见', bgColor: 'bg-indigo-600', textColor: 'text-indigo-600 dark:text-indigo-400' },
    '财联社': { icon: '财', bgColor: 'bg-red-700', textColor: 'text-red-700 dark:text-red-400' },
    '36氪': { icon: '氪', bgColor: 'bg-blue-700', textColor: 'text-blue-700 dark:text-blue-400' },
    'default': { icon: '📰', bgColor: 'bg-gray-600', textColor: 'text-gray-600 dark:text-gray-400' }
  };

  // 定义数据源顺序
  const sourceOrder = [
    'Github',
    'Hacker News',
    'Product Hunt',
    'V2EX',
    '知乎',
    '稀土掘金',
    '少数派',
    '酷安',
    '华尔街见闻',
    '财联社',
    '36氪'
  ];

  // 按照指定顺序排序
  const sortedSources = Object.keys(groupedNews).sort((a, b) => {
    const indexA = sourceOrder.indexOf(a);
    const indexB = sourceOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

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
        <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {language === 'zh' ? '科技热榜' : 'Tech Trending'}
              </h1>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {language === 'zh'
                ? '精选AI、科技领域的热门话题，聚焦行业前沿动态'
                : 'Curated trending topics in AI and technology, focusing on industry frontiers'}
            </p>
          </div>

          {/* News List */}
          <div className="space-y-6">
            {sortedSources.map((source) => {
              const items = groupedNews[source];
              const config = sourceConfig[source] || sourceConfig.default;
              const isExpanded = expandedSources[source] || false;
              const displayedItems = isExpanded ? items : items.slice(0, 5);
              const hasMore = items.length > 5;

              return (
                <div key={source} className="animate-fade-in-up">
                  {/* Source Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${config.bgColor} text-white font-bold text-sm shadow-md`}>
                      {config.icon}
                    </div>
                    <h2 className={`text-lg font-bold ${config.textColor}`}>
                      {source}
                    </h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700"></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {items.length} {language === 'zh' ? '条' : 'items'}
                    </span>
                  </div>

                  {/* News Items */}
                  <div className="space-y-2">
                    {displayedItems.map((item, index) => (
                      <a
                        key={item.id}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all duration-200"
                      >
                        {/* Rank */}
                        <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${config.bgColor} text-white shadow-sm`}>
                          {index + 1}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-1 line-clamp-2">
                            {getTitle(item)}
                          </h3>

                          {/* 项目描述 */}
                          {getDescription(item) && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                              {getDescription(item)}
                            </p>
                          )}

                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700">
                              {item.category}
                            </span>
                            {item.hot && (
                              <span className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                {item.hot}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* External Link Icon */}
                        <ExternalLink className="flex-shrink-0 h-4 w-4 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                      </a>
                    ))}
                  </div>

                  {/* Expand/Collapse Button */}
                  {hasMore && (
                    <button
                      onClick={() => toggleSource(source)}
                      className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          {language === 'zh' ? '收起' : 'Show Less'}
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          {language === 'zh' ? `展开全部 ${items.length} 条` : `Show All ${items.length} Items`}
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {news.length === 0 && !loading && (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {language === 'zh' ? '暂无热榜数据' : 'No trending news available'}
                </p>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
