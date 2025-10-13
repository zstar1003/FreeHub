import { Search } from 'lucide-react';
import { FilterOptions, ProjectCategory } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const { t } = useLanguage();

  const CATEGORIES: { value: ProjectCategory | '', label: string }[] = [
    { value: '', label: t.filter.all },
    { value: 'Developer Tools', label: t.filter.developerTools },
    { value: 'Design Tools', label: t.filter.designTools },
    { value: 'Productivity', label: t.filter.productivity },
    { value: 'Education', label: t.filter.education },
    { value: 'Entertainment', label: t.filter.entertainment },
    { value: 'Utilities', label: t.filter.utilities },
    { value: 'Other', label: t.filter.other },
  ];
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder={t.filter.search}
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 py-2.5 pl-10 pr-4 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 transition-colors"
        />
      </div>

      {/* Category Filter */}
      <div className="rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">{t.filter.category}</h3>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onFilterChange({ ...filters, category: cat.value })}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all ${
                filters.category === cat.value
                  ? 'bg-primary-600 dark:bg-primary-500 text-white shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
