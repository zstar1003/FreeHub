import { TrendingUp, Trophy, Star, GitFork } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';

interface RankingItem {
  rank: number;
  prevRank: number;
  language: string;
  rating: number;
  change: number;
}

interface TrendingRepo {
  rank: number;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  todayStars: number;
  url: string;
}

type TabType = 'tiobe' | 'github';

export function RankingPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('tiobe');
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [trendingRepos, setTrendingRepos] = useState<TrendingRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const lastUpdate = '2025-10';
  const [trendingUpdateTime, setTrendingUpdateTime] = useState('');

  // 从 JSON 文件加载排行榜数据
  useEffect(() => {
    const loadRankings = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}rankings.json`);
        const data = await response.json();
        setRankings(data);
      } catch (error) {
        console.error('Failed to load rankings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRankings();
  }, []);

  // 加载 GitHub Trending 数据
  useEffect(() => {
    const loadTrending = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}github-trending.json`);
        const data = await response.json();
        setTrendingRepos(data);

        // 尝试从响应头获取最后修改时间
        const lastModified = response.headers.get('last-modified');
        if (lastModified) {
          const date = new Date(lastModified);
          setTrendingUpdateTime(date.toISOString().split('T')[0]);
        } else {
          // 如果没有最后修改时间，使用当前日期
          setTrendingUpdateTime(new Date().toISOString().split('T')[0]);
        }
      } catch (error) {
        console.error('Failed to load trending repos:', error);
        // 设置默认更新时间
        setTrendingUpdateTime(new Date().toISOString().split('T')[0]);
      }
    };

    loadTrending();
  }, []);

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg';
    if (rank === 2) return 'bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-md';
    if (rank === 3) return 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-md';
    return 'bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 text-primary-700 dark:text-primary-300 font-semibold';
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
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 text-center animate-fade-in">
            {/* Tab Buttons */}
            <div className="flex justify-center gap-2 mb-4">
              <button
                onClick={() => setActiveTab('tiobe')}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  activeTab === 'tiobe'
                    ? 'bg-gradient-to-r from-primary-500 to-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                }`}
              >
                TIOBE {language === 'zh' ? '排行榜' : 'Index'}
              </button>
              <button
                onClick={() => setActiveTab('github')}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  activeTab === 'github'
                    ? 'bg-gradient-to-r from-primary-500 to-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                }`}
              >
                {language === 'zh' ? 'GitHub 趋势' : 'GitHub Trending'}
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {activeTab === 'tiobe' ? (
                language === 'zh'
                  ? 'TIOBE 编程语言社区排行榜是编程语言流行趋势的一个指标，每月更新。'
                  : 'The TIOBE Programming Community index is an indicator of the popularity of programming languages, updated monthly.'
              ) : (
                language === 'zh'
                  ? 'GitHub 趋势展示当前最热门的开源项目，基于每日的 Star 增长趋势。'
                  : 'GitHub Trending showcases the most popular open source projects based on daily star growth trends.'
              )}
            </p>
            {activeTab === 'tiobe' ? (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                {language === 'zh' ? `数据更新时间：${lastUpdate}` : `Data updated: ${lastUpdate}`}
              </p>
            ) : trendingUpdateTime ? (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                {language === 'zh' ? `数据更新时间：${trendingUpdateTime}` : `Data updated: ${trendingUpdateTime}`}
              </p>
            ) : null}
          </div>

          {/* Content Tables */}
          {activeTab === 'tiobe' ? (
            /* TIOBE Rankings Table */
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in-up max-w-4xl mx-auto">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/30 border-b border-gray-200 dark:border-gray-700">
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider" style={{ width: '100px' }}>
                        {language === 'zh' ? '排名' : 'Rank'}
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider" style={{ width: 'auto' }}>
                        {language === 'zh' ? '编程语言' : 'Programming Language'}
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider" style={{ width: '200px' }}>
                        {language === 'zh' ? '流行度' : 'Popularity'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {rankings.map((item, index) => (
                      <tr
                        key={item.rank}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors animate-fade-in-up"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center">
                            <div
                              className={`inline-flex items-center justify-center w-12 h-12 rounded-xl font-bold text-base ${getRankBadgeColor(item.rank)}`}
                            >
                              {item.rank <= 3 ? <Trophy className="h-5 w-5" /> : item.rank}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center items-center">
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{item.language}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center">
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary-100 to-blue-100 dark:from-primary-900/40 dark:to-blue-900/40 border border-primary-200 dark:border-primary-700">
                              <TrendingUp className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                              <span className="text-base font-bold text-primary-700 dark:text-primary-300">
                                {item.rating.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* GitHub Trending Table */
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in-up max-w-6xl mx-auto">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/30 border-b border-gray-200 dark:border-gray-700">
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider" style={{ width: '80px' }}>
                        {language === 'zh' ? '排名' : 'Rank'}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        {language === 'zh' ? '项目' : 'Repository'}
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider" style={{ width: '120px' }}>
                        {language === 'zh' ? '语言' : 'Language'}
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider" style={{ width: '100px' }}>
                        Stars
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider" style={{ width: '100px' }}>
                        Forks
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider" style={{ width: '120px' }}>
                        {language === 'zh' ? '今日新增' : 'Today'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {trendingRepos.map((repo, index) => (
                      <tr
                        key={repo.rank}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors animate-fade-in-up"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center">
                            <div
                              className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-bold text-base ${getRankBadgeColor(repo.rank)}`}
                            >
                              {repo.rank <= 3 ? <Trophy className="h-4 w-4" /> : repo.rank}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <a
                              href={repo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-base font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline"
                            >
                              {repo.name}
                            </a>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {repo.description}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                              {repo.language}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center items-center gap-1.5 text-gray-700 dark:text-gray-300">
                            <Star className="h-4 w-4" />
                            <span className="font-semibold">{repo.stars.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center items-center gap-1.5 text-gray-700 dark:text-gray-300">
                            <GitFork className="h-4 w-4" />
                            <span className="font-semibold">{repo.forks.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/40 dark:to-orange-900/40 border border-yellow-200 dark:border-yellow-700">
                              <Star className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400 fill-current" />
                              <span className="text-sm font-bold text-yellow-700 dark:text-yellow-300">
                                {repo.todayStars.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer Note */}
          <div className={`mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 mx-auto ${activeTab === 'tiobe' ? 'max-w-4xl' : 'max-w-6xl'}`}>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>{language === 'zh' ? '说明：' : 'Note: '}</strong>
              {activeTab === 'tiobe' ? (
                language === 'zh'
                  ? 'TIOBE 排行榜并不代表编程语言的好坏，而是反映某个编程语言的热门程度。排名数据基于搜索引擎（如 Google、Bing、Yahoo!、Wikipedia 等）的查询结果统计。'
                  : 'The TIOBE rankings do not indicate the quality of programming languages, but rather their popularity. The data is based on search engine query statistics (such as Google, Bing, Yahoo!, Wikipedia, etc.).'
              ) : (
                language === 'zh'
                  ? 'GitHub 趋势展示的是当前最受关注的开源项目，数据基于 GitHub 上的 Star 增长趋势。项目排名会根据每日新增 Star 数量实时变化。'
                  : 'GitHub Trending showcases the most popular open source projects, based on star growth trends on GitHub. Rankings change in real-time based on daily star increases.'
              )}
            </p>
          </div>
        </main>
      )}
    </div>
  );
}
