# FreeHub - 自动更新 TIOBE 排行榜

## 📋 功能说明

本项目已配置自动化 CI/CD 流程，可以定期从 TIOBE 官网抓取最新的编程语言排行榜数据并自动更新到项目中。

## 🤖 自动更新机制

### GitHub Actions 定时任务

项目使用 GitHub Actions 实现自动化数据更新：

- **运行时间**：每月 1 号 UTC 0:00（北京时间早上 8:00）
- **运行方式**：自动运行 + 支持手动触发
- **更新内容**：`public/rankings.json` 文件
- **提交信息**：自动提交更新并推送到仓库

### 工作流程

1. GitHub Actions 按计划触发
2. 运行 Node.js 脚本抓取 TIOBE 官网数据
3. 解析并更新 `rankings.json` 文件
4. 检测到变化后自动提交并推送
5. 前端自动读取最新数据

## 🚀 使用方法

### 1. 启用 GitHub Actions

确保你的仓库启用了 GitHub Actions：

1. 进入仓库 Settings
2. 点击 Actions > General
3. 确保 "Allow all actions and reusable workflows" 已选中
4. 保存设置

### 2. 手动触发更新（可选）

如果需要立即更新数据，无需等待定时任务：

1. 进入仓库的 Actions 页面
2. 选择 "Update TIOBE Rankings" 工作流
3. 点击 "Run workflow" 按钮
4. 选择分支并运行

### 3. 本地测试更新脚本

在推送到 GitHub 之前，可以先在本地测试：

```bash
# 进入脚本目录
cd scripts

# 安装依赖
npm install

# 返回项目根目录
cd ..

# 运行更新脚本
npm run update-rankings
```

## 📁 项目结构

```
FreeHub/
├── .github/
│   └── workflows/
│       └── update-rankings.yml    # GitHub Actions 工作流
├── scripts/
│   ├── package.json              # 脚本依赖配置
│   └── update-rankings.js        # 数据抓取脚本
├── public/
│   └── rankings.json             # 排行榜数据文件
└── src/
    └── components/
        └── RankingPage.tsx       # 排行榜展示页面
```

## ⚙️ 配置说明

### 修改更新频率

编辑 `.github/workflows/update-rankings.yml` 中的 cron 表达式：

```yaml
schedule:
  # 每月1号运行
  - cron: '0 0 1 * *'

  # 其他示例：
  # 每周一运行: '0 0 * * 1'
  # 每天运行: '0 0 * * *'
  # 每周日运行: '0 0 * * 0'
```

### 自定义抓取逻辑

如果 TIOBE 网站结构发生变化，修改 `scripts/update-rankings.js` 中的选择器。

## 🔍 故障排查

### Actions 运行失败

1. **检查网络连接**：TIOBE 网站可能有访问限制
2. **查看运行日志**：在 Actions 页面查看详细错误信息
3. **验证选择器**：TIOBE 网站可能更新了 HTML 结构
4. **手动运行**：使用 workflow_dispatch 手动触发测试

### 数据未更新

1. 检查 Actions 是否成功运行
2. 查看最新的 commit 历史
3. 确认 `rankings.json` 文件是否有变化
4. 检查浏览器缓存，尝试硬刷新（Ctrl+F5）

### 本地测试失败

```bash
# 确保在正确的目录
cd scripts

# 清除依赖重新安装
rm -rf node_modules
npm install

# 运行脚本
cd ..
npm run update-rankings
```

## 📊 数据格式

`rankings.json` 数据格式：

```json
[
  {
    "rank": 1,              // 当前排名
    "prevRank": 1,          // 上月排名
    "language": "Python",   // 语言名称
    "rating": 24.45,        // 评分（百分比）
    "change": 0             // 排名变化（prevRank - rank）
  }
]
```

## 🔐 权限说明

GitHub Actions 使用内置的 `GITHUB_TOKEN`，无需额外配置：

- ✅ 读取仓库代码
- ✅ 提交更改
- ✅ 推送到仓库

## 💡 提示

1. **首次部署**：推送代码后，Actions 会自动生效
2. **数据验证**：更新后建议检查数据的准确性
3. **错误处理**：脚本失败不会影响现有数据
4. **更新时间**：前端会自动显示最新的更新时间

## 🛠️ 手动更新方案

如果自动更新失败，仍可以手动更新：

1. 访问 https://www.tiobe.com/tiobe-index
2. 编辑 `public/rankings.json`
3. 提交并推送更改

详见：[RANKINGS_UPDATE.md](./RANKINGS_UPDATE.md)

## 📝 注意事项

1. TIOBE 网站可能有反爬虫机制，建议合理设置更新频率
2. 如果连续多次失败，考虑使用手动更新方案
3. 脚本会保留现有数据，只在成功抓取后才更新
4. 提交信息包含 `[skip ci]`，避免触发其他 CI 流程

## 🤝 贡献

如果发现脚本问题或有改进建议，欢迎提交 Issue 或 Pull Request！
