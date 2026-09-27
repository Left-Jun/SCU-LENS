# SCU LENS Architecture Baseline / 架构冻结说明

> 状态：**FROZEN / 已冻结**
>
> 冻结日期：**2026-09-28**
>
> 基线标签：`architecture-baseline-2026-09-28`
>
> 适用范围：公开站点的信息架构、路由职责、内容关系、共用布局、部署链路与文档入口。

本文件是当前 SCU LENS 静态阶段的**主架构说明**。后续如果只是补照片、改文案、增加一期「每月九图」或增加投稿，不应重写这里的一级结构；如果要增加一级栏目、改变作品数据模型、拆分新的查看器、改变生产部署主链路，则必须先明确“解冻”，同步修改本文档并在 `DEVELOPMENT_LOG.md` 记录原因。

---

## 1. 项目定位

SCU LENS 是四川大学摄影协会学生维护的影像展示与长期归档站点。

当前网站负责：

- 展示摄影协会的影像与活动；
- 沉淀 QQ 频道中的摄影投稿；
- 维护「每月九图」专题时间线；
- 按题材、作者、投稿批次组织作品；
- 提供投稿、加入协会、联系与联动入口。

网站不是四川大学官方网站。页脚固定保留：

```text
SCU LENS                 四川大学摄影协会
SINCE 1982               学生组织 · 非四川大学官方网站
```

并保留：

```text
记录光，也记录我们在川大的这一段时间。
BUILT BY LEFT JUN · 2026
```

备案完成前不放置虚构 ICP 备案号。

---

## 2. 技术基线

- Framework：Astro
- Output：Static
- Node：22.x
- 源码仓库：GitHub `Left-Jun/SCU-LENS`
- 生产分支：`main`
- 正式承载：EdgeOne Pages / Makers
- 备用与排错：Vercel
- GitHub：源码与两路自动部署源，不使用 GitHub Pages

构建：

```bash
npm ci
npm run build:site
```

产物：

```text
apps/site/dist/
```

---

## 3. 一级导航与信息架构

当前顶部导航顺序冻结为：

```text
首页 → 每月九图 → 作品 → 活动 → 投稿 → 加入我们 → 关于
```

对应路由：

| 栏目 | 路由 | 源文件 | 主要职责 |
| --- | --- | --- | --- |
| 首页 | `/` | `src/pages/index.astro` | 品牌首页、栏目预览、当前活动与入口聚合 |
| 每月九图 | `/monthly-nine` | `src/pages/monthly-nine.astro` | 当前一期、往期总览、投稿入口 |
| 作品 | `/gallery` | `src/pages/gallery.astro` | 六个题材分类入口与作品库说明 |
| 活动 | `/events` | `src/pages/events.astro` | 近期活动、每月九图状态、长期项目、历史活动 |
| 投稿 | `/submit` | `src/pages/submit.astro` | QQ 频道投稿流程与二维码 |
| 加入我们 | `/join` | `src/pages/join.astro` | 部门介绍、加入方式、会长信箱 |
| 关于 | `/about` | `src/pages/about.astro` | 协会定位、网站与 QQ 频道关系、联系与联动 |

---

## 4. 各页面冻结说明

### 4.1 首页 `/`

首页不是功能面板，而是摄影协会的视觉入口。结构顺序：

1. Hero：`SCU LENS · Photography & Memory` +「记录此刻，也留下我们。」；
2. 每月九图：四期 2×2 总览，只显示月份与主题；
3. 作品：只预览前四个题材分类；
4. 活动：当前最重要事件 + 每月九图当前状态；
5. 加入我们 / 联系与联动；
6. 页尾品牌与声明。

首页「每月九图」时间线当前文案使用：

```text
从秋日的黄色，到新春、繁花与盛夏江安的青绿。
```

作品来源说明冻结为：

```text
作品来自摄影协会 QQ 频道。
```

「每月九图」是从 QQ 频道投稿中进一步筛选与组织的专题身份，因此不与 QQ 频道并列写成两个来源。

### 4.2 每月九图 `/monthly-nine`

职责：当前一期 + 历史专题时间线，而不是普通作品分类页。

结构：

1. 一级页头；
2. 当前一期完整文案与状态；
3. 当前一期主视觉；
4. 往期主题 2×2 总览；
5. 投稿引导与 QQ 频道二维码。

当前历史顺序：

```text
2025.12 黄色
2026.01 新春
2026.03 繁花
2026.05—07 江安青绿
```

移动端一级页头的标题—描述距离必须与其它一级页面一致：描述使用统一 `margin-top:14px`，不得再被 `.monthly-hero p { margin:0; }` 覆盖。

### 4.3 每月九图主题页

路由示例：

```text
/monthly-nine/2025-yellow
/monthly-nine/2026-spring-festival
/monthly-nine/2026-blossom
/monthly-nine/2026-jiang-an-green
```

职责：展示某一期的完整主题文案、入选投稿与下一期关系。主题页中的作品引用作品库数据，不维护第二份独立照片副本。

### 4.4 每月九图完整组图页

路由示例：

```text
/monthly-nine/2025-yellow/golden-yellow
/monthly-nine/2026-spring-festival/lion-fireworks
/monthly-nine/2026-blossom/butterfly-flower
```

职责：展示一次完整组图投稿。Desktop 使用杂志式 12 栏错落布局；Mobile 单列。不可改成普通 gallery 瀑布流。

### 4.5 作品 `/gallery`

当前题材固定为：

```text
校园 / 自然 / 人文 / 城市 / 人像 / 动物
```

一张照片可以属于多个题材；题材不是互斥目录。

首页只显示前四个分类预览；作品页展示六个分类，并保留「查看全部」入口。

### 4.6 全部作品 `/gallery/all`

- 按投稿时间从新到旧；
- 一次投稿 = 一个作品卡片；
- 多图投稿不能拆成多个独立卡片；
- Desktop 两列、最大 1440px；
- Mobile 单列；
- 作者、来源、题材、每月九图身份都属于同一投稿的 metadata。

### 4.7 分类页 `/gallery/[slug]`

展示某题材下的投稿，但仍然保持「一次投稿 = 一个卡片」。同一投稿可以同时出现在多个分类页中。

当前 slug：

```text
campus / nature / humanity / urban / portrait / animals
```

### 4.8 作者页 `/authors/[id]`

点击作者名进入。展示该作者全部投稿，并继续按投稿批次成卡，不拆组图。

在作者页打开全局图片查看器时，左下关系信息显示题材标签，而不是重复显示作者名。

### 4.9 活动 `/events`

结构冻结为：

1. 近期活动；
2. 每月九图当前状态；
3. 长期项目；
4. 过去记录。

首页只承担当前状态预览，完整活动时间线在本页沉淀。

### 4.10 投稿 `/submit`

唯一正式投稿入口。日常作品与每月九图专项均通过四川大学摄影协会 QQ 频道投稿，再由协会整理、筛选和归档。

页面包含：

- 投稿方式；
- 相机 / 手机 / 胶片分区说明；
- QQ 频道二维码；
- 打开 QQ 频道入口；
- 权利与投稿说明。

### 4.11 加入我们 `/join`

结构：

1. 协会加入说明；
2. 三个部门：技术部、活动部、宣传部；
3. 在摄协中能获得 / 经历的内容；
4. 申请加入；
5. 会长信箱；
6. 补充说明。

会长信箱是加入与联系场景中的统一邮箱入口。

### 4.12 关于 `/about`

说明协会做什么、QQ 频道与 SCU LENS 如何分工，以及联系与联动入口。

核心关系：

```text
QQ 频道：即时投稿、日常分享、原始来源
SCU LENS：长期收录、主题整理、作者与活动档案
```

---

## 5. 共享布局与视觉结构

所有一级页面共用 `src/layouts/BaseLayout.astro`，其中统一提供：

- 顶部品牌与主导航；
- 页面 `<head>` / favicon / metadata；
- 全站 footer；
- 全局唯一 Photo Viewer；
- 图片延迟加载逻辑。

一级页头使用统一 `.page-hero`。Mobile 标题与描述的视觉间距不允许某页面单独覆写成不同节奏。

### Footer 冻结结构

Desktop 与 Mobile 都采用同一 2×2 品牌关系：

```text
SCU LENS       四川大学摄影协会
SINCE 1982     学生组织 · 非四川大学官方网站
```

四个 footer 导航：

```text
每月九图 / 投稿 / 加入我们 / 联系与联动
```

Mobile 三组信息的垂直节奏为：品牌区 → 导航 → slogan/署名；组间距当前冻结为约 `20px`，不再拉成三个松散的大区块。

---

## 6. 作品内容模型

核心对象不是“单张照片”，而是一次投稿 `submission`。

```text
Submission
├─ date
├─ author
├─ title / description
├─ source section: 手机 / 相机 / 胶片
├─ images[]
├─ categories[]
└─ monthlyNine?  专题关系
```

规则：

- `images[]` 可以有 1 张或多张；
- 多图投稿永远作为一个投稿单元；
- `categories[]` 可以多选；
- `monthlyNine` 是专题标签 / 关系，不是题材分类；
- 同一图片不因为进入每月九图就复制第二份源文件；
- 未归档内容不进入公开站点。

---

## 7. 全局图片查看器

全站只允许 `BaseLayout.astro` 中这一套查看器。

它负责：

- 左右切换；
- Mobile 横向滑动；
- 原始比例 `contain`；
- 查看高清图；
- 作者 / 分类 / 每月九图关系跳转；
- 来源、日期、序号；
- 每月九图末尾的下一期预览。

不得在分类页、作者页或每月九图页再创建第二套 viewer。

---

## 8. 图片与性能

- 原图与浏览图分离；
- 页面默认优先加载浏览图；
- 高清图由查看器显式进入；
- gallery 派生浏览图位于 `public/images/gallery-generated/`；
- 真实摄影作品不为统一卡面强裁切；
- 只有分类入口封面等明确 UI 入口允许固定比例。

---

## 9. 部署拓扑

冻结拓扑：

```text
本地开发
  ↓
GitHub main
  ├─ EdgeOne Makers → 正式站点 / 自定义域名
  └─ Vercel          → 备用与排错
```

GitHub Pages 已从当前生产链路移除。

详细参数见：`docs/DEPLOYMENT_TOPOLOGY.md`。

---

## 10. 文档职责

| 文件 | 作用 |
| --- | --- |
| `README.md` | GitHub 仓库首页与快速导航 |
| `docs/ARCHITECTURE_BASELINE.md` | 当前冻结架构、路由、页面职责、内容关系 |
| `docs/UI_VISUAL_BASELINE.md` | 精确视觉、间距、图片与 viewer 基线 |
| `docs/CONTENT_UPDATE_GUIDE.md` | 日常更新内容时怎么改 |
| `docs/PHOTO_LIBRARY_WORKFLOW.md` | QQ 历史作品迁移与图片归档流程 |
| `docs/DEPLOYMENT_TOPOLOGY.md` | GitHub / EdgeOne / Vercel 部署拓扑 |
| `docs/DEVELOPMENT_LOG.md` | 结构性变更日志 |
| `docs/PROJECT_ARCHIVE.md` | 项目从建立至今的完整设计档案 |

---

## 11. 冻结规则

以下变更必须先解冻再做：

- 增删一级导航；
- 改变一级路由职责；
- 将一次投稿拆成单图卡片；
- 把每月九图改成普通题材分类；
- 增加第二套图片查看器；
- 改变 GitHub → EdgeOne / Vercel 的生产拓扑；
- 大范围重写全站视觉节奏。

以下不需要解冻：

- 增加新作品；
- 增加作者；
- 新增一期每月九图；
- 更新活动状态；
- 修正文案、metadata 或错误分类；
- 不改变信息层级的响应式 bug 修复。

架构解冻与重新冻结必须同时完成：代码、本文档、`UI_VISUAL_BASELINE.md`（如涉及视觉）、`DEVELOPMENT_LOG.md`、Git 提交与新的基线标签。
