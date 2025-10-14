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
      },
      timeout: 30000
    });

    const $ = cheerio.load(response.data);
    const rankings = [];

    // 尝试多种可能的表格选择器
    let tableFound = false;

    // 方法1: 寻找包含 "Programming Language" 的表格
    $('table').each((i, table) => {
      const $table = $(table);
      const headerText = $table.find('thead, tr:first-child').text();

      if (headerText.includes('Programming Language') || headerText.includes('Language') || headerText.includes('Ratings')) {
        console.log(`Found potential ranking table (method 1, table ${i})`);

        $table.find('tbody tr, tr').each((index, row) => {
          if (rankings.length >= 20) return false;

          const $row = $(row);
          const cells = $row.find('td');

          // 跳过表头
          if (cells.length === 0 || $row.find('th').length > 0) return;

          // 尝试解析数据（假设列顺序：排名, 上月排名, 变化, 语言, 评分）
          let rank, prevRank, language, rating;

          // 遍历所有单元格寻找数据
          cells.each((idx, cell) => {
            const text = $(cell).text().trim();

            // 识别排名（纯数字，1-20之间）
            if (!rank && /^\d+$/.test(text)) {
              const num = parseInt(text);
              if (num >= 1 && num <= 20) {
                rank = num;
              }
            }

            // 识别语言名称（包含字母，不是纯数字）
            if (!language && text.length > 1 && /[a-zA-Z]/.test(text) && !text.includes('%')) {
              // 排除一些常见的非语言文本
              if (!['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].includes(text)) {
                language = text;
              }
            }

            // 识别评分（包含%或小数点）
            if (!rating && (text.includes('%') || /^\d+\.\d+$/.test(text))) {
              const numText = text.replace('%', '').trim();
              const num = parseFloat(numText);
              if (!isNaN(num) && num > 0 && num < 100) {
                rating = num;
              }
            }
          });

          // 如果缺少上月排名，使用当前排名
          if (!prevRank && rank) {
            prevRank = rank;
          }

          if (rank && language && rating) {
            rankings.push({
              rank,
              prevRank: prevRank || rank,
              language,
              rating,
              change: (prevRank || rank) - rank
            });

            console.log(`  ${rank}. ${language} - ${rating}%`);
          }
        });

        if (rankings.length > 0) {
          tableFound = true;
          return false; // 找到数据后退出
        }
      }
    });

    // 方法2: 如果方法1失败，尝试查找 id 或 class 包含 "top" 的表格
    if (!tableFound) {
      console.log('Trying method 2: searching for tables with "top" in id/class...');

      $('table[id*="top"], table[class*="top"], table[id*="index"], table[class*="index"]').each((i, table) => {
        const $table = $(table);
        console.log(`Found table with id/class: ${$table.attr('id')} / ${$table.attr('class')}`);

        $table.find('tr').slice(1).each((index, row) => {
          if (rankings.length >= 20) return false;

          const $row = $(row);
          const cells = $row.find('td');

          if (cells.length >= 3) {
            let rank = index + 1;
            let language = '';
            let rating = 0;

            // 遍历单元格寻找语言名称和评分
            cells.each((idx, cell) => {
              const text = $(cell).text().trim();

              if (!language && text.length > 1 && /[a-zA-Z]/.test(text) && !text.includes('%')) {
                language = text;
              }

              if (text.includes('%') || /^\d+\.\d+$/.test(text)) {
                const num = parseFloat(text.replace('%', ''));
                if (!isNaN(num) && num > 0) {
                  rating = num;
                }
              }
            });

            if (language && rating > 0) {
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
          tableFound = true;
          return false;
        }
      });
    }

    if (rankings.length === 0) {
      throw new Error('Failed to parse rankings data from TIOBE website. The website structure may have changed.');
    }

    // 保存到 JSON 文件
    const outputPath = path.join(__dirname, '../public/rankings.json');
    fs.writeFileSync(outputPath, JSON.stringify(rankings, null, 2));

    console.log(`\n✅ Successfully updated ${rankings.length} rankings`);
    console.log('\nTop 5:');
    rankings.slice(0, 5).forEach(r => {
      console.log(`  ${r.rank}. ${r.language} - ${r.rating}%`);
    });

    // 更新时间
    const now = new Date();
    const lastUpdate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    console.log(`\nData updated: ${lastUpdate}`);

  } catch (error) {
    console.error('❌ Error fetching TIOBE rankings:', error.message);
    console.log('Keeping existing data...');
    process.exit(1);
  }
}

// 运行脚本
fetchTIOBERankings();
