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
  aiReview?: {
    score: number;
    feedback: string;
    reviewedAt: string;
  };
  logo?: string;
}

export interface SubmitProjectData {
  name: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  submittedBy: string;
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
}
