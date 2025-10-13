import { Project } from '../types';
import { ExternalLink, Calendar, Tag, CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatDate, cn } from '../utils/helpers';

interface ProjectCardProps {
  project: Project;
  onView?: (project: Project) => void;
}

export function ProjectCard({ project, onView }: ProjectCardProps) {
  const statusConfig = {
    approved: {
      icon: CheckCircle,
      text: '已批准',
      className: 'bg-green-100 text-green-800',
    },
    rejected: {
      icon: XCircle,
      text: '已拒绝',
      className: 'bg-red-100 text-red-800',
    },
    pending: {
      icon: Clock,
      text: '审核中',
      className: 'bg-yellow-100 text-yellow-800',
    },
  };

  const status = statusConfig[project.status];
  const StatusIcon = status.icon;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg">
      {/* Status Badge */}
      <div className="absolute right-4 top-4">
        <span className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium', status.className)}>
          <StatusIcon className="h-3 w-3" />
          {status.text}
        </span>
      </div>

      {/* Logo */}
      {project.logo && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100">
          <img src={project.logo} alt={project.name} className="h-12 w-12 object-contain" />
        </div>
      )}

      {/* Project Info */}
      <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-primary-600">
        {project.name}
      </h3>

      <p className="mb-4 line-clamp-2 text-sm text-gray-600">
        {project.description}
      </p>

      {/* Category */}
      <div className="mb-3 inline-flex items-center gap-1 rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700">
        <Tag className="h-3 w-3" />
        {project.category}
      </div>

      {/* Tags */}
      {project.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700">
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* AI Review Score */}
      {project.aiReview && (
        <div className="mb-4 rounded-lg bg-gray-50 p-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">AI 评分</span>
            <span className={cn(
              'text-sm font-bold',
              project.aiReview.score >= 80 ? 'text-green-600' :
              project.aiReview.score >= 60 ? 'text-yellow-600' :
              'text-red-600'
            )}>
              {project.aiReview.score}/100
            </span>
          </div>
          <p className="line-clamp-2 text-xs text-gray-600">{project.aiReview.feedback}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar className="h-3 w-3" />
          {formatDate(project.submittedAt)}
        </div>

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
          onClick={(e) => e.stopPropagation()}
        >
          访问项目
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
