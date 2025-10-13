export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
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
