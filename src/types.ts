export interface Project {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  summary?: string;
  summaryEn?: string;
  url: string;
  category: string;
  tags: string[];
  tagsEn: string[];
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  logo?: string;
}

export type ProjectCategory =
  | 'Developer Tools'
  | 'Design Tools'
  | 'Productivity'
  | 'Education'
  | 'Entertainment'
  | 'Utilities'
  | 'Other';

export interface FilterOptions {
  search: string;
  category: string;
  tags: string[];
  status: 'all' | 'pending' | 'approved' | 'rejected';
  sortBy: 'latest' | 'score' | 'popular';
}
