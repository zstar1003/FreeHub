const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://xdxsb.top/FreeHub';
const SITE_TITLE = 'FreeHub';
const SITE_DESCRIPTION = '免费产品聚合平台 - 发现优质免费软件和AI新闻';
const SITE_DESCRIPTION_EN = 'Free Product Aggregation Platform - Discover Quality Free Software and AI News';

// XML转义函数
function escapeXml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// 格式化日期为RFC 822格式
function formatRFC822Date(dateStr) {
  try {
    let date;
    if (dateStr.startsWith('$D')) {
      date = new Date(dateStr.substring(2));
    } else {
      date = new Date(dateStr);
    }
    if (isNaN(date.getTime())) {
      date = new Date();
    }
    return date.toUTCString();
  } catch {
    return new Date().toUTCString();
  }
}

// 生成RSS XML
function generateRSS(options) {
  const {
    title,
    description,
    link,
    feedUrl,
    language,
    items,
  } = options;

  const itemsXml = items.map(item => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.pubDate}</pubDate>
      <guid isPermaLink="true">${escapeXml(item.link)}</guid>
      ${item.source ? `<source url="${escapeXml(item.sourceUrl || item.link)}">${escapeXml(item.source)}</source>` : ''}
      ${item.category ? `<category>${escapeXml(item.category)}</category>` : ''}
    </item>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <description>${escapeXml(description)}</description>
    <link>${escapeXml(link)}</link>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml"/>
    <language>${language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>FreeHub RSS Generator</generator>
${itemsXml}
  </channel>
</rss>`;
}

// 生成AI新闻RSS
function generateAINewsRSS(newsData, lang = 'zh') {
  const isZh = lang === 'zh';
  const items = newsData.slice(0, 50).map(news => ({
    title: isZh ? (news.titleZh || news.title) : (news.titleEn || news.title),
    link: news.url,
    description: isZh ? (news.descriptionZh || news.description) : (news.descriptionEn || news.description),
    pubDate: formatRFC822Date(news.publishedAt),
    source: news.source,
    sourceUrl: news.url,
    category: news.category,
  }));

  return generateRSS({
    title: isZh ? `${SITE_TITLE} - AI新闻` : `${SITE_TITLE} - AI News`,
    description: isZh ? 'AI领域最新资讯，每日更新' : 'Latest AI news, updated daily',
    link: `${SITE_URL}/#/ai-news`,
    feedUrl: `${SITE_URL}/rss/ai-news${isZh ? '' : '-en'}.xml`,
    language: isZh ? 'zh-CN' : 'en-US',
    items,
  });
}

// 生成热门新闻RSS
function generateHottestNewsRSS(newsData, lang = 'zh') {
  const isZh = lang === 'zh';
  const items = newsData.slice(0, 50).map(news => ({
    title: isZh ? (news.titleZh || news.title) : (news.titleEn || news.title),
    link: news.url,
    description: isZh
      ? `${news.descriptionZh || news.description || ''}${news.hot ? ` | 热度: ${news.hot}` : ''}`
      : `${news.descriptionEn || news.description || ''}${news.hot ? ` | Hot: ${news.hot}` : ''}`,
    pubDate: formatRFC822Date(news.publishedAt),
    source: news.source,
    sourceUrl: news.url,
    category: news.category,
  }));

  return generateRSS({
    title: isZh ? `${SITE_TITLE} - 热门资讯` : `${SITE_TITLE} - Hottest News`,
    description: isZh ? '各平台热门资讯聚合' : 'Hot news aggregated from multiple platforms',
    link: `${SITE_URL}/#/hottest`,
    feedUrl: `${SITE_URL}/rss/hottest-news${isZh ? '' : '-en'}.xml`,
    language: isZh ? 'zh-CN' : 'en-US',
    items,
  });
}

// 生成免费产品RSS
function generateProjectsRSS(projectsData, lang = 'zh') {
  const isZh = lang === 'zh';

  // 按提交时间排序
  const sortedProjects = [...projectsData].sort((a, b) =>
    new Date(b.submittedAt) - new Date(a.submittedAt)
  );

  const items = sortedProjects.slice(0, 30).map(project => ({
    title: isZh ? project.name : (project.nameEn || project.name),
    link: project.url,
    description: isZh
      ? `${project.description}\n\n分类: ${project.categories.join(', ')}`
      : `${project.descriptionEn || project.description}\n\nCategories: ${project.categories.join(', ')}`,
    pubDate: formatRFC822Date(project.submittedAt),
    source: project.submittedBy,
    category: project.categories[0],
  }));

  return generateRSS({
    title: isZh ? `${SITE_TITLE} - 免费产品` : `${SITE_TITLE} - Free Products`,
    description: isZh ? '优质免费软件和工具推荐' : 'Quality free software and tools recommendations',
    link: SITE_URL,
    feedUrl: `${SITE_URL}/rss/products${isZh ? '' : '-en'}.xml`,
    language: isZh ? 'zh-CN' : 'en-US',
    items,
  });
}

// 生成全部内容聚合RSS
function generateAllFeedRSS(aiNews, hottestNews, projects, lang = 'zh') {
  const isZh = lang === 'zh';

  // 合并所有内容
  const allItems = [
    ...aiNews.slice(0, 20).map(news => ({
      title: `[AI] ${isZh ? (news.titleZh || news.title) : (news.titleEn || news.title)}`,
      link: news.url,
      description: isZh ? (news.descriptionZh || news.description) : (news.descriptionEn || news.description),
      pubDate: formatRFC822Date(news.publishedAt),
      source: news.source,
      category: 'AI News',
    })),
    ...hottestNews.slice(0, 20).map(news => ({
      title: `[Hot] ${isZh ? (news.titleZh || news.title) : (news.titleEn || news.title)}`,
      link: news.url,
      description: isZh ? (news.descriptionZh || news.description) : (news.descriptionEn || news.description),
      pubDate: formatRFC822Date(news.publishedAt),
      source: news.source,
      category: 'Hottest',
    })),
    ...projects.slice(0, 10).map(project => ({
      title: `[Product] ${isZh ? project.name : (project.nameEn || project.name)}`,
      link: project.url,
      description: isZh ? project.description : (project.descriptionEn || project.description),
      pubDate: formatRFC822Date(project.submittedAt),
      source: project.submittedBy,
      category: 'Products',
    })),
  ];

  // 按日期排序
  allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  return generateRSS({
    title: isZh ? `${SITE_TITLE} - 全部订阅` : `${SITE_TITLE} - All Feed`,
    description: isZh ? 'FreeHub全部内容聚合订阅' : 'FreeHub all content aggregated feed',
    link: SITE_URL,
    feedUrl: `${SITE_URL}/rss/all${isZh ? '' : '-en'}.xml`,
    language: isZh ? 'zh-CN' : 'en-US',
    items: allItems.slice(0, 50),
  });
}

// 主函数
async function main() {
  console.log('开始生成RSS订阅源...');

  const publicDir = path.join(__dirname, '..', 'public');
  const rssDir = path.join(publicDir, 'rss');

  // 创建RSS目录
  if (!fs.existsSync(rssDir)) {
    fs.mkdirSync(rssDir, { recursive: true });
  }

  // 读取数据文件
  let aiNews = [];
  let hottestNews = [];
  let projects = [];

  try {
    aiNews = JSON.parse(fs.readFileSync(path.join(publicDir, 'ai-news.json'), 'utf-8'));
    console.log(`读取 ${aiNews.length} 条AI新闻`);
  } catch (e) {
    console.warn('无法读取AI新闻数据:', e.message);
  }

  try {
    hottestNews = JSON.parse(fs.readFileSync(path.join(publicDir, 'hottest-news.json'), 'utf-8'));
    console.log(`读取 ${hottestNews.length} 条热门新闻`);
  } catch (e) {
    console.warn('无法读取热门新闻数据:', e.message);
  }

  try {
    projects = JSON.parse(fs.readFileSync(path.join(publicDir, 'projects.json'), 'utf-8'));
    console.log(`读取 ${projects.length} 个免费产品`);
  } catch (e) {
    console.warn('无法读取产品数据:', e.message);
  }

  // 生成RSS文件
  const feeds = [
    { name: 'ai-news.xml', content: generateAINewsRSS(aiNews, 'zh') },
    { name: 'ai-news-en.xml', content: generateAINewsRSS(aiNews, 'en') },
    { name: 'hottest-news.xml', content: generateHottestNewsRSS(hottestNews, 'zh') },
    { name: 'hottest-news-en.xml', content: generateHottestNewsRSS(hottestNews, 'en') },
    { name: 'products.xml', content: generateProjectsRSS(projects, 'zh') },
    { name: 'products-en.xml', content: generateProjectsRSS(projects, 'en') },
    { name: 'all.xml', content: generateAllFeedRSS(aiNews, hottestNews, projects, 'zh') },
    { name: 'all-en.xml', content: generateAllFeedRSS(aiNews, hottestNews, projects, 'en') },
  ];

  for (const feed of feeds) {
    const filePath = path.join(rssDir, feed.name);
    fs.writeFileSync(filePath, feed.content, 'utf-8');
    console.log(`✓ 生成: ${feed.name}`);
  }

  console.log('\nRSS订阅源生成完成！');
  console.log('\n可用的订阅源:');
  console.log(`- AI新闻(中文): ${SITE_URL}/rss/ai-news.xml`);
  console.log(`- AI新闻(英文): ${SITE_URL}/rss/ai-news-en.xml`);
  console.log(`- 热门资讯(中文): ${SITE_URL}/rss/hottest-news.xml`);
  console.log(`- 热门资讯(英文): ${SITE_URL}/rss/hottest-news-en.xml`);
  console.log(`- 免费产品(中文): ${SITE_URL}/rss/products.xml`);
  console.log(`- 免费产品(英文): ${SITE_URL}/rss/products-en.xml`);
  console.log(`- 全部内容(中文): ${SITE_URL}/rss/all.xml`);
  console.log(`- 全部内容(英文): ${SITE_URL}/rss/all-en.xml`);
}

main().catch(console.error);
