import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { ProjectCard } from './components/ProjectCard';
import { RankingPage } from './components/RankingPage';
import { AINewsPage } from './components/AINewsPage';
import { WishPoolPage } from './components/WishPoolPage';
import { Project, FilterOptions } from './types';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

function AppContent() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeMenu, setActiveMenu] = useState('home');
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: '',
    tags: [],
    status: 'all',
    sortBy: 'latest',
  });
  const [loading, setLoading] = useState(true);

  // Load projects from JSON file
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}projects.json`);
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Filter projects
  const filteredProjects = useMemo(() => {
    let result = projects.filter((project) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          project.name.toLowerCase().includes(searchLower) ||
          project.nameEn.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower) ||
          project.descriptionEn.toLowerCase().includes(searchLower) ||
          project.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
          project.tagsEn.some((tag) => tag.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category && !project.categories.includes(filters.category)) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all' && project.status !== filters.status) {
        return false;
      }

      return true;
    });

    // Sort projects
    result.sort((a, b) => {
      // Always sort by latest (submission date)
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });

    return result;
  }, [projects, filters]);

  return (
    <>
      <Header
        projectCount={projects.filter((p) => p.status === 'approved').length}
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
      />

      {activeMenu === 'trending' ? (
        <RankingPage />
      ) : activeMenu === 'articles' ? (
        <AINewsPage />
      ) : activeMenu === 'wishpool' ? (
        <WishPoolPage />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/30">
          <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="animate-fade-in">
                  <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.common.loading}</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-[280px_1fr]">
                {/* Sidebar */}
                <aside className="w-full min-w-0">
                  <div className="lg:sticky lg:top-24 w-full min-w-0">
                    <FilterBar filters={filters} onFilterChange={setFilters} />
                  </div>
                </aside>

                {/* Projects Grid */}
                <div className="w-full min-w-0">
                  {filteredProjects.length === 0 ? (
                    <div className="flex min-h-[400px] items-center justify-center rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 text-center shadow-sm">
                      <div className="animate-fade-in">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-blue-100 dark:from-primary-900/30 dark:to-blue-900/30">
                          <span className="text-3xl">📦</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t.common.noProjects}</p>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {projects.length === 0
                            ? t.common.noProjectsYet
                            : t.common.noMatchingProjects}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {filteredProjects.map((project, index) => (
                        <div
                          key={project.id}
                          className="animate-fade-in-up"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <ProjectCard project={project} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
