# Supabase 许愿池设置指南

本文档介绍如何配置 Supabase 来支持 FreeHub 的许愿池功能。

## 功能说明

许愿池使用 Supabase 作为实时数据库：

1. 用户在前端提交愿望 → 数据直接存入 Supabase（status: approved）
2. 提交成功后自动刷新列表 → 立即显示新发布的愿望
3. 所有愿望实时存储在 Supabase 中
4. 前端从 Supabase 实时读取并显示所有愿望

## 第一步：创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com/)
2. 点击 "Start your project" 注册/登录
3. 创建新项目：
   - 项目名称：`freehub-wishes`（可自定义）
   - 数据库密码：设置一个强密码并保存
   - 区域：选择离你最近的区域（如 Singapore）
   - 定价计划：选择 Free plan

## 第二步：设置数据库

### 2.1 执行 SQL Schema

1. 在 Supabase 控制台，进入 **SQL Editor**
2. 点击 **New Query**
3. 复制 `supabase/schema.sql` 的全部内容并粘贴
4. 点击 **Run** 执行

这将创建：
- `wishes` 表及相关索引
- Row Level Security (RLS) 策略
- 自动更新时间戳的触发器
- `approved_wishes` 视图

### 2.2 验证表结构

在 **Table Editor** 中应该能看到 `wishes` 表，包含以下字段：
- `id` (uuid, primary key)
- `feature_request` (text, 必填，10-500字符)
- `similar_product` (text, 可选)
- `submitter` (text, 默认 "Anonymous")
- `status` (text, 'pending' | 'approved' | 'rejected')
- `is_implemented` (boolean, 默认 false)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## 第三步：获取 API 密钥

1. 在 Supabase 控制台，进入 **Settings** → **API**
2. 找到以下信息：

**Project URL**
```
https://xxxxxxxxxxxxx.supabase.co
```

**anon public (匿名公钥)**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**service_role (服务密钥，保密！)**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 第四步：配置环境变量

### 4.1 本地开发环境

1. 复制 `.env.example` 为 `.env`：
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入你的 Supabase 信息：
```env
# Supabase URL
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co

# Supabase Anon Key (公开密钥，可以暴露在前端)
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Service Role Key (仅用于 CI/CD，不要暴露！)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. 重启开发服务器
```bash
npm run dev
```

**重要提示**：
- ✅ `anon` 密钥可以安全地暴露在前端代码中（已通过 RLS 策略限制权限）
- ✅ `.env` 文件已添加到 `.gitignore`，不会被提交
- ℹ️ `service_role` 密钥仅在需要后台管理时使用（当前不需要）

## 第五步：测试功能

### 5.1 测试提交和显示

1. 运行开发服务器：
```bash
npm run dev
```

2. 访问许愿池页面
3. 点击"我要许愿"按钮
4. 填写表单并提交
5. 提交成功后，愿望会立即显示在列表中
6. 检查 Supabase 控制台的 `wishes` 表，应该能看到新记录，`status` 为 `approved`

## 数据流程图

```
用户提交愿望
    ↓
Supabase (status: approved)
    ↓
前端自动刷新
    ↓
立即显示在列表中
```

## 安全策略 (RLS)

数据库已启用 Row Level Security，策略如下：

1. **插入策略**：任何人都可以插入（提交愿望）
```sql
FOR INSERT TO anon, authenticated
WITH CHECK (true)
```

2. **查询策略**：任何人只能查看 approved 的愿望
```sql
FOR SELECT TO anon, authenticated
USING (status = 'approved')
```

3. **更新/删除**：只能通过 service_role key（CI/CD）操作

这意味着：
- ✅ 任何用户可以提交愿望
- ✅ 任何用户可以看到所有已发布的愿望
- 🔒 数据库级别的安全保护
- 💾 所有数据持久化存储在云端

## 故障排查

### 前端无法连接 Supabase

**问题**：控制台显示 "Supabase configuration is missing"

**解决**：
1. 检查 `.env` 文件是否存在且配置正确
2. 检查环境变量是否以 `VITE_` 开头
3. 重启开发服务器

### GitHub Actions 失败

**已废弃**：当前版本不再使用 GitHub Actions 审核机制。

### 愿望无法提交

**问题**：点击提交后显示错误

**解决**：
1. 检查浏览器控制台的错误信息
2. 确认功能需求字段不为空
3. 确认字段长度在 10-500 字符之间（数据库约束）
4. 检查 Supabase RLS 策略是否正确配置

### 前端不显示愿望

**问题**：Supabase 中有 approved 的数据，但前端不显示

**解决**：
1. 检查浏览器控制台是否有加载错误
2. 确认 RLS 策略正确配置
3. 尝试清除浏览器缓存并刷新
4. 检查 `WishPoolPage.tsx` 的 `loadWishes()` 函数
5. 确认网络连接正常，能访问 Supabase

## 成本说明

Supabase Free Plan 限制：
- 数据库：500 MB
- 存储：1 GB
- 带宽：5 GB/月
- API 请求：无限制

对于许愿池功能，Free Plan 完全足够使用。

## 进阶配置

### 添加内容过滤

如果需要在提交时进行内容过滤，可以修改 `WishPoolPage.tsx` 的 `saveWish` 函数：

```typescript
const saveWish = async () => {
  // 添加客户端验证
  const forbiddenWords = ['spam', '广告', '垃圾'];
  const hasProhibitedContent = forbiddenWords.some(word =>
    formData.featureRequest.toLowerCase().includes(word)
  );

  if (hasProhibitedContent) {
    alert('内容包含禁止词汇，请修改后重试');
    return;
  }

  // ... 继续提交
};
```

### 添加邮件通知

可以配置 Supabase 数据库触发器，在新愿望提交时发送邮件通知：

```sql
-- 示例：创建邮件通知函数
CREATE OR REPLACE FUNCTION notify_new_wish()
RETURNS TRIGGER AS $$
BEGIN
  -- 使用 pg_net 或其他扩展发送通知
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 添加实时订阅

使用 Supabase Realtime 功能，实现多用户实时协作：

```typescript
// 在 WishPoolPage.tsx 中添加
useEffect(() => {
  // 订阅新愿望
  const subscription = supabase
    .channel('wishes-channel')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'wishes'
    }, (payload) => {
      console.log('新愿望：', payload);
      loadWishes(); // 自动刷新
    })
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

## 总结

现在你已经完成了 Supabase 许愿池的完整配置！

主要优势：
- ✅ 用户体验流畅，提交后立即显示
- ✅ 实时数据同步，无需等待审核
- ✅ 安全的 RLS 策略保护数据
- ✅ 免费且可靠的云数据库
- ✅ 简单易用，无需复杂的 CI/CD 配置
- ✅ 可扩展支持实时订阅和邮件通知

如有问题，请参考：
- [Supabase 文档](https://supabase.com/docs)
- [Supabase JavaScript 客户端](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
