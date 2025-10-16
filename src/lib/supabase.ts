import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration is missing. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// 数据库类型定义
export interface Wish {
  id: string;
  feature_request: string;
  similar_product?: string;
  submitter: string;
  status: 'pending' | 'approved' | 'rejected';
  is_implemented: boolean;
  created_at: string;
  updated_at: string;
}

export interface WishInsert {
  feature_request: string;
  similar_product?: string;
  submitter?: string;
}
