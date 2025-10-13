# FreeHub

一个用于发现和分享优质免费项目的纯前端网站，集成了 AI 自动审核功能。

## 功能特点

- 📋 **项目展示** - 精美的卡片式项目展示，支持分类和标签
- ✨ **AI 自动审核** - 使用 Claude API 自动评估提交项目的质量
- 🔍 **搜索与筛选** - 支持关键词搜索、分类筛选和状态筛选
- 💾 **本地存储** - 数据存储在浏览器 LocalStorage，无需后端
- 🎨 **现代 UI** - 使用 Tailwind CSS 构建的响应式界面
- 🚀 **快速部署** - 纯前端项目，可部署到任何静态托管平台

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI 框架**: Tailwind CSS
- **图标库**: Lucide React
- **AI 审核**: Anthropic Claude API
- **状态管理**: React Hooks
- **存储**: LocalStorage

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 API Key

启动应用后，点击右上角的"设置"按钮，输入你的 Claude API Key。你可以在 [Anthropic Console](https://console.anthropic.com/) 获取 API Key。

### 3. 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动。

### 4. 构建生产版本

```bash
npm run build
```

构建文件将输出到 `dist` 目录。

## 使用说明

### 提交项目

1. 点击右上角的"提交项目"按钮
2. 填写项目信息（名称、描述、URL、分类、标签等）
3. 点击"提交项目"，AI 将自动审核
4. 审核通过的项目会自动显示在列表中

### 搜索与筛选

- 使用左侧搜索框输入关键词搜索项目
- 选择分类筛选特定类型的项目
- 选择状态查看已批准、审核中或已拒绝的项目

### AI 审核标准

AI 会评估以下方面：
- 项目是否真正免费
- 描述是否清晰有用
- URL 是否有效且安全
- 是否符合选择的分类
- 整体质量和实用性

评分高于 60 分的项目会被自动批准。

## 项目结构

```
FreeHub/
├── src/
│   ├── components/          # React 组件
│   │   ├── ui/             # UI 基础组件
│   │   ├── Header.tsx      # 顶部导航
│   │   ├── FilterBar.tsx   # 搜索筛选栏
│   │   ├── ProjectCard.tsx # 项目卡片
│   │   ├── SubmitForm.tsx  # 提交表单
│   │   └── SettingsModal.tsx # 设置弹窗
│   ├── services/           # 服务层
│   │   └── aiReview.ts    # AI 审核服务
│   ├── utils/             # 工具函数
│   │   ├── storage.ts     # 本地存储
│   │   └── helpers.ts     # 辅助函数
│   ├── types/             # TypeScript 类型定义
│   │   └── index.ts
│   ├── App.tsx            # 主应用组件
│   ├── main.tsx           # 应用入口
│   └── index.css          # 全局样式
├── public/                # 静态资源
├── index.html            # HTML 模板
├── package.json          # 项目配置
├── tailwind.config.js    # Tailwind 配置
├── tsconfig.json         # TypeScript 配置
└── vite.config.ts        # Vite 配置
```

## 部署

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### GitHub Pages

1. 修改 `vite.config.ts` 添加 `base: '/your-repo-name/'`
2. 运行 `npm run build`
3. 将 `dist` 目录推送到 `gh-pages` 分支

## 注意事项

⚠️ **安全提示**: 当前实现在浏览器端直接调用 Claude API（设置了 `dangerouslyAllowBrowser: true`）。在生产环境中，强烈建议：

1. 搭建后端代理服务来调用 API
2. 实现 API Key 的安全管理
3. 添加请求频率限制
4. 记录审核日志

## 功能扩展建议

- [ ] 添加用户认证系统
- [ ] 实现项目点赞和收藏
- [ ] 添加项目评论功能
- [ ] 支持项目更新通知
- [ ] 导出项目数据功能
- [ ] 添加深色模式
- [ ] 多语言支持
- [ ] 后端 API 集成
- [ ] 项目统计分析
- [ ] RSS 订阅功能

## 开发

### 代码规范

项目使用 ESLint 进行代码检查：

```bash
npm run lint
```

### 类型检查

```bash
npm run type-check
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

---

Made with ❤️ by Claude Code
