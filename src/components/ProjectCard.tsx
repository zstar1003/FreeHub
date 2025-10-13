import { Project } from '../types';
import { ExternalLink, Calendar, Tag, User } from 'lucide-react';
import { formatDate, cn } from '../utils/helpers';

interface ProjectCardProps {
  project: Project;
  onView?: (project: Project) => void;
}

export function ProjectCard({ project, onView }: ProjectCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-primary-300">
      <div className="flex items-start gap-6 p-5">
        {/* Logo */}
        <div className="flex-shrink-0">
          {project.logo ? (
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 p-3">
              <img src={project.logo} alt={project.name} className="h-full w-full object-contain" />
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white font-bold text-xl">
              {project.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Summary */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {project.name}
            </h3>
            {project.summary && (
              <div className="flex-shrink-0 px-3 py-1 rounded-md bg-gradient-to-r from-blue-50 to-primary-50 border border-blue-100">
                <p className="text-xs font-medium text-blue-700 whitespace-nowrap">{project.summary}</p>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="mb-3 text-sm leading-relaxed text-gray-600 line-clamp-2">
            {project.description}
          </p>

          {/* Tags, Author and Date */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-primary-100 px-2.5 py-1 text-xs font-medium text-primary-700">
                <Tag className="h-3 w-3" />
                {project.category}
              </span>
              {project.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                  #{tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                  +{project.tags.length - 3}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500 whitespace-nowrap">
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                <span>{project.submittedBy}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(project.submittedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0 self-center">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-700 hover:gap-3 shadow-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <span>访问项目</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Hover Effect Indicator */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary-500 to-blue-500 opacity-0 transition-opacity group-hover:opacity-100" />
    </article>
  );
}
