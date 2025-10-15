// 许愿池管理脚本
// 在浏览器控制台运行此脚本以管理待审核的愿望

// 1. 导出待审核愿望
function exportPendingWishes() {
  const pending = localStorage.getItem('pendingWishes');
  if (!pending) {
    console.log('没有待审核的愿望');
    return;
  }

  const wishes = JSON.parse(pending);
  console.log(`发现 ${wishes.length} 个待审核愿望：`);
  console.log(JSON.stringify(wishes, null, 2));

  // 复制到剪贴板
  const text = JSON.stringify(wishes, null, 2);
  navigator.clipboard.writeText(text).then(() => {
    console.log('✅ 待审核愿望已复制到剪贴板！');
  });

  return wishes;
}

// 2. 清空待审核队列
function clearPendingWishes() {
  const count = JSON.parse(localStorage.getItem('pendingWishes') || '[]').length;
  localStorage.removeItem('pendingWishes');
  console.log(`✅ 已清空 ${count} 个待审核愿望`);
}

// 3. 批准愿望（添加到已通过列表）
function approveWish(wishId) {
  const pending = JSON.parse(localStorage.getItem('pendingWishes') || '[]');
  const approved = JSON.parse(localStorage.getItem('approvedWishes') || '[]');

  const wishIndex = pending.findIndex(w => w.id === wishId);
  if (wishIndex === -1) {
    console.log('❌ 未找到该愿望');
    return;
  }

  const wish = pending[wishIndex];
  const approvedWish = {
    ...wish,
    isImplemented: false,
    status: 'approved'
  };

  // 从待审核中移除
  pending.splice(wishIndex, 1);
  localStorage.setItem('pendingWishes', JSON.stringify(pending));

  // 添加到已通过
  approved.unshift(approvedWish);
  localStorage.setItem('approvedWishes', JSON.stringify(approved));

  console.log('✅ 愿望已批准:', approvedWish);
}

// 4. 拒绝愿望（移除）
function rejectWish(wishId) {
  const pending = JSON.parse(localStorage.getItem('pendingWishes') || '[]');
  const wishIndex = pending.findIndex(w => w.id === wishId);

  if (wishIndex === -1) {
    console.log('❌ 未找到该愿望');
    return;
  }

  const wish = pending[wishIndex];
  pending.splice(wishIndex, 1);
  localStorage.setItem('pendingWishes', JSON.stringify(pending));

  console.log('❌ 愿望已拒绝:', wish);
}

// 5. 显示所有已批准的愿望
function showApprovedWishes() {
  const approved = JSON.parse(localStorage.getItem('approvedWishes') || '[]');
  console.log(`已批准的愿望 (${approved.length} 个)：`);
  console.log(JSON.stringify(approved, null, 2));
  return approved;
}

// 6. 导出用于更新 wishes.json 的格式
function exportForWishesJson() {
  const approved = JSON.parse(localStorage.getItem('approvedWishes') || '[]');

  if (approved.length === 0) {
    console.log('没有已批准的愿望');
    return;
  }

  const formatted = approved.map(wish => ({
    id: wish.id,
    featureRequest: wish.featureRequest,
    similarProduct: wish.similarProduct || '',
    submitter: wish.submitter,
    isImplemented: wish.isImplemented || false,
    timestamp: wish.timestamp,
    status: 'approved'
  }));

  const json = JSON.stringify(formatted, null, 2);
  navigator.clipboard.writeText(json).then(() => {
    console.log('✅ 已格式化的愿望已复制到剪贴板！');
    console.log('请将内容粘贴到 public/wishes.json 中');
  });

  console.log(json);
  return formatted;
}

// 7. 统计信息
function getStats() {
  const pending = JSON.parse(localStorage.getItem('pendingWishes') || '[]');
  const approved = JSON.parse(localStorage.getItem('approvedWishes') || '[]');

  console.log('📊 统计信息:');
  console.log(`  待审核: ${pending.length} 个`);
  console.log(`  已批准: ${approved.length} 个`);

  return { pending: pending.length, approved: approved.length };
}

// 使用说明
console.log(`
🎯 许愿池管理工具已加载！

可用命令：
-------------------
exportPendingWishes()    - 导出所有待审核愿望
clearPendingWishes()     - 清空待审核队列
approveWish(id)          - 批准指定 ID 的愿望
rejectWish(id)           - 拒绝指定 ID 的愿望
showApprovedWishes()     - 显示所有已批准愿望
exportForWishesJson()    - 导出格式化的JSON用于更新文件
getStats()               - 查看统计信息

使用示例：
-------------------
// 1. 查看待审核愿望
exportPendingWishes()

// 2. 批准某个愿望
approveWish('1234567890123')

// 3. 导出到 wishes.json
exportForWishesJson()

// 4. 清理
clearPendingWishes()
`);
