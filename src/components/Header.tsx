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
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">FreeHub</h1>
                <p className="text-sm text-gray-600">发现和分享优质免费项目</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-sm text-gray-600">
              已收录 <span className="font-bold text-primary-600">{projectCount}</span> 个项目
            </div>
            <Button variant="outline" size="sm" onClick={onSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              设置
            </Button>
            <Button size="sm" onClick={onSubmitClick}>
              <Plus className="mr-2 h-4 w-4" />
              提交项目
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
