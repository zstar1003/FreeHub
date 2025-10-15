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
  status?: 'pending' | 'approved' | 'rejected';
}

interface PendingWish {
  id: string;
  featureRequest: string;
  similarProduct: string;
  submitter: string;
  timestamp: string;
}

export function WishPoolPage() {
  const { language } = useLanguage();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle');
  const [formData, setFormData] = useState({
    featureRequest: '',
    similarProduct: '',
    submitter: ''
  });

  // 加载许愿数据（只显示已审核通过的）
  useEffect(() => {
    const loadWishes = async () => {
      try {
        // 从 JSON 文件加载默认数据（默认为已通过）
        const response = await fetch(`${import.meta.env.BASE_URL}wishes.json`);
        const defaultWishes = await response.json();

        // 从 localStorage 加载用户添加的已通过数据
        const savedWishes = localStorage.getItem('approvedWishes');
        const userWishes = savedWishes ? JSON.parse(savedWishes) : [];

        // 只显示状态为 approved 或未设置状态的愿望
        const approvedWishes = [...defaultWishes, ...userWishes].filter(wish =>
          !wish.status || wish.status === 'approved'
        );

        setWishes(approvedWishes);
      } catch (error) {
        console.error('Failed to load wishes:', error);
        // 如果加载失败，尝试只从 localStorage 加载
        const savedWishes = localStorage.getItem('approvedWishes');
        if (savedWishes) {
          setWishes(JSON.parse(savedWishes));
        }
      }
    };

    loadWishes();
  }, []);

  // 保存许愿到待审核队列
  const saveWish = () => {
    if (!formData.featureRequest.trim()) return;

    setSubmitStatus('submitting');

    const pendingWish: PendingWish = {
      id: Date.now().toString(),
      featureRequest: formData.featureRequest,
      similarProduct: formData.similarProduct,
      submitter: formData.submitter || (language === 'zh' ? '匿名用户' : 'Anonymous'),
      timestamp: new Date().toISOString()
    };

    // 将愿望添加到待审核队列
    const pendingQueue = localStorage.getItem('pendingWishes') || '[]';
    const updatedQueue = [pendingWish, ...JSON.parse(pendingQueue)];
    localStorage.setItem('pendingWishes', JSON.stringify(updatedQueue));

    // 触发 GitHub Actions 的 webhook（如果有）
    triggerWebhook(pendingWish);

    // 重置表单和状态
    setFormData({ featureRequest: '', similarProduct: '', submitter: '' });
    setShowForm(false);
    setSubmitStatus('submitted');

    // 3秒后重置状态
    setTimeout(() => setSubmitStatus('idle'), 3000);
  };

  // 触发 webhook（模拟，实际需要配置）
  const triggerWebhook = (wish: PendingWish) => {
    // 这里可以配置 GitHub Actions 或其他 CI/CD 的 webhook
    console.log('Wish submitted for review:', wish);

    // 实际项目中，这里可以发送到服务器或触发 GitHub Actions
    // 例如：
    // fetch('/api/submit-wish', {
    //   method: 'POST',
    //   body: JSON.stringify(wish)
    // });
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
        <div className="max-w-4xl mx-auto mb-6 sm:mb-8 animate-fade-in-up flex justify-center">
          <button
            onClick={() => setShowForm(true)}
            disabled={submitStatus === 'submitting'}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-blue-600 text-white font-semibold text-base transition-all hover:from-primary-600 hover:to-blue-700 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitStatus === 'submitting' ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                <span>{language === 'zh' ? '提交中...' : 'Submitting...'}</span>
              </>
            ) : submitStatus === 'submitted' ? (
              <>
                <CheckCircle className="h-5 w-5" />
                <span>{language === 'zh' ? '提交成功！' : 'Submitted!'}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>{language === 'zh' ? '我要许愿' : 'Make a Wish'}</span>
              </>
            )}
          </button>
        </div>

        {/* Submit Status Message */}
        {submitStatus === 'submitted' && (
          <div className="max-w-4xl mx-auto mb-4 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                {language === 'zh'
                  ? '您的愿望已提交审核，请等待管理员处理。'
                  : 'Your wish has been submitted for review. Please wait for approval.'}
              </span>
            </div>
          </div>
        )}

        {/* Wish Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary-500" />
                  {language === 'zh' ? '许下你的愿望' : 'Make Your Wish'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ featureRequest: '', similarProduct: '', submitter: '' });
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Modal Form */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'zh' ? '功能需求' : 'Feature Request'} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.featureRequest}
                    onChange={(e) => setFormData({ ...formData, featureRequest: e.target.value })}
                    placeholder={language === 'zh' ? '请详细描述你期待的功能需求...' : 'Describe the feature you want...'}
                    rows={5}
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

                {/* Modal Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={saveWish}
                    disabled={!formData.featureRequest.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-primary-500 to-blue-600 text-white font-semibold transition-all hover:from-primary-600 hover:to-blue-700 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                    <span>{language === 'zh' ? '发送愿望' : 'Send Wish'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ featureRequest: '', similarProduct: '', submitter: '' });
                    }}
                    className="px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold transition-all hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {language === 'zh' ? '取消' : 'Cancel'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wishes Table */}
        <div className="max-w-4xl mx-auto">
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
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-16">
                        {language === 'zh' ? '序号' : 'No.'}
                      </th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        {language === 'zh' ? '功能需求' : 'Feature Request'}
                      </th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-48">
                        {language === 'zh' ? '同类产品' : 'Similar Product'}
                      </th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-32">
                        {language === 'zh' ? '提交者' : 'Submitter'}
                      </th>
                      <th className="px-4 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-24">
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
                        <td className="px-4 py-4 text-base font-medium text-gray-900 dark:text-gray-100">
                          {index + 1}
                        </td>
                        <td className="px-4 py-4 text-base text-gray-700 dark:text-gray-300">
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
                        <td className="px-4 py-4 text-base text-gray-600 dark:text-gray-400">
                          <div className="line-clamp-2">{wish.similarProduct || '-'}</div>
                        </td>
                        <td className="px-4 py-4 text-base text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" />
                            <span className="truncate">{wish.submitter}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="inline-flex items-center justify-center">
                            {wish.isImplemented ? (
                              <CheckCircle className="h-6 w-6 text-green-500 dark:text-green-400" />
                            ) : (
                              <Circle className="h-6 w-6 text-gray-300 dark:text-gray-600" />
                            )}
                          </div>
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
                        <div className="inline-flex items-center justify-center">
                          {wish.isImplemented ? (
                            <CheckCircle className="h-6 w-6 text-green-500 dark:text-green-400" />
                          ) : (
                            <Circle className="h-6 w-6 text-gray-300 dark:text-gray-600" />
                          )}
                        </div>
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
                      <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                        {language === 'zh' ? '功能需求' : 'Feature Request'}
                      </div>
                      <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                        {wish.featureRequest}
                      </p>
                    </div>

                    {wish.similarProduct && (
                      <div>
                        <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                          {language === 'zh' ? '同类产品' : 'Similar Product'}
                        </div>
                        <p className="text-base text-gray-600 dark:text-gray-400">
                          {wish.similarProduct}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-base text-gray-600 dark:text-gray-400">
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
