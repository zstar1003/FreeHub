import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { ProjectCard } from './components/ProjectCard';
import { SubmitForm } from './components/SubmitForm';
import { SettingsModal, getApiKey } from './components/SettingsModal';
import { Project, SubmitProjectData, FilterOptions } from './types';
import { storage } from './utils/storage';
import { generateId } from './utils/helpers';
import { reviewProject } from './services/aiReview';
import { Loader2 } from 'lucide-react';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: '',
    tags: [],
    status: 'all',
  });
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load projects on mount
  useEffect(() => {
    const loadedProjects = storage.getProjects();
    setProjects(loadedProjects);
  }, []);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
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
  }, [projects, filters]);

  const handleSubmitProject = async (data: SubmitProjectData) => {
    setIsSubmitting(true);
    try {
      const apiKey = getApiKey();

      if (!apiKey) {
        alert('请先在设置中配置 Claude API Key');
        setShowSubmitForm(false);
        setShowSettings(true);
        return;
      }

      // Create new project with pending status
      const newProject: Project = {
        id: generateId(),
        ...data,
        submittedAt: new Date().toISOString(),
        status: 'pending',
      };

      // Get AI review
      try {
        const review = await reviewProject(data, apiKey);
        newProject.status = review.isApproved ? 'approved' : 'rejected';
        newProject.aiReview = {
          score: review.score,
          feedback: review.feedback,
          reviewedAt: new Date().toISOString(),
        };
      } catch (error) {
        console.error('AI review failed:', error);
        alert('AI 审核失败，项目将标记为待审核状态');
      }

      // Save project
      storage.addProject(newProject);
      setProjects([newProject, ...projects]);
      setShowSubmitForm(false);

      alert(
        newProject.status === 'approved'
          ? '项目提交成功并已通过审核！'
          : newProject.status === 'rejected'
          ? '项目已提交但未通过审核。'
          : '项目已提交，等待审核。'
      );
    } catch (error) {
      console.error('Submit error:', error);
      alert('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30">
      <Header
        onSubmitClick={() => setShowSubmitForm(true)}
        onSettingsClick={() => setShowSettings(true)}
        projectCount={projects.filter((p) => p.status === 'approved').length}
      />

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
                      ? '开始提交第一个项目吧！'
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

      {/* Modals */}
      {showSubmitForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <SubmitForm
            onSubmit={handleSubmitProject}
            onClose={() => setShowSubmitForm(false)}
          />
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <SettingsModal onClose={() => setShowSettings(false)} />
        </div>
      )}

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="rounded-xl bg-white p-8 text-center shadow-2xl animate-scale-in">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600" />
            <p className="mt-4 text-lg font-semibold text-gray-900">AI 审核中...</p>
            <p className="mt-2 text-sm text-gray-600">这可能需要几秒钟</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
