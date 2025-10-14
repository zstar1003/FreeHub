# 🔧 GitHub Actions 权限问题解决方案

## ❌ 问题描述

出现以下错误：
```
remote: Permission to zstar1003/FreeHub.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/zstar1003/FreeHub/': The requested URL returned error: 403
Error: Process completed with exit code 128.
```

## ✅ 解决方案

### 方案 1：启用 GitHub Actions 工作流权限（推荐）

1. **进入仓库设置**
   - 打开你的 GitHub 仓库页面
   - 点击 **Settings**（设置）

2. **配置 Actions 权限**
   - 在左侧菜单中找到 **Actions** → **General**
   - 滚动到页面底部，找到 **Workflow permissions** 部分

3. **修改权限设置**
   - 选择 **Read and write permissions**（读写权限）
   - ✅ 勾选 **Allow GitHub Actions to create and approve pull requests**
   - 点击 **Save** 保存

4. **重新运行工作流**
   - 进入 **Actions** 页面
   - 选择失败的工作流运行
   - 点击 **Re-run all jobs**

### 方案 2：使用个人访问令牌（备用方案）

如果方案 1 不起作用，可以使用个人访问令牌：

1. **创建 Personal Access Token**
   - 访问 GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - 点击 **Generate new token** → **Generate new token (classic)**
   - 设置名称：`FreeHub Auto Update`
   - 勾选权限：`repo` (完整权限)
   - 点击 **Generate token**
   - **重要**：复制生成的 token（只显示一次）

2. **添加 Secret 到仓库**
   - 回到你的仓库
   - Settings → Secrets and variables → Actions
   - 点击 **New repository secret**
   - Name: `PAT_TOKEN`
   - Value: 粘贴刚才复制的 token
   - 点击 **Add secret**

3. **修改 workflow 文件**
   编辑 `.github/workflows/update-rankings.yml`，将：
   ```yaml
   - name: Checkout repository
     uses: actions/checkout@v4
     with:
       token: ${{ secrets.GITHUB_TOKEN }}
       persist-credentials: true
   ```

   改为：
   ```yaml
   - name: Checkout repository
     uses: actions/checkout@v4
     with:
       token: ${{ secrets.PAT_TOKEN }}
       persist-credentials: true
   ```

4. **提交并推送**
   ```bash
   git add .github/workflows/update-rankings.yml
   git commit -m "fix: use PAT for Actions push permissions"
   git push
   ```

## 🔍 验证修复

1. 进入仓库的 **Actions** 页面
2. 点击 **Update TIOBE Rankings** 工作流
3. 点击 **Run workflow**
4. 选择 `main` 分支，点击 **Run workflow**
5. 等待运行完成，检查是否成功

## 📋 成功标志

看到以下输出表示成功：
```
✅ TIOBE rankings data has been updated successfully!
```

并且在仓库中会有新的 commit：
```
chore: update TIOBE rankings data [skip ci]
```

## ❓ 常见问题

### Q: 为什么推荐方案 1？
A: 使用仓库设置的权限更简单、更安全，不需要管理额外的 token。

### Q: Personal Access Token 会过期吗？
A: 会的。创建时可以设置过期时间，过期后需要重新生成并更新 Secret。

### Q: 我应该选择哪个方案？
A: 优先尝试方案 1。只有在方案 1 不起作用时才使用方案 2。

### Q: 修改后还是不行怎么办？
A: 检查：
1. 仓库是否是私有的？私有仓库可能有额外限制
2. 是否在组织仓库下？可能需要组织管理员授权
3. 查看 Actions 运行日志获取更多错误信息

## 🎯 快速检查清单

- [ ] workflow 文件已添加 `permissions: contents: write`
- [ ] 仓库设置中启用了 **Read and write permissions**
- [ ] 已重新运行失败的工作流
- [ ] Actions 运行成功，有新的 commit 产生

## 📚 相关文档

- [GitHub Actions 权限文档](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)
- [配置工作流权限](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#permissions)

---

修改完成后，提交更新的 workflow 文件：

```bash
git add .github/workflows/update-rankings.yml
git commit -m "fix: add write permissions to GitHub Actions workflow"
git push
```

然后按照上述方案配置仓库权限即可！🎉
