export type Language = 'zh' | 'en';

export interface Translations {
  header: {
    home: string;
    trending: string;
    articles: string;
    hottest: string;
    wishpool: string;
    about: string;
    projectCount: string;
    projects: string;
  };
  filter: {
    search: string;
    category: string;
    all: string;
    developerTools: string;
    designTools: string;
    productivity: string;
    education: string;
    entertainment: string;
    utilities: string;
    other: string;
  };
  project: {
    visit: string;
    author: string;
  };
  common: {
    loading: string;
    noProjects: string;
    noProjectsYet: string;
    noMatchingProjects: string;
  };
}

export const translations: Record<Language, Translations> = {
  zh: {
    header: {
      home: '首页',
      trending: '榜单',
      articles: 'AI 新闻',
      hottest: '科技热榜',
      wishpool: '许愿池',
      about: '关于',
      projectCount: '已收录',
      projects: '个项目',
    },
    filter: {
      search: '搜索项目...',
      category: '分类',
      all: '全部',
      developerTools: '开发工具',
      designTools: '设计工具',
      productivity: '效率工具',
      education: '教育学习',
      entertainment: '娱乐休闲',
      utilities: '实用工具',
      other: '其他',
    },
    project: {
      visit: '访问项目',
      author: '作者',
    },
    common: {
      loading: '加载中...',
      noProjects: '暂无项目',
      noProjectsYet: '还没有项目',
      noMatchingProjects: '没有符合筛选条件的项目',
    },
  },
  en: {
    header: {
      home: 'Home',
      trending: 'Rankings',
      articles: 'AI News',
      hottest: 'Tech Trending',
      wishpool: 'Wish Pool',
      about: 'About',
      projectCount: 'Total',
      projects: 'Projects',
    },
    filter: {
      search: 'Search projects...',
      category: 'Category',
      all: 'All',
      developerTools: 'Developer Tools',
      designTools: 'Design Tools',
      productivity: 'Productivity',
      education: 'Education',
      entertainment: 'Entertainment',
      utilities: 'Utilities',
      other: 'Other',
    },
    project: {
      visit: 'Visit Project',
      author: 'Author',
    },
    common: {
      loading: 'Loading...',
      noProjects: 'No Projects',
      noProjectsYet: 'No projects yet',
      noMatchingProjects: 'No projects match the filter criteria',
    },
  },
};

export function getTranslations(lang: Language): Translations {
  return translations[lang];
}
