import { Project } from '../types';
import { ExternalLink, Calendar, Tag, User } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import { useLanguage } from '../contexts/LanguageContext';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { t, language } = useLanguage();

  const displayName = language === 'zh' ? project.name : project.nameEn;
  const displayDescription = language === 'zh' ? project.description : project.descriptionEn;
  const displaySummary = language === 'zh' ? project.summary : project.summaryEn;

  // 处理 logo 路径，添加 BASE_URL 前缀
  const logoSrc = project.logo ? `${import.meta.env.BASE_URL}${project.logo}` : null;

  return (
    <article className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-primary-300 dark:hover:border-primary-600">
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-4 sm:p-5">
        {/* Logo and Header (Mobile) */}
        <div className="flex items-start gap-4 w-full sm:w-auto">
          <div className="flex-shrink-0">
            {logoSrc ? (
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 p-2 sm:p-3">
                <img src={logoSrc} alt={displayName} className="h-full w-full object-contain" />
              </div>
            ) : (
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white font-bold text-lg sm:text-xl">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Title on Mobile */}
          <div className="flex-1 min-w-0 sm:hidden">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
              {displayName}
            </h3>
            {displaySummary && (
              <div className="mt-1.5 inline-block px-2.5 py-0.5 rounded-md bg-gradient-to-r from-blue-50 to-primary-50 dark:from-blue-900/30 dark:to-primary-900/30 border border-blue-100 dark:border-blue-800">
                <p className="text-xs font-medium text-blue-700 dark:text-blue-400">{displaySummary}</p>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 w-full sm:w-auto">
          {/* Title and Summary (Desktop) */}
          <div className="hidden sm:flex items-start justify-between gap-4 mb-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {displayName}
            </h3>
            {displaySummary && (
              <div className="flex-shrink-0 px-3 py-1 rounded-md bg-gradient-to-r from-blue-50 to-primary-50 dark:from-blue-900/30 dark:to-primary-900/30 border border-blue-100 dark:border-blue-800">
                <p className="text-xs font-medium text-blue-700 dark:text-blue-400 whitespace-nowrap">{displaySummary}</p>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="mb-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-2">
            {displayDescription}
          </p>

          {/* Tags, Author and Date */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex flex-wrap gap-2">
              {project.categories.map((cat) => (
                <span key={cat} className="inline-flex items-center gap-1 rounded-md bg-primary-100 dark:bg-primary-900/40 px-2.5 py-1 text-xs font-medium text-primary-700 dark:text-primary-400">
                  <Tag className="h-3 w-3" />
                  {cat}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                <span className="truncate">{project.submittedBy}</span>
              </div>
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(project.submittedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button (Desktop) */}
        <div className="hidden sm:flex flex-shrink-0 self-center">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 dark:bg-primary-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-700 dark:hover:bg-primary-600 hover:gap-3 shadow-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <span>{t.project.visit}</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Action Button (Mobile) - Full Width at Bottom */}
      <div className="sm:hidden px-4 pb-4">
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 dark:bg-primary-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-700 dark:hover:bg-primary-600 shadow-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <span>{t.project.visit}</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {/* Hover Effect Indicator */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary-500 to-blue-500 dark:from-primary-600 dark:to-blue-600 opacity-0 transition-opacity group-hover:opacity-100" />
    </article>
  );
}
