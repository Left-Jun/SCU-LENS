# SCU LENS UI / 视觉冻结基线

> 状态：**FROZEN / 已冻结**
> 首次冻结日期：2026-09-27
>
> 当前重新确认：2026-09-28
>
> 初始 UI 标签：`ui-baseline-2026-09-27`
>
> 当前架构 / UI 联合基线：`architecture-baseline-2026-09-28`

除非明确提出“修改规范 / 解冻某项规则”，后续功能开发不得顺手改变本文档记录的审美、字号、间距、图片比例、作品分组和图片查看器信息层级。

## 1. 总体审美

- 米白 / 黑 / 暖灰；编辑部、摄影刊物感。
- 图片优先，功能入口轻，不做后台管理器式 UI。
- 避免无必要的圆角卡片、阴影、大按钮、头像 Feed、点赞评论噪音。
- 英文 Eyebrow 只做辅助层级，不抢中文主标题。
- 摄影作品尊重原始比例；封面类入口可使用固定比例。
- 页面说明使用与本页内容直接相关的陈述句，不写构建说明、人工整理说明或系统实现说明。

基础色值：
```css
--ink:#11110f;
--muted:#70706a;
--paper:#f4f1e8;
--line:rgba(17,17,15,.16);
--panel:rgba(255,255,255,.58);
--accent:#c83a2d;
--dark:#151513;
```

## 2. 字体与字号

正文 / UI 使用 Sans：
`Inter, Segoe UI Variable, Segoe UI, PingFang SC, Microsoft YaHei, Noto Sans SC, system-ui, sans-serif`

展示 Serif：
`Iowan Old Style, Baskerville, Songti SC, STSong, Noto Serif SC, Source Han Serif SC, SimSun, Times New Roman, serif`

Desktop：
```css
--font-body:.95rem;
--font-small:.7rem;
--line-body:1.78;
```

Mobile ≤700px：
```css
--font-body:.9rem;
--font-small:.68rem;
--line-body:1.68;
```

Eyebrow：
```css
font-size:var(--font-small);
font-weight:700;
line-height:1.35;
letter-spacing:.14em;
text-transform:uppercase;
```

一级页标题：
```css
font-family:var(--font-sans);
font-weight:600;
letter-spacing:-.05em;
line-height:.92;
font-size:clamp(3.8rem,7vw,6.4rem);
```
Mobile：`clamp(3rem,14vw,4.5rem)`。

## 3. 全局间距

Desktop：
```css
--space-page-top:32px;
--space-page-bottom:26px;
--space-section-top:42px;
--space-section-bottom:42px;
--space-heading-gap:22px;
```

Mobile：
```css
--space-page-top:26px;
--space-page-bottom:18px;
--space-section-top:22px;
--space-section-bottom:22px;
--space-heading-gap:18px;
```

页面宽度：`.page-shell = min(1180px, calc(100% - 40px))`。

普通 section：
```css
padding:var(--space-section-top) 0 var(--space-section-bottom);
border-top:1px solid var(--line);
```

## 4. 一级页头

适用于作品、全部作品、分类页、作者页、每月九图、活动、投稿、加入我们、关于。

Desktop：
```css
.page-hero {
  display:grid;
  grid-template-columns:minmax(0,1fr) minmax(340px,.72fr);
  gap:clamp(38px,7vw,110px);
  align-items:end;
  padding:var(--space-page-top) 0 18px;
}
```

Mobile：
```css
.page-hero {
  display:block;
  padding:var(--space-page-top) 0 14px;
}
```

规则：
- 左侧 Eyebrow + 大标题，右侧页面描述。
- Desktop 标题与描述底部视觉对齐。
- 描述文本到底部分割线距离统一，不允许某页单独写出另一套节奏。
- Mobile 一级标题与描述统一保持 `14px` 的标题后间距；「每月九图」不得用更具体的 `.monthly-hero p { margin:0; }` 将其清零。
- 页头文案回答“这一页是什么 / 能看到什么”，不回答“网站怎么构建”。

### Footer 品牌与身份说明（2026-09-28 重新冻结）

Desktop / Mobile 共同使用 2×2 对齐结构：

```text
SCU LENS       四川大学摄影协会
SINCE 1982     学生组织 · 非四川大学官方网站
```

- `SINCE 1982` 与右侧身份说明必须处于同一视觉行；
- 两行由同一 CSS Grid 控制，不允许再拆成两个各自计算高度的容器造成错位；
- Mobile 下方三组内容为：品牌区 → footer 导航 → slogan / Built by；
- Mobile 三组间距当前为约 `20px`，既不贴紧，也不恢复为大块松散留白；
- `Built by Left Jun · 2026` 保留；
- ICP 备案号仅在真实备案完成后加入。

## 5. 作品首页「查看全部」

`/gallery` 不保留搜索框。“查看全部 →”不是独立 section，也不是第七个分类。

Desktop：
```css
.gallery-overview { padding-bottom:18px; }
.view-all-link {
  position:absolute;
  right:0;
  bottom:-8px;
  font-size:.78rem;
}
```

Mobile：
```css
.gallery-overview { padding-bottom:14px; }
.view-all-link {
  bottom:-2px;
  font-size:.76rem;
}
```

含义：
- 描述文字仍决定与下方分割线的距离。
- Desktop 的“查看全部”比描述底部略低，接近左侧“作品”大标题最低点。
- Mobile 保持近似与描述底部对齐，只轻微下移。
- 不得重新单独成行。

## 6. 全部作品与投稿分组

`/gallery/all`：
- 按投稿时间从新到旧。
- 不按题材分类。
- 当前无搜索。
- **一次投稿 = 一个作品卡片**。
- 组图不拆开；分类、投稿来源、每月九图只是附加关系。
- 2026-09-27 后续明确解冻并重新冻结“桌面作品流列数 / 宽度”：全部作品、六个分类页、作者作品页统一为 2 列瀑布流。
- Desktop 作品流可突破 1180px 页头宽度，最大扩展到 1440px；页头、导航和其它 section 不变。
- Desktop 列间距 24px；≤980px 回到普通页面宽度并保持 2 列；≤700px 为 1 列。
- 此规则只作用于作品归档流，不作用于每月九图总览、主题页、组图页或图片查看器。

### 每月九图完整组图页
- 每月九图的“查看完整组图”详情页保留 12 栏错落排版，不改为普通作品墙。
- Desktop 组图间距冻结为 `22px 12px`，图注距图片 `6px`，减少大屏空白。
- Mobile 保持原有较松节奏：单列、纵向间距 `42px`、图注距图片 `9px`。
- 此调整只作用于完整组图页，不改变每月九图主题页或全局图片查看器。

分组源逻辑：
```text
日期 + 投稿组别 + 作者 + 描述/标题 + 每月九图期次
```

如果历史 metadata 缺失导致同一投稿被拆开，应修正 metadata，不在页面层临时拼接。

已确认：
- 2026-03-16 卡乐C 01–09 为同一图集。
- 标题统一为：`樱花飘落的速度是每秒5厘米`。
- “宫保鸡丁”与“泽”为同一作者身份；历史署名可保留。

## 7. 图片规则

- 真实摄影作品保持原始纵横比。
- 查看器使用 `object-fit:contain`。
- 不为了整齐强制裁切作品本体。
- 分类封面等明确的入口视觉可以使用固定比例；当前分类卡封面为 4:3。
- 每月九图不维护独立图片副本；同一照片通过 gallery item ID 在作品、作者、每月九图之间复用。
- 派生浏览图位于 `public/images/gallery-generated`。

## 8. 全局图片查看器

全站只有一套共享 Photo Viewer，由 `src/layouts/BaseLayout.astro` 提供。分类页、作者页、每月九图不得另做第二套。

### 分割线上方：可变关系信息

包含：
- 作品标题；
- 左侧：摄影 / 作者，或作者页上下文中的分类；
- 右侧：`每月九图 · 期次`（存在时）；
- 描述；
- 作者 / 分类 / 每月九图可点击时统一下划线。

Mobile 关系行：
```css
font-size:.78rem;
line-height:1.25;
gap:12px;
```

左侧与右侧必须：
- 字号一致；
- 行高一致；
- 颜色一致；
- 下划线规格一致。

链接下划线：
```css
border-bottom:1px solid rgba(255,255,255,.34);
padding-bottom:1px;
```

### 分割线下方：永久固定信息

第一行：
```text
投稿组别 · 日期
```

第二行：
```text
当前张 / 总张数                         查看高清图 ↗
```

分割线下方**永远不放**作者、分类、每月九图、tag。

数据源：
```text
投稿组别 = data-viewer-section
日期     = data-viewer-date
```

### Mobile 当前精确值

```css
.photo-viewer-info {
  padding:10px 20px calc(10px + env(safe-area-inset-bottom));
}
.photo-viewer-copy h2 {
  margin:6px 0 3px;
  font-size:clamp(1.55rem,6.9vw,2.2rem);
  line-height:1.02;
}
.photo-viewer-description {
  margin-top:8px;
  font-size:.81rem;
  line-height:1.48;
}
.photo-viewer-footer {
  margin-top:4px;
  padding:4px 0 0;
  min-height:36px;
}
.photo-viewer-footer div { gap:3px; font-size:.62rem; }
.photo-viewer-footer strong { font-size:.84rem; }
.photo-viewer-footer a { font-size:.66rem; padding-bottom:3px; }
```

视觉意图：作者/专题行不能贴死分割线；分割线上下呼吸感接近；投稿来源与日期保持次要层级。

### Desktop 当前精确值

```css
.photo-viewer-stage {
  grid-template-columns:minmax(0,1fr) minmax(300px,28vw);
}
.photo-viewer-slide {
  padding:40px 24px 40px 56px;
}
.photo-viewer-info {
  padding:clamp(72px,9vh,120px) clamp(30px,4vw,60px) 34px;
}
.photo-viewer-footer {
  margin-top:auto;
  padding-top:24px;
}
```

关闭按钮必须始终可点：`z-index:20; pointer-events:auto;`。

## 9. 文案规范

页面描述使用自然陈述句，并与当前页面内容直接相关。

推荐：
> 这里汇集摄协成员记录下的校园、人文、城市、自然、人像与动物影像，六种题材共同构成持续生长的作品档案。

禁止把以下内容放进访客页头：
- 当前分类来自人工整理；
- 未归档作品暂不展示；
- 页面构建 / 数据结构 / 技术实现解释；
- 其它面向开发者而非访客的说明。

## 10. 修改纪律

冻结后默认禁止：
- 为一个新功能顺手改全局字号或间距；
- 为某一页单独重写 `.page-hero` 节奏；
- 改变查看器上下信息层级；
- 把每月九图重新放回分割线下；
- 把“查看全部”重新做成独立一行；
- 把组图拆成多个作品卡片；
- 为整齐而裁切真实作品；
- 无明确需求新增后台式搜索、大圆角卡片、重阴影等。

需要改变时，先明确“解冻哪条规则、为什么、影响哪些页面”，并同步更新本文档。

## 11. 每次 UI 改动后的检查

至少执行：
```bash
npm run build:site
npm run check:links
npm run validate:media
```

至少目测：
- Desktop / Mobile 作品首页；
- `/gallery/all`；
- 一个分类页；
- 一个作者页；
- 一个普通查看器；
- 一个带每月九图关系的查看器；
- 一个组图；
- 一个每月九图主题页。

重点：
- 页头描述到底部分割线距离；
- 查看全部的位置；
- 原图比例；
- 同一投稿是否仍为一个卡片；
- 查看器分割线上下信息是否正确；
- 关闭按钮及作者 / 分类 / 专题链接是否可点。

## 12. 查看 / 对比 / 回滚

冻结标签：
```text
ui-baseline-2026-09-27
```

查看基线：
```bash
git show ui-baseline-2026-09-27 --stat
```

对比当前版本：
```bash
git diff ui-baseline-2026-09-27..HEAD
```

只看 UI：
```bash
git diff ui-baseline-2026-09-27..HEAD -- src/styles src/layouts src/components src/pages
```

恢复单文件：
```bash
git restore --source ui-baseline-2026-09-27 -- src/styles/global.css
```

恢复全局查看器：
```bash
git restore --source ui-baseline-2026-09-27 -- src/layouts/BaseLayout.astro src/styles/global.css
```

恢复作品体系：
```bash
git restore --source ui-baseline-2026-09-27 -- src/pages/gallery.astro src/pages/gallery src/components/GallerySubmissionCard.astro
```

整体回退优先使用 revert 提交，不强推覆盖 main。若要从基线单独修复，可创建：
```bash
git switch -c restore-ui-baseline ui-baseline-2026-09-27
```

## 13. 核心文件

视觉：
`src/styles/global.css`、`src/layouts/BaseLayout.astro`

作品：
`src/pages/gallery.astro`、`src/pages/gallery/all.astro`、`src/pages/gallery/[slug].astro`、`src/pages/authors/[id].astro`、`src/components/GallerySubmissionCard.astro`、`src/lib/gallery-archive.ts`

每月九图：
`src/components/MonthlyIssuePage.astro`、`src/components/MonthlyGroupPage.astro`、`src/lib/monthly-nine.ts`、`src/pages/monthly-nine*`

本文件是 2026-09-27 之后 UI 调整的优先检查依据。
