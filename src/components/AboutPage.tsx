import { Mail, Github, MessageCircle, Heart, UserCircle, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function AboutPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/30">
      <main className="mx-auto max-w-4xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 text-white shadow-lg">
              <Heart className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {language === 'zh' ? '关于 FreeHub' : 'About FreeHub'}
            </h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {language === 'zh'
              ? '汇集免费的产品'
              : 'Collection of free products'}
          </p>
        </div>

        <div className="space-y-6 animate-fade-in-up">
          {/* 作者理念 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <UserCircle className="h-5 w-5 text-primary-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {language === 'zh' ? '作者理念' : 'Author philosophy'}
              </h2>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300">
                {language === 'zh'
                  ? '我始终坚信，“好的产品可以是免费的”。在这个收费产品大行其道的当下，本站将持续收录分享一些免费好用的产品。如果你的产品完全免费且开源，欢迎登记收录。'
                  : 'I always believe that "good products can be free". In this era where paid products are popular, this site will continue to include and share some free and useful products. If your product is completely free and open source, you are welcome to merge it.'}
              </p>
            </div>
          </div>

          {/* 项目收录方式 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Plus className="h-5 w-5 text-primary-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {language === 'zh' ? '项目收录方式' : 'How to Submit Projects'}
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'zh'
                    ? '可通过以下方式进行产品收录：'
                    : 'Products can be included in the following ways:'}
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1 ml-4">
                  <li>
                    {language === 'zh'
                      ? '在 GitHub 仓库提交 Pull Request'
                      : 'Pull Request on GitHub repository'}
                  </li>
                  <li>
                    {language === 'zh'
                      ? '通过邮箱或微信联系我（见下方联系方式）'
                      : 'Contact me via email or WeChat (see contact information below)'}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 联系方式 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="h-5 w-5 text-primary-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {language === 'zh' ? '联系方式' : 'Contact Information'}
              </h2>
            </div>
            <div className="space-y-4">
              {/* GitHub */}
              <a
                href="https://github.com/zstar1003/FreeHub"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all group"
              >
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 transition-colors">
                  <Github className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">GitHub</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">zstar1003/FreeHub</div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {language === 'zh' ? '查看项目' : 'View Project'}
                </div>
              </a>

              {/* Email */}
              <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/30">
                  <Mail className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {language === 'zh' ? '邮箱' : 'Email'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">zstar1003@163.com</div>
                </div>
              </div>

              {/* WeChat */}
              <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/30">
                  <MessageCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {language === 'zh' ? '微信' : 'WeChat'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">zstar1003</div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
