# 🚀 GitHub Pages 部署指南

## 📦 部署配置说明

本项目已配置自动部署到 GitHub Pages，每次推送到 `main` 分支时自动触发。

## ⚙️ 启用 GitHub Pages（3步）

### 第1步：启用 GitHub Pages

1. 进入 GitHub 仓库：https://github.com/zstar1003/FreeHub
2. 点击 **Settings**（设置）
3. 在左侧菜单找到 **Pages**
4. 在 **Source** 下拉菜单中选择 **GitHub Actions**
5. 点击 **Save**

### 第2步：推送代码

```bash
git add .
git commit -m "feat: add GitHub Pages deployment"
git push origin main
```

### 第3步：查看部署状态

1. 进入 **Actions** 页面
2. 查看 **Deploy to GitHub Pages** 工作流
3. 等待部署完成（约2-3分钟）

## 🌐 访问你的网站

部署成功后，访问：

**https://zstar1003.github.io/FreeHub/**

## 📁 部署架构

```
推送代码到 main 分支
      ↓
GitHub Actions 触发
      ↓
安装依赖 (npm ci)
      ↓
构建项目 (npm run build)
      ↓
生成 dist 目录
      ↓
部署到 GitHub Pages
      ↓
网站自动更新
```

## 🔧 自定义域名（可选）

如果你有自己的域名：

1. 在仓库 Settings → Pages 中添加自定义域名
2. 在你的域名提供商处配置 DNS：
   - 类型：CNAME
   - 名称：www (或你想要的子域名)
   - 值：zstar1003.github.io

3. 修改 `vite.config.ts`：
   ```typescript
   base: process.env.GITHUB_ACTIONS
     ? 'https://你的域名.com/'
     : '/',
   ```

## 📊 部署状态

查看部署状态：
- ✅ 成功：绿色对勾，网站已更新
- ⏳ 进行中：黄色圆圈，正在部署
- ❌ 失败：红色叉号，查看日志修复问题

## 🐛 常见问题

### Q: 部署后页面空白？
A: 检查 `vite.config.ts` 中的 `base` 配置是否正确。应该是 `/FreeHub/`。

### Q: 资源 404 错误？
A: 确保 `base` 路径配置正确，所有资源路径都会自动添加这个前缀。

### Q: 如何回滚到之前的版本？
A:
1. 进入 Actions 页面
2. 找到成功的旧版本部署
3. 点击 "Re-run all jobs"

### Q: 部署失败怎么办？
A:
1. 查看 Actions 日志中的错误信息
2. 确保 `npm run build` 在本地能成功运行
3. 检查是否有 TypeScript 或 ESLint 错误

## 🔄 手动触发部署

不想等待自动部署？手动触发：

1. 进入 **Actions** 页面
2. 选择 **Deploy to GitHub Pages**
3. 点击 **Run workflow**
4. 选择 `main` 分支
5. 点击 **Run workflow**

## 📝 工作流文件说明

部署工作流：`.github/workflows/deploy.yml`

主要步骤：
1. **Checkout** - 检出代码
2. **Setup Node.js** - 安装 Node.js 20
3. **Install** - 安装依赖
4. **Build** - 构建项目
5. **Deploy** - 部署到 GitHub Pages

## 🎯 优化建议

### 1. 构建优化

在 `vite.config.ts` 中添加：

```typescript
build: {
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true, // 移除 console.log
    },
  },
},
```

### 2. 缓存优化

GitHub Actions 已配置 npm 缓存，加快构建速度：

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'  # 启用缓存
```

### 3. 并发控制

已配置并发控制，避免重复部署：

```yaml
concurrency:
  group: "pages"
  cancel-in-progress: false
```

## 📚 相关文档

- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

## ✅ 验证部署

部署成功后，检查：

- [ ] 网站可以正常访问
- [ ] 所有资源（CSS、JS、图片）加载正常
- [ ] 路由跳转工作正常
- [ ] 数据（projects.json、rankings.json）加载正常
- [ ] 深色模式切换正常
- [ ] 语言切换正常

---

现在你的 FreeHub 项目会在每次推送到 main 分支时自动部署到 GitHub Pages！🎉

部署链接：**https://zstar1003.github.io/FreeHub/**
