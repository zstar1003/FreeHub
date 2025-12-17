import { Rss, ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const SITE_URL = 'https://xdxsb.top/FreeHub';

interface RSSFeed {
  id: string;
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
  urlZh: string;
  urlEn: string;
  icon: string;
}

const rssFeeds: RSSFeed[] = [
  {
    id: 'all',
    titleZh: '全部内容',
    titleEn: 'All Content',
    descriptionZh: '订阅FreeHub全部内容，包括AI新闻、热门资讯和免费产品',
    descriptionEn: 'Subscribe to all FreeHub content including AI news, trending content, and free products',
    urlZh: `${SITE_URL}/rss/all.xml`,
    urlEn: `${SITE_URL}/rss/all-en.xml`,
    icon: '📦',
  },
  {
    id: 'ai-news',
    titleZh: 'AI 新闻',
    titleEn: 'AI News',
    descriptionZh: 'AI领域最新资讯，每日更新，来源包括36kr、Hacker News、TechCrunch等',
    descriptionEn: 'Latest AI news updated daily from 36kr, Hacker News, TechCrunch, and more',
    urlZh: `${SITE_URL}/rss/ai-news.xml`,
    urlEn: `${SITE_URL}/rss/ai-news-en.xml`,
    icon: '🤖',
  },
  {
    id: 'hottest',
    titleZh: '科技热榜',
    titleEn: 'Tech Trending',
    descriptionZh: '各平台热门资讯聚合，包括GitHub、V2EX、知乎、掘金等11+平台',
    descriptionEn: 'Hot news aggregated from 11+ platforms including GitHub, V2EX, Zhihu, Juejin, and more',
    urlZh: `${SITE_URL}/rss/hottest-news.xml`,
    urlEn: `${SITE_URL}/rss/hottest-news-en.xml`,
    icon: '🔥',
  },
  {
    id: 'products',
    titleZh: '免费产品',
    titleEn: 'Free Products',
    descriptionZh: '优质免费软件和工具推荐，发现好用的开源项目',
    descriptionEn: 'Quality free software and tools recommendations',
    urlZh: `${SITE_URL}/rss/products.xml`,
    urlEn: `${SITE_URL}/rss/products-en.xml`,
    icon: '🎁',
  },
];

function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
      title={copied ? 'Copied!' : 'Copy URL'}
    >
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

export function RSSPage() {
  const { language } = useLanguage();
  const isZh = language === 'zh';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-orange-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-orange-950/30">
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white mb-4">
            <Rss className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {isZh ? 'RSS 订阅' : 'RSS Feeds'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            {isZh
              ? '使用RSS阅读器订阅FreeHub的内容更新，支持中英文双语订阅'
              : 'Subscribe to FreeHub content updates using your favorite RSS reader. Available in both Chinese and English.'}
          </p>
        </div>

        {/* How to use */}
        <div className="mb-8 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h2 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            {isZh ? '如何使用?' : 'How to use?'}
          </h2>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {isZh
              ? '复制下方的RSS链接，粘贴到你喜欢的RSS阅读器中即可。推荐使用 Feedly、Inoreader、NetNewsWire 等阅读器。'
              : 'Copy the RSS link below and paste it into your favorite RSS reader. We recommend Feedly, Inoreader, or NetNewsWire.'}
          </p>
        </div>

        {/* RSS Feeds */}
        <div className="space-y-4">
          {rssFeeds.map((feed) => {
            const url = isZh ? feed.urlZh : feed.urlEn;
            return (
              <div
                key={feed.id}
                className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{feed.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {isZh ? feed.titleZh : feed.titleEn}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {isZh ? feed.descriptionZh : feed.descriptionEn}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={url}
                          readOnly
                          className="w-full px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-mono truncate"
                        />
                      </div>
                      <CopyButton url={url} />
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                        title={isZh ? '在新标签页打开' : 'Open in new tab'}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-500">
          <p>
            {isZh
              ? 'RSS订阅源每天自动更新，与网站内容保持同步'
              : 'RSS feeds are automatically updated daily to sync with website content'}
          </p>
        </div>
      </main>
    </div>
  );
}
