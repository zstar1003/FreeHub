import { useState } from 'react';
import { Plus, Settings, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';

interface HeaderProps {
  onSubmitClick: () => void;
  onSettingsClick: () => void;
  projectCount: number;
}

export function Header({ onSubmitClick, onSettingsClick, projectCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 via-primary-600 to-blue-600 text-white shadow-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                FreeHub
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">发现和分享优质免费项目</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-100">
              <span className="text-xs text-gray-600">已收录</span>
              <span className="text-sm font-bold text-primary-600">{projectCount}</span>
              <span className="text-xs text-gray-600">个项目</span>
            </div>
            <Button variant="outline" size="sm" onClick={onSettingsClick} className="hidden sm:flex">
              <Settings className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">设置</span>
            </Button>
            <Button size="sm" onClick={onSubmitClick} className="shadow-md hover:shadow-lg transition-shadow">
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">提交项目</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
