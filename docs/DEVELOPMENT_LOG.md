# SCU LENS Development Log

> 只记录有结构意义的开发节点。普通像素级 UI 微调不逐条记录。

## 2026-09-22 — 项目建立与首次上线

- 在 `D:\Desktop\SCU-LENS` 建立 Astro 静态站。
- 参考本机已有项目：
  - LeftJun-Web：Astro + EdgeOne；
  - LeftJun-Notes：Hugo 内容组织；
  - AI Survey：Next.js 与 EdgeOne 配置。
- 确定第一阶段使用 Astro Static Output。
- 建立首页、作品、活动、关于等基础页面。
- 建立 GitHub 仓库：`Left-Jun/SCU-LENS`。
- 首次部署至 Tencent EdgeOne。

## 2026-09-22 — 域名与 EdgeOne 全球项目

- 原 `scu-lens` EdgeOne 项目使用“全球可用区（含中国大陆）”。
- 因 `leftjun.com` 尚无中国大陆 ICP 备案，无法绑定自定义域名。
- 新建临时项目 `scu-lens-global`：
  - 全球可用区（不含中国大陆）；
  - 继续引用同一 GitHub 仓库；
  - 生产分支 main。
- DNSPod 添加：
  - `sculens CNAME sculens.leftjun.com.pages.dnsoe5.com`
- 自定义域名：
  - `https://sculens.leftjun.com`
- HTTPS 证书部署成功。
- Force HTTPS 开启。
- OCSP 开启。
- HSTS 暂时关闭。
- 生产环境变量：
  - `SITE_URL=https://sculens.leftjun.com`
- Sitemap 生成验证成功。

## 2026-09-22 — 内容分区第一次扩展

提交：

`70f1fc5 feat: expand SCU LENS visual sections`

确定一级导航：

- 首页
- 作品
- 每月九图
- 活动
- 加入我们
- 关于

首页增加：

- 每月九图
- 作品
- 频道投稿
- 活动
- 加入我们
- 联系与联动

新增：

- `/monthly-nine`
- `/join`

重构：

- `/gallery`
- `/about`

## 2026-09-22 — EdgeOne 自动部署问题

发现：

- GitHub push 已成功；
- EdgeOne 未自动出现新版。

处理：

- 手动“新建部署”；
- 对应部署 `dpaf9veud4fz` 成功。

从此建立规则：

> Push 后必须核对 EdgeOne 的真实生产部署，不能只以 GitHub push 成功为完成。

## 2026-09-22 — QQ 频道与每月九图历史资料

从协会旧频道记录中整理：

- 黄色
- 新春
- 繁花
- 春
- 江安青绿

QQ 频道：

- 频道号 `pd77222624`
- `https://pd.qq.com/s/g39qgegw0?b=9`

网站加入真实频道二维码。

## 2026-09-22 — 每月九图三级结构

提交：

`f69c130 feat: add monthly nine archive structure`

建立：

```text
/monthly-nine
/monthly-nine/2025-yellow
/monthly-nine/2025-yellow/golden-yellow
```

设计决定：

1. 总览页：每一期一个大卡片，只展示摘要。
2. 主题详情页：完整主题资料 + 逐件作品。
3. 多图作品：单独详情页，完整展开组图。

黄色期确认作品：

- Sebastian《金黄芒节》
- 一尾《捕捉阳光》
- 三川《金黄色的》（组图）

同时修正：

- 黄色期资料归入 2025，不再使用错误的 2024 标记。

## 2026-09-22 — 文档体系建立

新增：

- `docs/PROJECT_ARCHIVE.md`
- `docs/DEVELOPMENT_LOG.md`

目的：

- 避免后续新会话 / 新开发阶段重复推导整个项目；
- 作为结构性设计、技术架构、部署信息和内容模型的长期档案；
- 后续出现结构性变更时同步更新。

当前阶段：

**Framework Construction / 框架建设期**

在一级架构、内容模型、动态化方案稳定后再建立 Architecture Baseline。

## 2026-09-22 — 黄色详情页完整档案与工作区修复

- 检查工作区时发现 src/pages/monthly-nine/2025-yellow.astro 曾被误写为开发日志文本。
- 从当前 Git 基线恢复黄色详情页原有 Astro 页面结构，避免把错误内容继续提交。
- 按既定信息层级补齐黄色期完整主题档案：
  - /monthly-nine 继续只展示主题摘要；
  - /monthly-nine/2025-yellow 展示完整主题文案、评选说明、档案备注和入选作品；
  - /monthly-nine/2025-yellow/golden-yellow 继续作为《金黄色的》完整组图层级。
- 黄色期真实图片仍未正式接入。此前图片中转残留的数据存在截断，且临时缓存无法可靠确认作品对应关系，因此不作为正式图片源。
- 增加临时文件忽略规则，防止图片中转缓存、部署截图和探针文件进入正式仓库。
