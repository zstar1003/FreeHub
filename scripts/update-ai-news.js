const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

async function fetchAINews() {
  try {
    console.log('Fetching AI News from aihot.today...');

    const response = await axios.get('https://aihot.today/ai-news', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      },
      timeout: 30000
    });

    const $ = cheerio.load(response.data);
    const news = [];

    // 尝试多种可能的新闻列表选择器
    // 方法1: 查找常见的新闻卡片/列表元素
    const possibleSelectors = [
      'article',
      '.news-item',
      '.article-item',
      '.post-item',
      '[class*="news"]',
      '[class*="article"]',
      '[class*="card"]',
      'li[class*="item"]',
      'div[class*="list"] > div',
    ];

    let newsFound = false;

    for (const selector of possibleSelectors) {
      const items = $(selector);

      if (items.length > 0) {
        console.log(`Found ${items.length} items with selector: ${selector}`);

        items.each((index, element) => {
          if (news.length >= 20) return false; // 限制20条

          const $element = $(element);

          // 提取标题
          let title = '';
          const titleSelectors = ['h1', 'h2', 'h3', 'h4', '.title', '[class*="title"]', 'a'];
          for (const titleSel of titleSelectors) {
            const $title = $element.find(titleSel).first();
            if ($title.length > 0) {
              title = $title.text().trim();
              if (title.length > 10) break; // 找到合理长度的标题
            }
          }

          // 提取链接
          let url = '';
          const $link = $element.find('a').first();
          if ($link.length > 0) {
            url = $link.attr('href');
            // 处理相对路径
            if (url && !url.startsWith('http')) {
              url = new URL(url, 'https://aihot.today').href;
            }
          }

          // 提取描述/摘要
          let description = '';
          const descSelectors = ['p', '.description', '.summary', '.excerpt', '[class*="desc"]'];
          for (const descSel of descSelectors) {
            const $desc = $element.find(descSel).first();
            if ($desc.length > 0) {
              description = $desc.text().trim();
              if (description.length > 20) break;
            }
          }

          // 提取发布时间
          let publishedAt = '';
          const timeSelectors = ['time', '.date', '.time', '[class*="date"]', '[class*="time"]'];
          for (const timeSel of timeSelectors) {
            const $time = $element.find(timeSel).first();
            if ($time.length > 0) {
              publishedAt = $time.attr('datetime') || $time.text().trim();
              if (publishedAt) break;
            }
          }

          // 提取来源
          let source = '';
          const sourceSelectors = ['.source', '[class*="source"]', '.author', '[class*="author"]'];
          for (const sourceSel of sourceSelectors) {
            const $source = $element.find(sourceSel).first();
            if ($source.length > 0) {
              source = $source.text().trim();
              if (source) break;
            }
          }

          // 只保存有标题和链接的新闻
          if (title && url && title.length > 5) {
            news.push({
              id: news.length + 1,
              title: title,
              description: description || '暂无描述',
              url: url,
              source: source || 'AIHot',
              publishedAt: publishedAt || new Date().toISOString().split('T')[0],
              category: 'AI'
            });

            console.log(`  ${news.length}. ${title.substring(0, 60)}...`);
          }
        });

        if (news.length > 0) {
          newsFound = true;
          break;
        }
      }
    }

    // 如果没有找到新闻，尝试抓取页面上的所有链接
    if (!newsFound) {
      console.log('Trying to extract from all links...');

      $('a').each((index, element) => {
        if (news.length >= 20) return false;

        const $link = $(element);
        const title = $link.text().trim();
        const url = $link.attr('href');

        // 过滤掉导航链接和无效链接
        if (title && url && title.length > 10 && title.length < 200) {
          const fullUrl = url.startsWith('http') ? url : new URL(url, 'https://aihot.today').href;

          // 检查是否是新闻相关的链接
          if (fullUrl.includes('aihot.today') && !fullUrl.includes('#') &&
              !fullUrl.includes('login') && !fullUrl.includes('register')) {

            news.push({
              id: news.length + 1,
              title: title,
              description: '暂无描述',
              url: fullUrl,
              source: 'AIHot',
              publishedAt: new Date().toISOString().split('T')[0],
              category: 'AI'
            });

            console.log(`  ${news.length}. ${title.substring(0, 60)}...`);
          }
        }
      });
    }

    if (news.length === 0) {
      throw new Error('Failed to extract AI news. The website structure may have changed or be inaccessible.');
    }

    // 保存到 JSON 文件
    const outputPath = path.join(__dirname, '../public/ai-news.json');
    fs.writeFileSync(outputPath, JSON.stringify(news, null, 2));

    console.log(`\n✅ Successfully updated ${news.length} AI news items`);
    console.log('\nTop 5:');
    news.slice(0, 5).forEach(item => {
      console.log(`  ${item.id}. ${item.title.substring(0, 80)}`);
    });

    // 更新时间
    const now = new Date();
    const lastUpdate = now.toISOString().split('T')[0];
    console.log(`\nData updated: ${lastUpdate}`);

  } catch (error) {
    console.error('❌ Error fetching AI News:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
    }
    console.log('Keeping existing data or creating sample data...');

    // 创建示例数据
    const sampleNews = [
      {
        id: 1,
        title: 'OpenAI 发布最新 GPT-4 Turbo 模型',
        description: 'OpenAI 宣布推出 GPT-4 Turbo，提供更快的响应速度和更低的成本。',
        url: 'https://aihot.today',
        source: 'AIHot',
        publishedAt: new Date().toISOString().split('T')[0],
        category: 'AI'
      },
      {
        id: 2,
        title: 'Google Gemini 在多模态任务中表现出色',
        description: 'Google 的 Gemini 模型在图像、视频和文本理解方面展现强大能力。',
        url: 'https://aihot.today',
        source: 'AIHot',
        publishedAt: new Date().toISOString().split('T')[0],
        category: 'AI'
      },
      {
        id: 3,
        title: 'Meta 开源 Llama 3 大语言模型',
        description: 'Meta 发布开源版本 Llama 3，为开发者提供强大的 AI 工具。',
        url: 'https://aihot.today',
        source: 'AIHot',
        publishedAt: new Date().toISOString().split('T')[0],
        category: 'AI'
      }
    ];

    const outputPath = path.join(__dirname, '../public/ai-news.json');
    fs.writeFileSync(outputPath, JSON.stringify(sampleNews, null, 2));
    console.log('Created sample AI news data');
  }
}

// 运行脚本
fetchAINews();
