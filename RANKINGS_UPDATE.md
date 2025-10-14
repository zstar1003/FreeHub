# TIOBE 编程语言排行榜数据更新指南

## 当前数据
- 数据文件：`public/rankings.json`
- 更新时间：2025年10月
- 数据来源：[TIOBE Index](https://www.tiobe.com/tiobe-index)

## 如何更新数据

### 方式一：手动更新（推荐）

1. 访问 [TIOBE Index 官网](https://www.tiobe.com/tiobe-index)
2. 查看最新的 Top 20 编程语言排行榜
3. 编辑 `public/rankings.json` 文件，更新以下信息：
   - `rank`: 当前排名
   - `prevRank`: 上月排名
   - `language`: 编程语言名称
   - `rating`: 评分（百分比）
   - `change`: 排名变化（正数为上升，负数为下降，0为不变）

4. 更新 `src/components/RankingPage.tsx` 中的 `lastUpdate` 变量（第17行）

### 方式二：使用自动化脚本（可选）

由于 TIOBE 网站可能有反爬虫机制，推荐使用手动更新。如果需要自动化，可以考虑：

1. 使用第三方 API（如果有）
2. 编写服务端爬虫脚本（需要处理 CORS 和反爬虫）
3. 使用浏览器扩展手动导出数据

## 数据格式示例

```json
[
  {
    "rank": 1,
    "prevRank": 1,
    "language": "Python",
    "rating": 24.45,
    "change": 0
  }
]
```

## 注意事项

- 确保 JSON 格式正确
- `change` 字段应该等于 `prevRank - rank`
- 评分 `rating` 应该是百分比数值（不需要 % 符号）
- 更新后记得修改更新时间
