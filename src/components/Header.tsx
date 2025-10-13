import { useState } from 'react';
import { Sparkles, Home, TrendingUp, FileText } from 'lucide-react';

interface HeaderProps {
  projectCount: number;
}

export function Header({ projectCount }: HeaderProps) {
  const [activeMenu, setActiveMenu] = useState('home');

  const menuItems = [
    { id: 'home', label: '首页', icon: Home },
    { id: 'trending', label: '榜单', icon: TrendingUp },
    { id: 'articles', label: '文章', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 via-primary-600 to-blue-600 text-white shadow-lg">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  FreeHub
                </h1>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center gap-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveMenu(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeMenu === item.id
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Project Count */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-100">
            <span className="text-xs text-gray-600">已收录</span>
            <span className="text-sm font-bold text-primary-600">{projectCount}</span>
            <span className="text-xs text-gray-600">个项目</span>
          </div>
        </div>
      </div>
    </header>
  );
}
