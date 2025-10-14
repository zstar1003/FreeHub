import { TrendingUp, Trophy } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';

interface RankingItem {
  rank: number;
  prevRank: number;
  language: string;
  rating: number;
  change: number;
}

export function RankingPage() {
  const { language, t } = useLanguage();
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('2025-10');

  // 从 JSON 文件加载排行榜数据
  useEffect(() => {
    const loadRankings = async () => {
      try {
        const response = await fetch('/rankings.json');
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
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 text-white shadow-lg">
                <Trophy className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {language === 'zh' ? 'TIOBE 编程语言排行榜' : 'TIOBE Programming Language Rankings'}
              </h1>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {language === 'zh'
                ? 'TIOBE 编程语言社区排行榜是编程语言流行趋势的一个指标，每月更新。排名基于全球范围内的搜索引擎数据。'
                : 'The TIOBE Programming Community index is an indicator of the popularity of programming languages, updated monthly. Rankings are based on worldwide search engine data.'}
            </p>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
              {language === 'zh' ? `数据更新时间：${lastUpdate}` : `Data updated: ${lastUpdate}`}
            </p>
          </div>

          {/* Rankings Table */}
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

          {/* Footer Note */}
          <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 max-w-4xl mx-auto">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>{language === 'zh' ? '说明：' : 'Note: '}</strong>
              {language === 'zh'
                ? 'TIOBE 排行榜并不代表编程语言的好坏，而是反映某个编程语言的热门程度。排名数据基于搜索引擎（如 Google、Bing、Yahoo!、Wikipedia 等）的查询结果统计。'
                : 'The TIOBE rankings do not indicate the quality of programming languages, but rather their popularity. The data is based on search engine query statistics (such as Google, Bing, Yahoo!, Wikipedia, etc.).'}
            </p>
          </div>
        </main>
      )}
    </div>
  );
}
