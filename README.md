# SCU LENS

四川大学摄影协会静态官网。

## 技术栈

- Astro
- Static output
- EdgeOne Pages
- Vercel
- GitHub

## 本地开发

```bash
npm ci
npm run dev:site
```

## 构建

```bash
npm run build:site
```

构建产物输出到 `apps/site/dist/`。`main` 推送后触发 EdgeOne Makers 与 Vercel 两路静态部署；`sculens.leftjun.com` 由 EdgeOne 承载正式域名，Vercel 仅作为备用与排错入口。GitHub 负责源码版本管理与两路自动部署的源仓库，不再使用 GitHub Pages。
