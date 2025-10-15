import { Sparkles, Send, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';

interface Wish {
  id: string;
  content: string;
  type: string;
  timestamp: string;
}

export function WishPool() {
  const { language } = useLanguage();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    content: '',
    type: 'feature'
  });

  // 加载许愿
  useEffect(() => {
    const savedWishes = localStorage.getItem('wishes');
    if (savedWishes) {
      setWishes(JSON.parse(savedWishes));
    }
  }, []);

  // 保存许愿
  const saveWish = () => {
    if (!formData.content.trim()) return;

    const newWish: Wish = {
      id: Date.now().toString(),
      content: formData.content,
      type: formData.type,
      timestamp: new Date().toISOString()
    };

    const updatedWishes = [newWish, ...wishes];
    setWishes(updatedWishes);
    localStorage.setItem('wishes', JSON.stringify(updatedWishes));

    // 重置表单
    setFormData({ content: '', type: 'feature' });
    setShowForm(false);
  };

  const wishTypes = [
    { value: 'feature', label: language === 'zh' ? '功能需求' : 'Feature Request' },
    { value: 'product', label: language === 'zh' ? '同类产品' : 'Similar Product' },
    { value: 'improvement', label: language === 'zh' ? '改进建议' : 'Improvement' },
    { value: 'other', label: language === 'zh' ? '其他' : 'Other' }
  ];

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      feature: 'from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700',
      product: 'from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700',
      improvement: 'from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700',
      other: 'from-gray-100 to-gray-200 dark:from-gray-900/40 dark:to-gray-800/40 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
    };
    return colors[type] || colors.other;
  };

  return (
    <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/30">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500 to-blue-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {language === 'zh' ? '许愿池' : 'Wish Pool'}
          </h3>
        </div>
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          {language === 'zh'
            ? '分享你的想法、需求或期待的功能'
            : 'Share your ideas, needs, or expected features'}
        </p>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Add Wish Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-primary-500 to-blue-600 text-white font-medium transition-all hover:from-primary-600 hover:to-blue-700 shadow-md hover:shadow-lg"
          >
            <Sparkles className="h-4 w-4" />
            <span>{language === 'zh' ? '我要许愿' : 'Make a Wish'}</span>
          </button>
        )}

        {/* Wish Form */}
        {showForm && (
          <div className="space-y-3 animate-fade-in-up">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {language === 'zh' ? '愿望类型' : 'Wish Type'}
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
              >
                {wishTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {language === 'zh' ? '愿望内容' : 'Wish Content'}
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder={language === 'zh' ? '请描述你的愿望...' : 'Describe your wish...'}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={saveWish}
                disabled={!formData.content.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-blue-600 text-white font-medium transition-all hover:from-primary-600 hover:to-blue-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
                <span>{language === 'zh' ? '发送' : 'Send'}</span>
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormData({ content: '', type: 'feature' });
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-all hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Wishes List */}
        {wishes.length > 0 && (
          <div className="mt-4 space-y-3 max-h-[500px] overflow-y-auto scrollbar-custom">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {language === 'zh' ? '最近的愿望' : 'Recent Wishes'}
            </div>
            {wishes.slice(0, 10).map((wish) => (
              <div
                key={wish.id}
                className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 animate-fade-in-up"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r border ${getTypeColor(wish.type)}`}>
                    {wishTypes.find(t => t.value === wish.type)?.label}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {new Date(wish.timestamp).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {wish.content}
                </p>
              </div>
            ))}
          </div>
        )}

        {wishes.length === 0 && !showForm && (
          <div className="mt-4 p-6 text-center">
            <div className="text-4xl mb-2">✨</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {language === 'zh' ? '还没有愿望，来许下第一个吧！' : 'No wishes yet, make the first one!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
