# 许愿池审核机制说明

## 工作流程

### 1. 用户提交愿望
用户在前端提交愿望后：
- 愿望被保存到浏览器的 `localStorage` 中的 `pendingWishes` 队列
- 用户会看到"提交成功，等待审核"的提示
- **愿望不会立即显示在表格中**

### 2. 审核流程

有三种方式处理待审核的愿望：

#### 方式一：手动审核（推荐）
1. 管理员定期检查 localStorage 或通过其他方式收集用户提交
2. 手动审核每个愿望的内容
3. 将审核通过的愿望添加到 `public/wishes.json` 文件
4. 提交代码并推送到仓库

#### 方式二：GitHub Actions 自动审核（基础版）
1. **自动定时任务**：每天北京时间8:00自动运行
2. **手动触发**：在 GitHub Actions 页面手动触发
3. 系统会：
   - 自动过滤不当内容（关键词过滤）
   - 检查内容长度（10-500字符）
   - 格式标准化
   - 创建 Pull Request 供管理员最终审核

工作流文件：`.github/workflows/auto-review-wishes.yml`

#### 方式三：手动触发审核工作流
在 GitHub 仓库的 Actions 页面：
1. 选择 "Review and Update Wishes" 工作流
2. 点击 "Run workflow"
3. 选择操作类型：
   - `process`: 处理待审核愿望
   - `approve-all`: 批准所有待审核（谨慎使用）
   - `clear-pending`: 清空待审核队列

工作流文件：`.github/workflows/review-wishes.yml`

### 3. 数据存储

#### pendingWishes (localStorage)
```json
[
  {
    "id": "1234567890123",
    "featureRequest": "希望能够...",
    "similarProduct": "GitHub",
    "submitter": "张三",
    "timestamp": "2024-12-25T08:00:00.000Z"
  }
]
```

#### wishes.json (public/wishes.json)
```json
[
  {
    "id": "1234567890123",
    "featureRequest": "希望能够...",
    "similarProduct": "GitHub",
    "submitter": "张三",
    "isImplemented": false,
    "timestamp": "2024-12-25T08:00:00.000Z",
    "status": "approved"
  }
]
```

### 4. 审核标准

建议的审核标准：
- ✅ 内容真实、具体、有建设性
- ✅ 语言文明、没有违规内容
- ✅ 不是重复的愿望
- ✅ 功能需求描述清晰
- ❌ 拒绝：测试内容、广告、无意义内容

## 实现细节

### 前端逻辑 (WishPoolPage.tsx)

```typescript
// 提交愿望时
const saveWish = () => {
  // 1. 创建待审核愿望
  const pendingWish = { ... };

  // 2. 保存到 localStorage 的 pendingWishes
  localStorage.setItem('pendingWishes', JSON.stringify(updatedQueue));

  // 3. 触发 webhook（可选，需要配置后端）
  triggerWebhook(pendingWish);

  // 4. 显示提交成功提示
  setSubmitStatus('submitted');
};

// 加载愿望时
useEffect(() => {
  // 只加载 wishes.json 中已审核通过的愿望
  // 不显示 localStorage 中的 pendingWishes
}, []);
```

### 审核脚本 (review-wishes.js)

自动审核脚本会：
1. 读取待审核愿望（需要扩展数据源）
2. 应用过滤规则
3. 格式化数据
4. 更新 wishes.json
5. 创建 Pull Request

## 扩展建议

### 使用后端 API（推荐用于生产环境）

1. **创建后端服务**
   - Express.js / Koa.js / Next.js API Routes
   - 数据库存储（MongoDB / PostgreSQL）
   - RESTful API 端点

2. **API 端点设计**
   ```
   POST   /api/wishes          # 提交愿望
   GET    /api/wishes          # 获取已审核愿望
   GET    /api/wishes/pending  # 获取待审核（管理员）
   PUT    /api/wishes/:id      # 更新状态（管理员）
   DELETE /api/wishes/:id      # 删除（管理员）
   ```

3. **管理后台**
   - 专门的审核界面
   - 批量操作
   - 审核历史记录

### 使用 GitHub Issues

另一种简单方案：
1. 用户提交愿望时创建 GitHub Issue
2. 使用 Issue 模板
3. 管理员直接在 GitHub 上审核
4. 通过 GitHub Actions 自动同步到 wishes.json

### 使用第三方服务

- **Airtable**: 无代码数据库 + 表单
- **Notion**: 数据库 + API
- **Google Forms + Sheets**: 简单易用

## 当前状态

✅ 前端审核机制已实现
✅ GitHub Actions 工作流已创建
✅ 数据隔离（待审核 vs 已通过）
⏳ 需要配置实际的数据收集方式
⏳ 建议添加管理后台界面

## 使用指南

### 开发环境测试

1. 用户提交愿望
2. 检查浏览器的 localStorage 中的 `pendingWishes`
3. 手动将内容复制到 `public/wishes.json`
4. 刷新页面即可看到

### 生产环境部署

1. 确保 GitHub Actions 有必要的权限
2. 配置定时任务或手动触发
3. 定期检查 Pull Requests
4. 审核并合并

## 注意事项

⚠️ **隐私保护**：避免收集敏感个人信息
⚠️ **数据安全**：定期备份 wishes.json
⚠️ **内容审核**：建立明确的审核标准
⚠️ **spam 防护**：添加验证码或限流机制

## 相关文件

- `src/components/WishPoolPage.tsx` - 前端组件
- `public/wishes.json` - 愿望数据
- `.github/workflows/auto-review-wishes.yml` - 自动审核
- `.github/workflows/review-wishes.yml` - 手动审核
