export interface Project {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  summary?: string;
  summaryEn?: string;
  url: string;
  categories: string[]; // 支持多个分类
  tags: string[];
  tagsEn: string[];
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  logo?: string;
}

export type CategoryGroup = '编程语言' | '技术栈' | '应用类型' | '其他';

export const CATEGORY_CONFIG = {
  '编程语言': ['Python', 'Java', 'C++', 'JavaScript', 'Rust', 'Go', 'Swift', 'TypeScript', 'C#', 'C', 'Kotlin', 'PHP', 'Ruby', 'Flutter'],
  '技术栈': ['AI', '算法', '爬虫', '安全', 'Linux', '数据库', '测试', '嵌入式', 'Docker', 'K8s', 'Vue', 'React'],
  '应用类型': ['游戏', '桌面应用', 'Android', 'CLI', 'Web 应用', '效率工具', 'macOS', 'Windows', '自托管'],
  '其他': ['教程', '书籍', '集合', '趣味']
};

export const CATEGORY_CONFIG_EN = {
  'Programming Languages': ['Python', 'Java', 'C++', 'JavaScript', 'Rust', 'Go', 'Swift', 'TypeScript', 'C#', 'C', 'Kotlin', 'PHP', 'Ruby', 'Flutter'],
  'Tech Stack': ['AI', 'Algorithm', 'Crawler', 'Security', 'Linux', 'Database', 'Testing', 'Embedded', 'Docker', 'K8s', 'Vue', 'React'],
  'Application Type': ['Game', 'Desktop', 'Android', 'CLI', 'Web App', 'Productivity', 'macOS', 'Windows', 'Self-hosted'],
  'Others': ['Tutorial', 'Book', 'Collection', 'Fun']
};

export type ProjectCategory = string;

export interface FilterOptions {
  search: string;
  category: string;
  tags: string[];
  status: 'all' | 'pending' | 'approved' | 'rejected';
  sortBy: 'latest' | 'score' | 'popular';
}
