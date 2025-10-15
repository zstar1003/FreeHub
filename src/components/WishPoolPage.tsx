import { Sparkles, Send, X, Calendar, User, CheckCircle, Circle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';

interface Wish {
  id: string;
  featureRequest: string;
  similarProduct: string;
  submitter: string;
  isImplemented: boolean;
  timestamp: string;
}

export function WishPoolPage() {
  const { language } = useLanguage();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    featureRequest: '',
    similarProduct: '',
    submitter: ''
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
    if (!formData.featureRequest.trim()) return;

    const newWish: Wish = {
      id: Date.now().toString(),
      featureRequest: formData.featureRequest,
      similarProduct: formData.similarProduct,
      submitter: formData.submitter || (language === 'zh' ? '匿名用户' : 'Anonymous'),
      isImplemented: false,
      timestamp: new Date().toISOString()
    };

    const updatedWishes = [newWish, ...wishes];
    setWishes(updatedWishes);
    localStorage.setItem('wishes', JSON.stringify(updatedWishes));

    // 重置表单
    setFormData({ featureRequest: '', similarProduct: '', submitter: '' });
    setShowForm(false);
  };

  // 切换实现状态
  const toggleImplemented = (id: string) => {
    const updatedWishes = wishes.map(wish =>
      wish.id === id ? { ...wish, isImplemented: !wish.isImplemented } : wish
    );
    setWishes(updatedWishes);
    localStorage.setItem('wishes', JSON.stringify(updatedWishes));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/30">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 text-white shadow-lg">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {language === 'zh' ? '许愿池' : 'Wish Pool'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2">
            {language === 'zh'
              ? '分享你的想法、需求或期待的功能，让我们一起构建更好的产品'
              : 'Share your ideas, needs, or expected features, let\'s build better products together'}
          </p>
        </div>

        {/* Add Wish Button */}
        <div className="max-w-6xl mx-auto mb-6 sm:mb-8 animate-fade-in-up">
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-blue-600 text-white font-semibold text-base sm:text-lg transition-all hover:from-primary-600 hover:to-blue-700 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="h-5 w-5" />
              <span>{language === 'zh' ? '✨ 我要许愿' : '✨ Make a Wish'}</span>
            </button>
          )}

          {/* Wish Form */}
          {showForm && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 p-4 sm:p-6 animate-fade-in-up">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'zh' ? '功能需求' : 'Feature Request'} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.featureRequest}
                    onChange={(e) => setFormData({ ...formData, featureRequest: e.target.value })}
                    placeholder={language === 'zh' ? '请详细描述你期待的功能需求...' : 'Describe the feature you want...'}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'zh' ? '同类产品' : 'Similar Product'}
                  </label>
                  <input
                    type="text"
                    value={formData.similarProduct}
                    onChange={(e) => setFormData({ ...formData, similarProduct: e.target.value })}
                    placeholder={language === 'zh' ? '是否有实现类似功能的产品？（可选）' : 'Any similar products? (Optional)'}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'zh' ? '提交者' : 'Submitter'}
                  </label>
                  <input
                    type="text"
                    value={formData.submitter}
                    onChange={(e) => setFormData({ ...formData, submitter: e.target.value })}
                    placeholder={language === 'zh' ? '你的名字（可选，留空则为匿名）' : 'Your name (Optional, leave blank for anonymous)'}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={saveWish}
                    disabled={!formData.featureRequest.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-primary-500 to-blue-600 text-white font-semibold transition-all hover:from-primary-600 hover:to-blue-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                    <span>{language === 'zh' ? '发送愿望' : 'Send Wish'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ featureRequest: '', similarProduct: '', submitter: '' });
                    }}
                    className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold transition-all hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wishes Table */}
        <div className="max-w-6xl mx-auto">
          {wishes.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 p-12 text-center animate-fade-in-up">
              <div className="text-6xl mb-4">✨</div>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {language === 'zh' ? '还没有愿望' : 'No wishes yet'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {language === 'zh' ? '来许下第一个愿望吧！' : 'Make the first wish!'}
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in-up">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/30 border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-16">
                        {language === 'zh' ? '序号' : 'No.'}
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        {language === 'zh' ? '功能需求' : 'Feature Request'}
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-48">
                        {language === 'zh' ? '同类产品' : 'Similar Product'}
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-32">
                        {language === 'zh' ? '提交者' : 'Submitter'}
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-24">
                        {language === 'zh' ? '已实现' : 'Done'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {wishes.map((wish, index) => (
                      <tr
                        key={wish.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                          {index + 1}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                          <div className="line-clamp-2">{wish.featureRequest}</div>
                          <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(wish.timestamp).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="line-clamp-2">{wish.similarProduct || '-'}</div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" />
                            <span className="truncate">{wish.submitter}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => toggleImplemented(wish.id)}
                            className="inline-flex items-center justify-center transition-all hover:scale-110"
                            title={wish.isImplemented ? (language === 'zh' ? '标记为未实现' : 'Mark as not done') : (language === 'zh' ? '标记为已实现' : 'Mark as done')}
                          >
                            {wish.isImplemented ? (
                              <CheckCircle className="h-6 w-6 text-green-500 dark:text-green-400" />
                            ) : (
                              <Circle className="h-6 w-6 text-gray-300 dark:text-gray-600" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
                {wishes.map((wish, index) => (
                  <div key={wish.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-blue-600 text-white text-sm font-bold">
                          {index + 1}
                        </span>
                        <button
                          onClick={() => toggleImplemented(wish.id)}
                          className="transition-all hover:scale-110"
                        >
                          {wish.isImplemented ? (
                            <CheckCircle className="h-6 w-6 text-green-500 dark:text-green-400" />
                          ) : (
                            <Circle className="h-6 w-6 text-gray-300 dark:text-gray-600" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(wish.timestamp).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                        {language === 'zh' ? '功能需求' : 'Feature Request'}
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {wish.featureRequest}
                      </p>
                    </div>

                    {wish.similarProduct && (
                      <div>
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                          {language === 'zh' ? '同类产品' : 'Similar Product'}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {wish.similarProduct}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                      <User className="h-3.5 w-3.5" />
                      <span>{wish.submitter}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
