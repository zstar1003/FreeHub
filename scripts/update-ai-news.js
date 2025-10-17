const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// 检测文本语言（简单判断）
function detectLanguage(text) {
  // 如果包含中文字符，认为是中文
  const chineseRegex = /[\u4e00-\u9fa5]/;
  return chineseRegex.test(text) ? 'zh' : 'en';
}

// 使用Google翻译API进行翻译（免费版）
async function translateText(text, fromLang, toLang) {
  try {
    const url = 'https://translate.googleapis.com/translate_a/single';
    const params = new URLSearchParams({
      client: 'gtx',
      sl: fromLang === 'zh-Hans' ? 'zh-CN' : fromLang,
      tl: toLang === 'zh-Hans' ? 'zh-CN' : toLang,
      dt: 't',
      q: text
    });

    const response = await fetch(`${url}?${params}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.status}`);
    }

    const data = await response.json();

    // Google翻译API返回的数据结构: [[["translated text", "original text", ...]]]
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      return data[0][0][0];
    }

    return text;
  } catch (error) {
    console.warn(`Translation error: ${error.message}`);
    return text; // 翻译失败时返回原文
  }
}

// 批量延迟，避免API限流
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 翻译新闻项
async function translateNewsItem(item, index, total) {
  console.log(`  Translating ${index + 1}/${total}: ${item.title.substring(0, 40)}...`);

  const titleLang = detectLanguage(item.title);
  const descLang = detectLanguage(item.description);

  let titleZh = item.title;
  let titleEn = item.title;
  let descZh = item.description;
  let descEn = item.description;

  try {
    // 翻译标题
    if (titleLang === 'zh') {
      titleEn = await translateText(item.title, 'zh-Hans', 'en');
      await delay(500); // 避免请求过快
    } else {
      titleZh = await translateText(item.title, 'en', 'zh-Hans');
      await delay(500);
    }

    // 翻译描述
    if (descLang === 'zh') {
      descEn = await translateText(item.description, 'zh-Hans', 'en');
      await delay(500);
    } else {
      descZh = await translateText(item.description, 'en', 'zh-Hans');
      await delay(500);
    }
  } catch (error) {
    console.warn(`  Translation failed for item ${index + 1}, using original text`);
  }

  return {
    ...item,
    titleZh,
    titleEn,
    descriptionZh: descZh,
    descriptionEn: descEn,
    // 保留原始字段以兼容
    title: titleZh,
    description: descZh
  };
}

async function fetchAINews() {
  let browser;

  try {
    console.log('Launching browser...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log('Fetching AI News from aihot.today...');
    await page.goto('https://aihot.today/ai-news', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('Extracting news data from HTML...');

    // 获取完整的HTML内容
    const htmlContent = await page.content();

    // 从HTML中提取包含initialNewsData的部分
    // 注意：HTML中的引号是转义的 \"
    const newsDataMatch = htmlContent.match(/\\"initialNewsData\\":\[([\s\S]+?)\],\\"dataSources\\"/);


    if (!newsDataMatch) {
      throw new Error('Could not find initialNewsData in HTML');
    }

    let rawDataString = newsDataMatch[1];

    // 处理转义：HTML中字符串内的引号是 \\\" (3个反斜杠+引号)
    // JSON结构的引号是 \" (1个反斜杠+引号)
    const placeholder = '___ESCAPED_QUOTE___';
    const jsonString = '[' + rawDataString
      .replace(/\\\\\\\"/g, placeholder)  // 先将 \\\" (3个反斜杠) 替换为占位符
      .replace(/\\"/g, '"')                // 再将 \" (1个反斜杠) 替换为 "
      .replace(new RegExp(placeholder, 'g'), '\\"')  // 最后将占位符还原为 \"
      + ']';

    console.log('Parsing JSON data...');
    const parsedData = JSON.parse(jsonString);

    if (!parsedData || parsedData.length === 0) {
      throw new Error('No news items found in parsed data');
    }

    console.log(`Found ${parsedData.length} news items`);

    // 提取所有新闻项
    const newsItems = [];
    for (let i = 0; i < parsedData.length; i++) {
      const item = parsedData[i];

      newsItems.push({
        id: i + 1,
        title: item.title_trans || item.title,
        description: item.des_trans || item.des || '查看详情了解更多信息',
        url: item.link || 'https://aihot.today',
        source: item.sources || 'AIHot',
        publishedAt: item.published_at ? item.published_at.split('T')[0] : new Date().toISOString().split('T')[0],
        category: item.tag || 'AI'
      });
    }

    await browser.close();

    if (newsItems.length === 0) {
      throw new Error('No news items could be parsed');
    }

    // 翻译所有新闻项为双语
    console.log('\nTranslating news items to bilingual...');
    const translatedItems = [];
    for (let i = 0; i < newsItems.length; i++) {
      const translated = await translateNewsItem(newsItems[i], i, newsItems.length);
      translatedItems.push(translated);
    }

    // 保存到JSON文件
    const outputPath = path.join(__dirname, '../public/ai-news.json');
    fs.writeFileSync(outputPath, JSON.stringify(translatedItems, null, 2));

    console.log(`\n✅ Successfully updated ${translatedItems.length} AI news items with bilingual support`);
    console.log('\nTop 5:');
    translatedItems.slice(0, 5).forEach(item => {
      console.log(`  ${item.id}. [ZH] ${item.titleZh.substring(0, 60)}...`);
      console.log(`      [EN] ${item.titleEn.substring(0, 60)}...`);
      console.log(`     URL: ${item.url.substring(0, 80)}`);
    });

    const now = new Date();
    const lastUpdate = now.toISOString().split('T')[0];
    console.log(`\nData updated: ${lastUpdate}`);

  } catch (error) {
    console.error('❌ Error fetching AI News:', error.message);

    if (browser) {
      await browser.close();
    }

    // 使用示例数据作为后备
    console.log('Creating fallback sample data...');
    const sampleNews = [
      {
        id: 1,
        title: 'OpenAI 发布 GPT-4 Turbo，性能提升成本降低',
        description: 'OpenAI 宣布推出 GPT-4 Turbo 模型，提供更快的响应速度、更大的上下文窗口，同时价格降低了 3 倍。',
        url: 'https://aihot.today',
        source: 'AIHot',
        publishedAt: new Date().toISOString().split('T')[0],
        category: '大模型'
      },
      {
        id: 2,
        title: 'Google Gemini Ultra 在多模态理解上表现出色',
        description: 'Google 最新发布的 Gemini Ultra 模型在图像、视频和文本理解等多模态任务中表现出色。',
        url: 'https://aihot.today',
        source: 'AIHot',
        publishedAt: new Date().toISOString().split('T')[0],
        category: '大模型'
      },
      {
        id: 3,
        title: 'Meta 开源 Llama 3 大语言模型',
        description: 'Meta 发布开源版本 Llama 3，参数规模达 70B，性能媲美闭源商业模型。',
        url: 'https://aihot.today',
        source: 'AIHot',
        publishedAt: new Date().toISOString().split('T')[0],
        category: '开源'
      },
      {
        id: 4,
        title: 'Anthropic Claude 3 推出视觉能力',
        description: 'Anthropic 为 Claude 3 增加了图像理解能力，可以分析图表、文档和照片。',
        url: 'https://aihot.today',
        source: 'AIHot',
        publishedAt: new Date().toISOString().split('T')[0],
        category: '产品'
      },
      {
        id: 5,
        title: 'Stability AI 推出视频生成模型 Stable Video',
        description: 'Stability AI 发布 Stable Video Diffusion 模型，可以从单张图片生成高质量视频。',
        url: 'https://aihot.today',
        source: 'AIHot',
        publishedAt: new Date().toISOString().split('T')[0],
        category: '视频生成'
      },
      {
        id: 6,
        title: '微软推出 Copilot Pro 订阅服务',
        description: '微软宣布推出 Copilot Pro 高级订阅，每月 20 美元，提供更快的 GPT-4 Turbo 访问。',
        url: 'https://aihot.today',
        source: 'AIHot',
        publishedAt: new Date().toISOString().split('T')[0],
        category: '产品'
      },
      {
        id: 7,
        title: 'OpenAI 推出定制化 GPTs 应用商店',
        description: 'OpenAI 发布 GPT Store，允许用户创建和分享定制化的 AI 应用。',
        url: 'https://aihot.today',
        source: 'AIHot',
        publishedAt: new Date().toISOString().split('T')[0],
        category: '平台'
      },
      {
        id: 8,
        title: '百度文心一言 4.0 发布，中文能力显著提升',
        description: '百度发布文心一言 4.0 版本，在中文理解、生成和推理能力上有显著提升。',
        url: 'https://aihot.today',
        source: 'AIHot',
        publishedAt: new Date().toISOString().split('T')[0],
        category: '国产'
      },
      {
        id: 9,
        title: 'Midjourney V6 发布，图像生成更加真实',
        description: 'Midjourney 推出 V6 版本，在图像真实感、细节表现和文字渲染方面有重大突破。',
        url: 'https://aihot.today',
        source: 'AIHot',
        publishedAt: new Date().toISOString().split('T')[0],
        category: '图像生成'
      },
      {
        id: 10,
        title: 'DeepMind 发布 AlphaGeometry 数学推理 AI',
        description: 'DeepMind 推出 AlphaGeometry，在国际数学奥林匹克竞赛几何题目上达到金牌水平。',
        url: 'https://aihot.today',
        source: 'AIHot',
        publishedAt: new Date().toISOString().split('T')[0],
        category: '研究'
      }
    ];

    const outputPath = path.join(__dirname, '../public/ai-news.json');
    fs.writeFileSync(outputPath, JSON.stringify(sampleNews, null, 2));
    console.log('Created sample AI news data with 10 items');
  }
}

// 运行脚本
fetchAINews();
