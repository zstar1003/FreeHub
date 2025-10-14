const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

async function fetchGitHubTrending() {
  try {
    console.log('Fetching GitHub Trending repositories...');

    const response = await axios.get('https://github.com/trending', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      timeout: 30000
    });

    const $ = cheerio.load(response.data);
    const trending = [];

    // GitHub Trending 使用 article 标签包装每个仓库
    $('article.Box-row').each((index, element) => {
      if (index >= 10) return false; // 只取前10个

      const $article = $(element);

      // 获取仓库名称
      const $repoLink = $article.find('h2 a');
      const repoName = $repoLink.attr('href')?.replace(/^\//, '') || '';
      const url = `https://github.com${$repoLink.attr('href')}`;

      // 获取描述
      const description = $article.find('p.col-9').text().trim() || 'No description available';

      // 获取编程语言
      const language = $article.find('[itemprop="programmingLanguage"]').text().trim() || 'Unknown';

      // 获取 Stars 数量
      const starsText = $article.find('svg.octicon-star').parent().text().trim();
      const stars = parseStarCount(starsText);

      // 获取 Forks 数量
      const forksText = $article.find('svg.octicon-repo-forked').parent().text().trim();
      const forks = parseStarCount(forksText);

      // 获取今日新增 Stars
      const todayStarsText = $article.find('span.d-inline-block.float-sm-right').text().trim();
      const todayStars = parseStarCount(todayStarsText);

      if (repoName && url) {
        trending.push({
          rank: index + 1,
          name: repoName,
          description: description,
          language: language,
          stars: stars,
          forks: forks,
          todayStars: todayStars,
          url: url
        });

        console.log(`  ${index + 1}. ${repoName} (${language}) - ⭐ ${stars.toLocaleString()} | Today: +${todayStars.toLocaleString()}`);
      }
    });

    if (trending.length === 0) {
      throw new Error('Failed to parse trending repositories. The website structure may have changed.');
    }

    // 保存到 JSON 文件
    const outputPath = path.join(__dirname, '../public/github-trending.json');
    fs.writeFileSync(outputPath, JSON.stringify(trending, null, 2));

    console.log(`\n✅ Successfully updated ${trending.length} trending repositories`);
    console.log('\nTop 5:');
    trending.slice(0, 5).forEach(r => {
      console.log(`  ${r.rank}. ${r.name} - ⭐ ${r.stars.toLocaleString()} (Today: +${r.todayStars.toLocaleString()})`);
    });

    // 更新时间
    const now = new Date();
    const lastUpdate = now.toISOString().split('T')[0];
    console.log(`\nData updated: ${lastUpdate}`);

  } catch (error) {
    console.error('❌ Error fetching GitHub Trending:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
    console.log('Keeping existing data...');
    process.exit(1);
  }
}

// 解析 Star/Fork 数量（处理 k 和 M 等单位）
function parseStarCount(text) {
  if (!text) return 0;

  const cleaned = text.replace(/,/g, '').trim();
  const match = cleaned.match(/([\d.]+)\s*([kKmM]?)/);

  if (!match) return 0;

  const num = parseFloat(match[1]);
  const unit = match[2].toLowerCase();

  if (unit === 'k') return Math.round(num * 1000);
  if (unit === 'm') return Math.round(num * 1000000);
  return Math.round(num);
}

// 运行脚本
fetchGitHubTrending();
