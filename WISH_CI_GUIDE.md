# 许愿池 CI 审核机制（GitHub Issues 方案）

## 🎯 工作原理

这是一个完全自动化的 CI/CD 审核系统，通过 **GitHub Issues** 作为中间存储层。

### 架构流程图

```
用户填写表单
    ↓
跳转到 GitHub Issues
    ↓
创建带标签的 Issue (wish, pending-review)
    ↓
GitHub Actions 自动触发
    ↓
读取并解析 Issue 内容
    ↓
自动审核（过滤、验证）
    ↓
更新 wishes.json
    ↓
关闭 Issue + 添加评论
    ↓
创建 Pull Request
    ↓
管理员审核并合并
    ↓
网站自动更新显示
```

## 📝 使用步骤

### 1. 配置仓库地址

在 `src/components/WishPoolPage.tsx` 第 72 行：
```typescript
const repoUrl = 'https://github.com/YOUR_USERNAME/FreeHub'; // 替换为实际仓库地址
```

### 2. 用户提交流程

1. 用户在网站填写许愿表单
2. 点击"发送愿望"按钮
3. **自动跳转**到 GitHub Issues 创建页面（内容已预填）
4. 用户在 GitHub 上完成提交
5. 系统提示：已打开新窗口，请完成提交

### 3. 自动审核流程

#### 触发条件
- **即时触发**：有新 Issue 创建且带 `wish` 标签
- **定时触发**：每天北京时间 8:00 自动运行
- **手动触发**：在 Actions 页面手动运行

#### 审核规则
```javascript
✅ 内容长度：10-500 字符
✅ 关键词过滤：spam, 广告, test123, 垃圾
✅ 格式验证：能正确解析 Issue 结构
✅ 去重检查：避免重复提交
```

#### 自动化操作
1. 读取所有带 `wish` + `pending-review` 标签的 Issues
2. 解析 Issue 内容（功能需求、同类产品、提交者）
3. 应用审核规则过滤
4. 通过审核的添加到 `wishes.json`
5. 自动关闭 Issue
6. 移除 `pending-review` 标签，添加 `approved` 标签
7. 在 Issue 中自动回复："✅ 您的愿望已审核通过..."
8. 创建 Pull Request

### 4. 管理员操作

管理员只需要：
1. 查看 GitHub Actions 创建的 Pull Request
2. 检查新添加的许愿内容
3. 合并 PR（或拒绝）
4. 网站自动更新

## 📂 相关文件

```
.github/
├── ISSUE_TEMPLATE/
│   └── wish-submission.md              # Issue 模板
└── workflows/
    └── process-wish-issues.yml         # CI 工作流

src/components/
└── WishPoolPage.tsx                    # 前端组件

public/
└── wishes.json                         # 愿望数据
```

## ⚙️ 工作流文件说明

### process-wish-issues.yml

**触发条件：**
```yaml
on:
  issues:
    types: [opened, labeled]     # Issue 创建或打标签时
  schedule:
    - cron: '0 0 * * *'          # 每天定时
  workflow_dispatch:              # 手动触发
```

**权限要求：**
```yaml
permissions:
  contents: write      # 写入文件
  issues: write        # 操作 Issues
  pull-requests: write # 创建 PR
```

**核心步骤：**
1. **Checkout** - 检出代码
2. **Fetch and Process** - 从 Issues 获取并处理
3. **Close Issues** - 关闭已处理的 Issue
4. **Create PR** - 创建 Pull Request

## 🎨 用户体验

### 前端表单
- 填写功能需求（必填）
- 填写同类产品（可选）
- 填写提交者姓名（可选）

### 提交后
- 自动打开新窗口（GitHub Issues）
- 内容已预填，用户只需确认
- 提示消息："已为您打开 GitHub Issues 页面"

### Issue 关闭时
- 自动评论通知用户
- 移除 pending-review 标签
- 添加 approved 标签

## 🛡️ 安全性

### 优势
✅ 不需要后端服务器
✅ 不需要数据库
✅ 利用 GitHub 的认证系统
✅ 所有操作可追溯
✅ Issue 可公开透明
✅ 不会暴露 API Token

### 限制
- 需要 GitHub 账号才能提交
- 提交会公开显示
- 受 GitHub API 速率限制

## 🔧 高级配置

### 自定义审核规则

编辑 `process-wish-issues.yml` 中的 `filterContent` 函数：

```javascript
function filterContent(text) {
  const forbiddenWords = ['spam', '广告']; // 自定义黑名单
  const lowerText = text.toLowerCase();
  return !forbiddenWords.some(word => lowerText.includes(word)) &&
         text.length >= 10 &&      // 最小长度
         text.length <= 500;       // 最大长度
}
```

### 修改定时频率

```yaml
schedule:
  - cron: '0 */6 * * *'  # 每 6 小时运行一次
```

### 添加通知

可以添加 Slack/Discord/Email 通知：

```yaml
- name: Notify
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'New wishes processed!'
```

## 📊 监控和统计

### 查看处理记录
- GitHub Actions 执行历史
- Issues 列表（过滤 approved 标签）
- Pull Requests 历史

### 统计信息
```bash
# 统计已处理的愿望数量
gh issue list --label approved --state closed | wc -l

# 统计待处理的愿望
gh issue list --label pending-review --state open
```

## 🚀 部署清单

- [ ] 1. 替换仓库地址（WishPoolPage.tsx 第 72 行）
- [ ] 2. 提交代码到 GitHub
- [ ] 3. 启用 GitHub Actions
- [ ] 4. 测试 Issue 创建
- [ ] 5. 观察自动处理流程
- [ ] 6. 审核并合并 PR
- [ ] 7. 验证网站更新

## ❓ 常见问题

**Q: 为什么不直接通过 API 提交？**
A: 使用 Issues 不需要暴露 GitHub Token，更安全。

**Q: 用户必须有 GitHub 账号吗？**
A: 是的，这是使用 Issues 的限制。如需匿名提交，考虑添加后端。

**Q: 审核规则可以更智能吗？**
A: 可以集成 AI 模型（如 OpenAI）进行内容审核。

**Q: 能否批量导入现有愿望？**
A: 可以，手动编辑 `wishes.json` 或创建批量 Issues。

## 🎯 对比其他方案

| 方案 | 优点 | 缺点 |
|------|------|------|
| **GitHub Issues** (当前) | 无需服务器、可追溯、安全 | 需要 GitHub 账号 |
| localStorage | 简单 | CI 无法访问 |
| 后端 API | 功能强大 | 需要服务器、成本 |
| Google Forms | 简单易用 | 需要手动同步 |
| Airtable | 功能丰富 | 第三方依赖 |

## 📝 许可

此方案完全开源，可自由使用和修改。
