# SCU LENS

四川大学摄影协会学生维护的影像展示与作品归档站点。

**学生组织 · 非四川大学官方网站**

> 当前状态：**Architecture Baseline / 架构已冻结（2026-09-28）**
>
> 基线标签：`architecture-baseline-2026-09-28`

## 网站结构

```text
首页
├─ 每月九图
│  ├─ 当前一期
│  ├─ 往期主题
│  └─ 完整组图
├─ 作品
│  ├─ 全部作品
│  ├─ 校园 / 自然 / 人文 / 城市 / 人像 / 动物
│  └─ 作者档案
├─ 活动
├─ 投稿
├─ 加入我们
└─ 关于 / 联系与联动
```

顶部导航顺序：**首页 → 每月九图 → 作品 → 活动 → 投稿 → 加入我们 → 关于**。

### 页面说明

| 页面 | 路由 | 用途 |
| --- | --- | --- |
| 首页 | `/` | 品牌主视觉、每月九图 / 作品 / 活动预览、加入与联系入口 |
| 每月九图 | `/monthly-nine` | 当前一期、历期主题时间线、QQ 频道投稿入口 |
| 作品 | `/gallery` | 六个题材分类与作品档案入口 |
| 全部作品 | `/gallery/all` | 按投稿批次查看全部归档作品 |
| 分类页 | `/gallery/[slug]` | 校园、自然、人文、城市、人像、动物分类 |
| 作者页 | `/authors/[id]` | 某作者全部投稿 |
| 活动 | `/events` | 近期活动、每月九图状态、长期项目与历史记录 |
| 投稿 | `/submit` | QQ 频道投稿方式、二维码与规则 |
| 加入我们 | `/join` | 三部门、申请方式、会长信箱 |
| 关于 | `/about` | 协会说明、QQ 频道 × SCU LENS 分工、联系与联动 |

完整页面结构、数据关系和冻结规则见 **[Architecture Baseline](docs/ARCHITECTURE_BASELINE.md)**。

## 技术与部署

- Astro Static Output
- GitHub `main` 作为源码与自动部署源
- EdgeOne Makers 承载正式站点
- Vercel 作为备用与排错入口
- 不使用 GitHub Pages

```text
Local → GitHub main
              ├─ EdgeOne Makers → Production
              └─ Vercel          → Backup / Debug
```

详细部署参数见 **[Deployment Topology](docs/DEPLOYMENT_TOPOLOGY.md)**。

## 本地开发

```bash
npm ci
npm run dev:site
```

## 构建

```bash
npm run build:site
```

构建产物输出到 `apps/site/dist/`。

## 文档

- **[架构冻结说明](docs/ARCHITECTURE_BASELINE.md)** — 路由、各页面职责、内容模型、共享组件与冻结边界
- **[UI / 视觉冻结基线](docs/UI_VISUAL_BASELINE.md)** — 字体、间距、作品流、图片查看器、Footer 等视觉规范
- **[内容更新指南](docs/CONTENT_UPDATE_GUIDE.md)** — 新增作品、主题、活动时如何修改
- **[作品迁移工作流](docs/PHOTO_LIBRARY_WORKFLOW.md)** — QQ 频道历史作品整理、metadata 与图片归档
- **[部署拓扑](docs/DEPLOYMENT_TOPOLOGY.md)** — EdgeOne / Vercel / GitHub 配置
- **[开发日志](docs/DEVELOPMENT_LOG.md)** — 结构性开发节点
- **[项目完整档案](docs/PROJECT_ARCHIVE.md)** — 项目建立原因、设计演进与长期规划

## 核心冻结规则

- 一次投稿始终作为一个作品单元，多图投稿不拆卡；
- 一张图可以属于多个题材；
- 「每月九图」是专题关系，不是题材分类；
- QQ 频道是投稿原始来源，SCU LENS 负责长期沉淀；
- 全站只使用 `BaseLayout.astro` 中的一套图片查看器；
- 结构性改动需先解冻、更新文档、记录日志并重新建立基线标签。
