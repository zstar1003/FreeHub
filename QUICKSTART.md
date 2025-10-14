# 🚀 FreeHub 自动更新 TIOBE 排行榜 - 快速开始

## ⚡ 快速启动（3 步）

### 1. 推送到 GitHub

```bash
git init
git add .
git commit -m "Initial commit with auto-update rankings"
git branch -M main
git remote add origin https://github.com/你的用户名/FreeHub.git
git push -u origin main
```

### 2. 启用 GitHub Actions

1. 进入你的 GitHub 仓库
2. 点击 **Settings** → **Actions** → **General**
3. 确保选中 **"Allow all actions and reusable workflows"**
4. 点击 **Save**

### 3. 完成！

自动更新已配置完成！系统将：
- ✅ 每月 1 号自动更新数据
- ✅ 自动提交到仓库
- ✅ 前端自动显示最新数据

## 🧪 测试自动更新

不想等到月初？立即测试：

1. 进入 GitHub 仓库的 **Actions** 页面
2. 选择 **"Update TIOBE Rankings"** 工作流
3. 点击 **"Run workflow"** 按钮
4. 选择 \`main\` 分支
5. 点击 **"Run workflow"**

等待几分钟后，查看是否生成新的 commit！

## 📱 本地测试（可选）

想在本地测试脚本？

```bash
# 安装脚本依赖
cd scripts
npm install
cd ..

# 运行更新脚本
npm run update-rankings

# 查看更新结果
cat public/rankings.json
```

## 📚 详细文档

- 完整文档：[CI_README.md](./CI_README.md)
- 手动更新指南：[RANKINGS_UPDATE.md](./RANKINGS_UPDATE.md)

## 🎉 就这么简单！

现在你的 FreeHub 项目已经配置好自动更新功能了！

有任何问题？查看详细文档或提交 Issue 💬
