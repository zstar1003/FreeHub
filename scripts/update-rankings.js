const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

async function fetchTIOBERankings() {
  try {
    console.log('Fetching TIOBE rankings...');

    const response = await axios.get('https://www.tiobe.com/tiobe-index/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const rankings = [];

    // TIOBE 网站的表格通常在 .table 或特定的表格选择器中
    // 这里需要根据实际的 HTML 结构调整选择器
    $('table.table-top20 tbody tr, table#top20 tbody tr, table tbody tr').slice(0, 20).each((index, element) => {
      const $row = $(element);
      const cells = $row.find('td');

      if (cells.length >= 5) {
        const rank = parseInt($(cells[0]).text().trim()) || index + 1;
        const prevRank = parseInt($(cells[1]).text().trim()) || rank;
        const language = $(cells[3]).text().trim() || $(cells[2]).text().trim();
        const ratingText = $(cells[4]).text().trim() || $(cells[3]).text().trim();
        const rating = parseFloat(ratingText.replace('%', '')) || 0;

        if (language && rating > 0) {
          rankings.push({
            rank,
            prevRank,
            language,
            rating,
            change: prevRank - rank
          });
        }
      }
    });

    // 如果解析失败，使用备用方法
    if (rankings.length === 0) {
      console.log('Primary parsing failed, trying alternative method...');

      // 尝试其他可能的选择器
      $('table').each((i, table) => {
        const $table = $(table);
        const rows = $table.find('tr').slice(1, 21); // 跳过表头，获取前20行

        rows.each((index, row) => {
          const $row = $(row);
          const cells = $row.find('td');

          if (cells.length >= 3 && rankings.length < 20) {
            const rank = index + 1;
            const language = $(cells[2]).text().trim() || $(cells[1]).text().trim();
            const ratingText = $(cells[cells.length - 1]).text().trim();
            const rating = parseFloat(ratingText.replace('%', ''));

            if (language && !isNaN(rating)) {
              rankings.push({
                rank,
                prevRank: rank,
                language,
                rating,
                change: 0
              });
            }
          }
        });

        if (rankings.length > 0) {
          return false; // 找到数据后退出循环
        }
      });
    }

    if (rankings.length === 0) {
      throw new Error('Failed to parse rankings data from TIOBE website');
    }

    // 保存到 JSON 文件
    const outputPath = path.join(__dirname, '../public/rankings.json');
    fs.writeFileSync(outputPath, JSON.stringify(rankings, null, 2));

    console.log(`✅ Successfully updated ${rankings.length} rankings`);
    console.log('Top 5:');
    rankings.slice(0, 5).forEach(r => {
      console.log(`  ${r.rank}. ${r.language} - ${r.rating}%`);
    });

    // 更新 lastUpdate 时间
    const now = new Date();
    const lastUpdate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    console.log(`\nData updated: ${lastUpdate}`);
    console.log('\n⚠️  Remember to update lastUpdate variable in RankingPage.tsx');

  } catch (error) {
    console.error('❌ Error fetching TIOBE rankings:', error.message);

    // 如果抓取失败，保持原数据不变
    console.log('Keeping existing data...');
    process.exit(1);
  }
}

// 运行脚本
fetchTIOBERankings();
