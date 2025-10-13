import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { ProjectCard } from './components/ProjectCard';
import { Project, FilterOptions } from './types';
import { storage } from './utils/storage';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: '',
    tags: [],
    status: 'all',
    sortBy: 'latest',
  });

  // Load projects on mount
  useEffect(() => {
    const loadedProjects = storage.getProjects();
    setProjects(loadedProjects);
  }, []);

  // Filter projects
  const filteredProjects = useMemo(() => {
    let result = projects.filter((project) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          project.name.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower) ||
          project.tags.some((tag) => tag.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category && project.category !== filters.category) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30">
      <Header projectCount={projects.filter((p) => p.status === 'approved').length} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <FilterBar filters={filters} onFilterChange={setFilters} />
            </div>
          </aside>

          {/* Projects Grid */}
          <div className="lg:col-span-3">
            {filteredProjects.length === 0 ? (
              <div className="flex min-h-[400px] items-center justify-center rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 p-8 text-center shadow-sm">
                <div className="animate-fade-in">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-blue-100">
                    <span className="text-3xl">📦</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">暂无项目</p>
                  <p className="mt-2 text-sm text-gray-500">
                    {projects.length === 0
                      ? '还没有项目'
                      : '没有符合筛选条件的项目'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
      </main>
    </div>
  );
}

export default App;
