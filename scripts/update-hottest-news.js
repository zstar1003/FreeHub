const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// API 数据源配置
const DATA_SOURCES = [
  { id: 'github', name: 'Github' },
  { id: 'hackernews', name: 'Hacker News' },
  { id: 'producthunt', name: 'Product Hunt' },
  { id: 'v2ex', name: 'V2EX' },
  { id: 'zhihu', name: '知乎' },
  { id: 'juejin', name: '稀土掘金' },
  { id: 'sspai', name: '少数派' },
  { id: 'coolapk', name: '酷安' },
  { id: 'wallstreetcn', name: '华尔街见闻' },
  { id: 'cls.cn', name: '财联社' },
  { id: '36kr', name: '36氪' }
];

async function fetchFromAPI(page, sourceConfig) {
  try {
    const apiUrl = `https://newsnow.busiyi.world/api/s?id=${sourceConfig.id}`;
    console.log(`  Fetching: ${apiUrl}`);

    await page.goto(apiUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    const data = await page.evaluate(() => {
      try {
        const bodyText = document.body.textContent;
        return JSON.parse(bodyText);
      } catch (e) {
        return null;
      }
    });

    return data;
  } catch (error) {
    console.error(`  ❌ Failed: ${error.message}`);
    return null;
  }
}

function processNewsItem(item, source) {
  return {
    id: item.id || '',
    title: item.title || '',
    titleZh: item.title || '',
    titleEn: item.title || '',
    url: item.url || '',
    source: source.name,
    publishedAt: new Date().toISOString().split('T')[0],
    category: '热榜',
    hot: item.extra?.info || ''
  };
}

async function main() {
  let browser;

  try {
    console.log('🚀 Launching browser...\n');

    browser = await puppeteer.launch({
      headless: false, // 使用有头模式,更容易绕过检测
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--window-size=1920,1080'
      ]
    });

    const page = await browser.newPage();

    // 设置真实的用户代理
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // 移除webdriver标记
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
    });

    const allNews = [];
    let globalId = 1;

    for (const source of DATA_SOURCES) {
      console.log(`\n📰 Processing ${source.name}...`);

      const data = await fetchFromAPI(page, source);

      if (data && data.items && Array.isArray(data.items)) {
        console.log(`  ✅ Found ${data.items.length} items`);

        data.items.forEach(item => {
          const newsItem = processNewsItem(item, source);
          newsItem.id = globalId++;
          allNews.push(newsItem);
        });
      } else {
        console.log(`  ⚠️  No data available`);
      }

      // 随机延迟,模拟人类行为
      const delay = 2000 + Math.random() * 2000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    await browser.close();

    console.log(`\n\n✅ Total collected: ${allNews.length} items`);

    // 保存数据
    const outputPath = path.join(__dirname, '../public/hottest-news.json');
    fs.writeFileSync(outputPath, JSON.stringify(allNews, null, 2));

    console.log(`💾 Saved to: ${outputPath}`);

    // 统计
    console.log('\n📊 Statistics by source:');
    const stats = {};
    allNews.forEach(item => {
      stats[item.source] = (stats[item.source] || 0) + 1;
    });

    Object.entries(stats).forEach(([source, count]) => {
      console.log(`  ${source}: ${count} items`);
    });

    console.log(`\n🎉 Done! Updated at ${new Date().toISOString().split('T')[0]}`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (browser) {
      await browser.close();
    }
    process.exit(1);
  }
}

main();
