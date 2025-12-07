import { useLanguage } from '../contexts/LanguageContext';
import { useState, useRef, useEffect } from 'react';
import { ExternalLink, Globe, Code, Palette, Zap, BookOpen, Search, MessageSquare, Sparkles, Image, Video, Cpu, FileText, Briefcase, Boxes, Compass } from 'lucide-react';

interface WebLink {
  name: string;
  nameEn: string;
  url: string;
  description: string;
  descriptionEn: string;
}

interface WebCategory {
  id: string;
  name: string;
  nameEn: string;
  icon: any;
  links: WebLink[];
}

export function WebNavigationPage() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // 获取网站 favicon 的辅助函数
  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return '';
    }
  };

  // 滚动到指定分类
  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = categoryRefs.current[categoryId];
    if (element) {
      const offset = 100; // 顶部偏移量
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // 监听滚动，更新激活的分类
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      for (const categoryId in categoryRefs.current) {
        const element = categoryRefs.current[categoryId];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveCategory(categoryId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 网站分类数据
  const categories: WebCategory[] = [
    {
      id: 'ai-chat',
      name: 'AI 聊天助手',
      nameEn: 'AI Chat Assistants',
      icon: MessageSquare,
      links: [
        { name: 'ChatGPT', nameEn: 'ChatGPT', url: 'https://chat.openai.com', description: 'OpenAI 推出的 AI 聊天机器人', descriptionEn: 'OpenAI\'s AI chatbot' },
        { name: 'Claude', nameEn: 'Claude', url: 'https://claude.ai', description: 'Anthropic 公司的对话式 AI 助手', descriptionEn: 'Anthropic\'s conversational AI assistant' },
        { name: 'Gemini', nameEn: 'Gemini', url: 'https://gemini.google.com', description: 'Google 推出的 AI 聊天对话机器人', descriptionEn: 'Google\'s AI chat assistant' },
        { name: '豆包', nameEn: 'Doubao', url: 'https://www.doubao.com', description: '字节跳动智能对话助手，办公创作全能', descriptionEn: 'ByteDance\'s AI assistant' },
        { name: '腾讯元宝', nameEn: 'Tencent Yuanbao', url: 'https://yuanbao.tencent.com', description: '腾讯推出的免费 AI 智能助手', descriptionEn: 'Tencent\'s free AI assistant' },
        { name: '通义千问', nameEn: 'Tongyi Qianwen', url: 'https://tongyi.aliyun.com', description: '阿里云推出的超大规模语言模型', descriptionEn: 'Alibaba Cloud\'s large language model' }
      ]
    },
    {
      id: 'ai-search',
      name: 'AI 搜索引擎',
      nameEn: 'AI Search Engines',
      icon: Search,
      links: [
        { name: '秘塔AI搜索', nameEn: 'Metaso', url: 'https://metaso.cn', description: '没有广告，直达结果的 AI 搜索工具', descriptionEn: 'Ad-free AI search with direct results' },
        { name: 'Perplexity', nameEn: 'Perplexity', url: 'https://www.perplexity.ai', description: 'AI 搜索引擎与深度研究工具', descriptionEn: 'AI search and research tool' },
        { name: '天工AI搜索', nameEn: 'Tiangong', url: 'https://www.tiangong.cn', description: '昆仑万维的 AI 搜索助手', descriptionEn: 'Kunlun\'s AI search assistant' },
        { name: '360AI搜索', nameEn: '360 AI Search', url: 'https://so.360.com', description: '360推出的AI搜索引擎', descriptionEn: '360\'s AI search engine' },
        { name: '夸克AI', nameEn: 'Quark AI', url: 'https://www.quark.cn', description: '集 AI 搜索、网盘、文档等功能', descriptionEn: 'AI search with cloud storage' }
      ]
    },
    {
      id: 'ai-navigation',
      name: 'AI 导航网站',
      nameEn: 'AI Navigation',
      icon: Compass,
      links: [
        { name: 'AI工具集', nameEn: 'AI-bot', url: 'https://ai-bot.cn', description: '收录国内外数百个AI工具的综合导航平台', descriptionEn: 'Comprehensive AI tools navigation platform' },
        { name: '发现AI', nameEn: 'FaxianAI', url: 'https://www.faxianai.com', description: '专注于AI工具发现和推荐的导航网站', descriptionEn: 'AI tools discovery and recommendation site' },
        { name: '1234.ist', nameEn: '1234.ist', url: 'https://1234.ist', description: 'AI工具和资源聚合导航', descriptionEn: 'AI tools and resources aggregation' }
      ]
    },
    {
      id: 'ai-writing',
      name: 'AI 写作工具',
      nameEn: 'AI Writing Tools',
      icon: FileText,
      links: [
        { name: '讯飞绘文', nameEn: 'iFlytek Writing', url: 'https://www.xfyun.cn', description: '免费 AI 写作工具，5分钟生成原创稿', descriptionEn: 'Free AI writing tool' },
        { name: '笔灵AI写作', nameEn: 'Biling AI', url: 'https://ibiling.cn', description: '面向专业创作领域的 AI 写作工具', descriptionEn: 'Professional AI writing tool' },
        { name: '秘塔写作猫', nameEn: 'Xiezuocat', url: 'https://xiezuocat.com', description: 'AI 写作与文本校对工具', descriptionEn: 'AI writing and proofreading' },
        { name: 'Notion AI', nameEn: 'Notion AI', url: 'https://www.notion.so', description: 'Notion 内置的 AI 写作助手', descriptionEn: 'Built-in AI writing in Notion' },
        { name: 'Jasper', nameEn: 'Jasper', url: 'https://www.jasper.ai', description: '专业的 AI 内容创作平台', descriptionEn: 'Professional AI content platform' }
      ]
    },
    {
      id: 'ai-image',
      name: 'AI 图像工具',
      nameEn: 'AI Image Tools',
      icon: Image,
      links: [
        { name: 'Midjourney', nameEn: 'Midjourney', url: 'https://www.midjourney.com', description: '专业级 AI 插画生成工具', descriptionEn: 'Professional AI illustration tool' },
        { name: 'DALL·E', nameEn: 'DALL·E', url: 'https://openai.com/dall-e', description: 'OpenAI 的 AI 图像生成工具', descriptionEn: 'OpenAI\'s AI image generator' },
        { name: 'Stable Diffusion', nameEn: 'Stable Diffusion', url: 'https://stability.ai', description: '开源的 AI 图像生成模型', descriptionEn: 'Open source AI image model' },
        { name: '即梦', nameEn: 'Jimeng', url: 'https://jimeng.jianying.com', description: '抖音旗下免费 AI 图片创作工具', descriptionEn: 'Free AI image tool by Douyin' },
        { name: '堆友AI', nameEn: 'Tusiart', url: 'https://www.tusiart.com', description: '阿里推出的多风格 AI 绘画生成器', descriptionEn: 'Alibaba\'s AI art generator' },
        { name: 'remove.bg', nameEn: 'remove.bg', url: 'https://www.remove.bg', description: '强大的 AI 图片背景移除工具', descriptionEn: 'AI background removal tool' }
      ]
    },
    {
      id: 'ai-video',
      name: 'AI 视频工具',
      nameEn: 'AI Video Tools',
      icon: Video,
      links: [
        { name: 'Sora', nameEn: 'Sora', url: 'https://openai.com/sora', description: 'OpenAI 推出的 AI 视频生成模型', descriptionEn: 'OpenAI\'s AI video generator' },
        { name: '可灵AI', nameEn: 'Kling AI', url: 'https://klingai.com', description: '快手推出的 AI 视频生成工具', descriptionEn: 'Kuaishou\'s AI video generator' },
        { name: '即梦AI', nameEn: 'Jimeng AI', url: 'https://jimeng.jianying.com', description: '一站式 AI 视频、图片创作工具', descriptionEn: 'All-in-one AI video tool' },
        { name: 'Runway', nameEn: 'Runway', url: 'https://runwayml.com', description: '专业的 AI 视频编辑工具', descriptionEn: 'Professional AI video editor' },
        { name: 'HeyGen', nameEn: 'HeyGen', url: 'https://www.heygen.com', description: '专业的 AI 数字人视频创作平台', descriptionEn: 'AI avatar video platform' }
      ]
    },
    {
      id: 'ai-coding',
      name: 'AI 编程工具',
      nameEn: 'AI Coding Tools',
      icon: Code,
      links: [
        { name: 'GitHub Copilot', nameEn: 'GitHub Copilot', url: 'https://github.com/features/copilot', description: 'GitHub 推出的 AI 编程助手', descriptionEn: 'GitHub\'s AI coding assistant' },
        { name: 'Cursor', nameEn: 'Cursor', url: 'https://cursor.sh', description: 'AI 代码编辑器，快速编程开发', descriptionEn: 'AI code editor for fast development' },
        { name: 'Claude Code', nameEn: 'Claude Code', url: 'https://claude.ai', description: 'Anthropic 推出的 AI 编程工具', descriptionEn: 'Anthropic\'s AI coding tool' },
        { name: '代码小浣熊', nameEn: 'CodeGeeX', url: 'https://codegeex.cn', description: '商汤科技推出的免费 AI 编程助手', descriptionEn: 'Free AI coding assistant' },
        { name: 'Tabnine', nameEn: 'Tabnine', url: 'https://www.tabnine.com', description: 'AI 代码补全工具', descriptionEn: 'AI code completion' },
        { name: 'Replit', nameEn: 'Replit', url: 'https://replit.com', description: '在线 AI 编程环境', descriptionEn: 'Online AI coding environment' }
      ]
    },
    {
      id: 'ai-office',
      name: 'AI 办公工具',
      nameEn: 'AI Office Tools',
      icon: Briefcase,
      links: [
        { name: 'AiPPT', nameEn: 'AiPPT', url: 'https://www.aippt.cn', description: 'AI 快速生成高质量 PPT', descriptionEn: 'AI-powered PPT generator' },
        { name: 'Gamma', nameEn: 'Gamma', url: 'https://gamma.app', description: 'AI 驱动的演示文稿制作工具', descriptionEn: 'AI presentation maker' },
        { name: 'WPS AI', nameEn: 'WPS AI', url: 'https://www.wps.cn', description: 'WPS 办公软件内置的 AI 助手', descriptionEn: 'Built-in AI in WPS Office' },
        { name: '飞书妙记', nameEn: 'Lark Minutes', url: 'https://www.feishu.cn', description: 'AI 会议记录和转写工具', descriptionEn: 'AI meeting transcription' },
        { name: 'Notion AI', nameEn: 'Notion AI', url: 'https://www.notion.so', description: '全能型 AI 协作笔记工具', descriptionEn: 'All-in-one AI workspace' }
      ]
    },
    {
      id: 'ai-dev-platform',
      name: 'AI 开发平台',
      nameEn: 'AI Dev Platforms',
      icon: Boxes,
      links: [
        { name: 'Coze', nameEn: 'Coze', url: 'https://www.coze.com', description: '字节跳动 AI 智能体开发平台', descriptionEn: 'ByteDance\'s AI agent platform' },
        { name: 'Dify', nameEn: 'Dify', url: 'https://dify.ai', description: '开源的生成式 AI 应用开发平台', descriptionEn: 'Open source AI app platform' },
        { name: 'Hugging Face', nameEn: 'Hugging Face', url: 'https://huggingface.co', description: 'AI 模型和数据集分享社区', descriptionEn: 'AI model sharing community' },
        { name: '阿里云百炼', nameEn: 'Aliyun Bailian', url: 'https://www.aliyun.com', description: '一站式大模型开发平台', descriptionEn: 'All-in-one LLM platform' },
        { name: 'FastGPT', nameEn: 'FastGPT', url: 'https://fastgpt.in', description: '免费 AI 工作流搭建工具', descriptionEn: 'Free AI workflow builder' }
      ]
    },
    {
      id: 'dev-resources',
      name: '开发者资源',
      nameEn: 'Developer Resources',
      icon: Cpu,
      links: [
        { name: 'GitHub', nameEn: 'GitHub', url: 'https://github.com', description: '全球最大的代码托管平台', descriptionEn: 'World\'s largest code hosting' },
        { name: 'Stack Overflow', nameEn: 'Stack Overflow', url: 'https://stackoverflow.com', description: '程序员问答社区', descriptionEn: 'Developer Q&A community' },
        { name: 'MDN Web Docs', nameEn: 'MDN Web Docs', url: 'https://developer.mozilla.org', description: 'Web 开发权威文档', descriptionEn: 'Web development docs' },
        { name: 'Vercel', nameEn: 'Vercel', url: 'https://vercel.com', description: '前端应用托管平台', descriptionEn: 'Frontend hosting platform' },
        { name: 'CodePen', nameEn: 'CodePen', url: 'https://codepen.io', description: '前端代码在线编辑器', descriptionEn: 'Online code editor' },
        { name: 'npm', nameEn: 'npm', url: 'https://www.npmjs.com', description: 'Node.js 包管理器', descriptionEn: 'Node.js package manager' }
      ]
    },
    {
      id: 'design-resources',
      name: '设计资源',
      nameEn: 'Design Resources',
      icon: Palette,
      links: [
        { name: 'Figma', nameEn: 'Figma', url: 'https://www.figma.com', description: '在线协作设计工具', descriptionEn: 'Collaborative design tool' },
        { name: 'Dribbble', nameEn: 'Dribbble', url: 'https://dribbble.com', description: '设计师作品分享社区', descriptionEn: 'Designer community' },
        { name: 'Unsplash', nameEn: 'Unsplash', url: 'https://unsplash.com', description: '免费高质量图片库', descriptionEn: 'Free photo library' },
        { name: 'Coolors', nameEn: 'Coolors', url: 'https://coolors.co', description: '配色方案生成器', descriptionEn: 'Color scheme generator' },
        { name: 'iconify', nameEn: 'iconify', url: 'https://iconify.design', description: '海量开源图标库', descriptionEn: 'Massive icon library' },
        { name: 'Behance', nameEn: 'Behance', url: 'https://www.behance.net', description: 'Adobe 设计作品展示平台', descriptionEn: 'Adobe\'s design showcase' }
      ]
    }
  ];

  // 搜索过滤
  const filteredCategories = categories.map(category => {
    if (!searchTerm) return category;

    const filteredLinks = category.links.filter(link => {
      const searchLower = searchTerm.toLowerCase();
      return (
        link.name.toLowerCase().includes(searchLower) ||
        link.nameEn.toLowerCase().includes(searchLower) ||
        link.description.toLowerCase().includes(searchLower) ||
        link.descriptionEn.toLowerCase().includes(searchLower)
      );
    });

    return { ...category, links: filteredLinks };
  }).filter(category => category.links.length > 0);

  const getCategoryName = (category: WebCategory) => {
    return language === 'zh' ? category.name : category.nameEn;
  };

  const getLinkName = (link: WebLink) => {
    return language === 'zh' ? link.name : link.nameEn;
  };

  const getLinkDescription = (link: WebLink) => {
    return language === 'zh' ? link.description : link.descriptionEn;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/30">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 text-white shadow-lg">
              <Globe className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {language === 'zh' ? '网站聚合' : 'Web Navigation'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2">
            {language === 'zh'
              ? '精选优质网站资源，涵盖AI工具、开发平台、设计资源等多个领域'
              : 'Curated quality web resources covering AI tools, dev platforms, design resources and more'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={language === 'zh' ? '搜索网站...' : 'Search websites...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Main Content - Left Sidebar + Right Content */}
        <div className="flex gap-6">
          {/* Left Sidebar Navigation */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <nav className="space-y-1">
                {filteredCategories.map((category) => {
                  const Icon = category.icon;
                  const isActive = activeCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => scrollToCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{getCategoryName(category)}</span>
                      <span className="ml-auto text-xs text-gray-400">{category.links.length}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Right Content */}
          <div className="flex-1 min-w-0">
            {filteredCategories.length === 0 ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-blue-100 dark:from-primary-900/30 dark:to-blue-900/30">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {language === 'zh' ? '未找到相关网站' : 'No websites found'}
                  </p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {language === 'zh' ? '尝试使用不同的关键词搜索' : 'Try searching with different keywords'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                {filteredCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div
                      key={category.id}
                      ref={(el) => (categoryRefs.current[category.id] = el)}
                      className="animate-fade-in-up"
                    >
                      {/* Category Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500 to-blue-600 text-white shadow-md">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          {getCategoryName(category)}
                        </h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700"></div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {category.links.length} {language === 'zh' ? '个网站' : 'sites'}
                        </span>
                      </div>

                      {/* Links Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {category.links.map((link) => (
                          <a
                            key={link.url}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                          >
                            {/* Logo */}
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                              <img
                                src={getFavicon(link.url)}
                                alt={getLinkName(link)}
                                className="w-8 h-8 object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = '<div class="text-2xl">🌐</div>';
                                  }
                                }}
                              />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                                  {getLinkName(link)}
                                </h3>
                                <ExternalLink className="flex-shrink-0 h-3.5 w-3.5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mt-0.5" />
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                {getLinkDescription(link)}
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
