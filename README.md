<div align="center">
  <img src="Assets\logo_with_text.png"  width="800" alt="LOGO">
</div>


<div align="center">
  <h4>
    <a href="README.md">🇨🇳 中文</a>
    <span> | </span>
    <a href="README_EN.md">🇬🇧 English</a>
  </h4>
</div>

一个免费产品的集合平台，同时提供每日 AI 新闻、AI 热榜、AI 站点导航等功能。

在线访问：https://xdxsb.top/FreeHub


## 📥 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装步骤

1. **克隆项目**

   ```bash
   git clone https://github.com/zstar1003/FreeHub.git
   cd FreeHub
   ```
2. **安装依赖**

   ```bash
   npm install
   ```
3. **启动开发服务器**

   ```bash
   npm run dev
   ```
4. **访问应用**

   打开浏览器访问 `http://localhost:5173`

### 构建部署

```bash
# 生产构建
npm run build

# 预览构建结果
npm run preview
```

## 📝 产品收录

如果你有优质的免费产品想要收录到 FreeHub，可以通过以下方式：

### 方式一：提交 Pull Request

1. Fork 本仓库
2. 编辑 `public/projects.json` 文件
3. 按照以下格式添加你的产品信息：

```json
{
  "name": "产品名称",
  "nameEn": "Product Name",
  "summary": "简短摘要",
  "summaryEn": "Short summary",
  "description": "详细描述",
  "descriptionEn": "Detailed description",
  "url": "https://product-url.com",
  "categories": ["分类1", "分类2"],
  "submittedBy": "提交者",
  "submittedAt": "2024-01-01",
  "logo": "product/logo.png"
}
```

4. 如果有 logo，将图片放到 `public/product/` 文件夹
5. 提交 PR 并等待审核

### 方式二：直接联系

- 📧 邮箱：zstar1003@163.com
- 💬 微信：zstar1003

## 🗂️ 项目结构

```
FreeHub/
├── public/
│   ├── product/          # 产品 logo 图片
│   ├── projects.json     # 产品数据
│   └── ai-news.json      # AI 资讯数据
├── scripts/
│   └── update-ai-news.js # AI 资讯自动更新脚本
├── src/
│   ├── components/       # React 组件
│   ├── contexts/         # React Context
│   ├── types/           # TypeScript 类型定义
│   ├── utils/           # 工具函数
│   └── App.tsx          # 主应用组件
├── .github/
│   └── workflows/       # GitHub Actions 工作流
└── README.md
```

## 🤝 贡献指南

欢迎各种形式的贡献！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📜 开源协议

本项目采用 [MIT](LICENSE) 协议开源。

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=zstar1003/FreeHub&type=Date)](https://star-history.com/#zstar1003/FreeHub&Date)