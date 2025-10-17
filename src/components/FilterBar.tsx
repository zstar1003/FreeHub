import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { FilterOptions, CATEGORY_CONFIG, CATEGORY_CONFIG_EN, CategoryGroup } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useState } from 'react';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const { t, language } = useLanguage();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const categoryConfig = language === 'zh' ? CATEGORY_CONFIG : CATEGORY_CONFIG_EN;
  const categoryGroups = Object.keys(categoryConfig) as CategoryGroup[];

  const toggleGroup = (group: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(group)) {
      newExpanded.delete(group);
    } else {
      newExpanded.add(group);
    }
    setExpandedGroups(newExpanded);
  };

  const isExpanded = (group: string) => expandedGroups.has(group);

  return (
    <div className="space-y-4 w-full min-w-0">
      {/* Search Bar */}
      <div className="relative w-full min-w-0">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
        <input
          type="text"
          placeholder={t.filter.search}
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="w-full min-w-0 rounded-lg border border-gray-300 dark:border-gray-600 py-2.5 pl-10 pr-4 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 transition-colors box-border"
        />
      </div>

      {/* Category Filter */}
      <div className="rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="relative p-4 pb-2">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 text-center">{t.filter.category}</h3>
          {filters.category && (
            <button
              onClick={() => onFilterChange({ ...filters, category: '' })}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-primary-600 dark:text-primary-400 hover:underline whitespace-nowrap"
            >
              {language === 'zh' ? '清除' : 'Clear'}
            </button>
          )}
        </div>

        <div className="max-h-[calc(100vh-24rem)] md:max-h-[calc(100vh-20rem)] overflow-y-auto scrollbar-custom px-4 pb-4">
          <div className="space-y-2">
            {categoryGroups.map((group) => (
              <div key={group} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0 pb-2 last:pb-0">
                <button
                  onClick={() => toggleGroup(group)}
                  className="w-full flex items-center justify-between py-2 px-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md transition-colors"
                >
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{group}</span>
                  {isExpanded(group) ? (
                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  )}
                </button>

                {isExpanded(group) && (
                  <div className="mt-1 space-y-0.5 pl-2 animate-fade-in">
                    {(categoryConfig[group as keyof typeof categoryConfig] as string[] | undefined)?.map((cat: string) => (
                      <button
                        key={cat}
                        onClick={() => onFilterChange({ ...filters, category: filters.category === cat ? '' : cat })}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all ${
                          filters.category === cat
                            ? 'bg-primary-600 dark:bg-primary-500 text-white shadow-sm'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
