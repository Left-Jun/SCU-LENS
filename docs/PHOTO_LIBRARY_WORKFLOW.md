# SCU LENS 原图库工作流

## 原图库位置

`content/photo-library/`

该目录保存摄影协会原始归档图，作为人工分类与网站导入前的工作区。原图库不直接发布到网站，并已加入 `.gitignore`，避免原图误提交到 GitHub。

## 目录结构

- `未归档/`：尚未人工判断题材的图片。网站不读取、不展示。
- `校园/` → `category = campus`
- `人文/` → `category = humanity`
- `城市/` → `category = urban`
- `自然/` → `category = nature`
- `人像/` → `category = portrait`
- `动物/` → `category = animals`
- `metadata.csv`：作品元数据主表。
- `checksums.sha256`：原图完整性校验。
- `MIGRATION_AUDIT.md`：QQ 历史迁移最终审计记录。
- `MULTI_IMAGE_REAUDIT.md`：多图帖复核记录。
- `_migration-backup/`：迁移过程的必要备份，不参与网站读取。

## metadata 字段

`filename,date,section,author,title,title_source,description,caption,submission_id,tags,monthly_nine_issue`

其中：

- `section` 只表示原始投稿来源：相机组投稿 / 手机组投稿 / 胶片组投稿。
- `title` 是作品或整组图集标题；作者未提供标题时可由网站整理补题。
- `title_source` 建议写 `author` 或 `editorial`，用于区分作者原标题与整理补题；该字段不在前台显示。
- `description` 是整组作品的正文说明，可为空；不要再把作者名或标题塞进 description。
- `caption` 预留给单张图片自己的说明，可为空。
- `submission_id` 标识同一次频道投稿 / 同一图集。多张图属于同一投稿时必须保持相同值。
- `tags=每月九图` 表示作品曾入选每月九图。
- `monthly_nine_issue=YYYY-MM` 表示对应每月九图期次。
- 题材分类不写入原始投稿 section，而由图片所在六个正式题材目录决定。

## 人工分类流程

1. 新迁入且尚未判断题材的作品先放入 `未归档/`。
2. 人工查看后，将图片移动到六个正式题材目录之一。
3. 文件名保持不变，不重命名，不改原图。
4. 后续导入脚本仅扫描六个正式题材目录，不扫描 `未归档/`。
5. 导入脚本以 filename 关联 `metadata.csv`，生成网站需要的作品数据、浏览图与缩略图。

### 浏览图尺寸与查看器加载

- 日常作品先从归档原图生成 `960 / 1440 / 1800` 三档高质量 JPEG；AVIF / WebP 在构建阶段补齐。本地存在原图库时直接从归档原图编码，EdgeOne / Vercel / GitHub Actions 等云端构建没有私有原图库时，从对应尺寸的高质量 JPEG 展示档转码，不做放大。
- JPEG 继续作为兼容回退与“查看高清图”展示档；分类/作者列表优先通过 `<picture>` 协商 AVIF（Q58）/ WebP（Q82）。
- 分类页和作者页不再只依赖浏览器原生 `loading=lazy`：默认不写入真实 `src/srcset`，由 IntersectionObserver 在距离视口约 800px 时才激活图片请求，避免瀑布流页面提前拉取几十张图片。
- 图片查看器默认使用 1800 WebP，并且打开时只请求当前图片及前后各 1 张；继续翻页时才按需补载新的相邻图片，不再一次请求整个分类。
- 分类图库查看器当前显示“查看高清图”，仍指向 1800 JPEG 展示档；原始归档文件继续保留在本地原图库，不直接进入普通页面加载链路。每月九图中已经存在真实 original 资源的页面仍保留“查看原图”。
6. 只有进入正式题材目录的作品才进入网站展示。

### 当前分类的语义

六个目录目前只表示作品在网站中的**主要浏览入口**，不是严格、互斥的摄影学分类。

- 一张画面可能同时含有建筑、植物、人物、环境等多个题材；当前阶段先由人工选择一个主要入口。
- 后续如果需要让同一作品同时出现在多个题材下，应把题材层升级为多标签关系，而不是复制原图。
- `每月九图` 不属于题材分类，它始终是独立的专题 / 入选标识；作品仍按自身题材进入校园、人文、城市、自然、人像、动物之一。
- 同一期每月九图可以包含来自不同题材的作品；在各题材页里分别展示，同时通过 `tags` 与 `monthly_nine_issue` 关联回对应专题页。

## 网站导入

运行：

`npm run import:photos`

脚本会：

1. 只扫描六个正式题材目录，忽略 `未归档/`；
2. 用 filename 关联 `metadata.csv`；
3. 先生成 JPEG 960 / 1440 / 1800 浏览档；`npm run build:site` 会自动调用 Sharp 补齐同尺寸 AVIF / WebP 到 `public/images/gallery-generated/`；
4. 生成 `src/data/gallery.generated.json`；页面根据 JPEG `srcset` 推导对应 AVIF / WebP 地址，查看器把 1800 JPEG 地址映射为 1800 WebP；
5. 保留每月九图专题关系，题材分类与专题身份互不覆盖。

## 网站分类映射

| 文件夹 | 网站 slug |
| --- | --- |
| 校园 | `campus` |
| 人文 | `humanity` |
| 城市 | `urban` |
| 自然 | `nature` |
| 人像 | `portrait` |
| 动物 | `animals` |

## 当前归档基线

2026-09-25 最终迁移后：203 张图片 / 203 条 metadata；相机组 124、手机组 72、胶片组 7。当前全部原图先置于 `未归档/`，等待人工题材分类。
