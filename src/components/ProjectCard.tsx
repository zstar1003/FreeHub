import { Project } from '../types';
import { ExternalLink, Calendar, Tag, Star, TrendingUp } from 'lucide-react';
import { formatDate, cn } from '../utils/helpers';

interface ProjectCardProps {
  project: Project;
  onView?: (project: Project) => void;
}

export function ProjectCard({ project, onView }: ProjectCardProps) {
  const statusColors = {
    approved: 'bg-success-50 text-success-700 border-success-200',
    rejected: 'bg-accent-50 text-accent-700 border-accent-200',
    pending: 'bg-warning-50 text-warning-700 border-warning-200',
  };

  return (
    <article className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-primary-300">
      {/* Content */}
      <div className="p-5">
        {/* Header with Logo and Status */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {project.logo ? (
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 p-2">
                <img src={project.logo} alt={project.name} className="h-full w-full object-contain" />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white font-bold text-lg">
                {project.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                {project.name}
              </h3>
              <div className={cn(
                "mt-1 inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium border",
                statusColors[project.status]
              )}>
                {project.status === 'approved' && '✓ 已通过'}
                {project.status === 'pending' && '⏱ 审核中'}
                {project.status === 'rejected' && '✗ 未通过'}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm leading-relaxed text-gray-600 line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-primary-100 px-2.5 py-1 text-xs font-medium text-primary-700">
            <Tag className="h-3 w-3" />
            {project.category}
          </span>
          {project.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors">
              #{tag}
            </span>
          ))}
          {project.tags.length > 2 && (
            <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
              +{project.tags.length - 2}
            </span>
          )}
        </div>

        {/* AI Score - Compact Version */}
        {project.aiReview && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary-50 to-blue-50 p-3">
            <div className="flex items-center gap-1.5">
              <Star className={cn(
                "h-4 w-4",
                project.aiReview.score >= 80 ? 'text-success-600 fill-success-600' :
                project.aiReview.score >= 60 ? 'text-warning-600 fill-warning-600' :
                'text-gray-400 fill-gray-400'
              )} />
              <span className={cn(
                'text-sm font-bold',
                project.aiReview.score >= 80 ? 'text-success-700' :
                project.aiReview.score >= 60 ? 'text-warning-700' :
                'text-gray-600'
              )}>
                {project.aiReview.score}
              </span>
              <span className="text-xs text-gray-500">/ 100</span>
            </div>
            <div className="h-4 w-px bg-gray-300" />
            <p className="flex-1 text-xs text-gray-600 line-clamp-1">{project.aiReview.feedback}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-5 py-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDate(project.submittedAt)}</span>
        </div>

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary-600 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-primary-700 hover:gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <span>访问项目</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Hover Effect Indicator */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary-500 to-blue-500 opacity-0 transition-opacity group-hover:opacity-100" />
    </article>
  );
}
