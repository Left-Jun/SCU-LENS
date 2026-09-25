# SCU LENS

四川大学摄影协会静态官网。

## 技术栈

- Astro
- Static output
- EdgeOne Pages
- Vercel
- GitHub Pages
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

构建产物输出到 `apps/site/dist/`。`main` 推送后与个人站一致，同时触发 EdgeOne Makers、Vercel 与 GitHub Pages 三路静态部署；`sculens.leftjun.com` 由 EdgeOne 承载正式域名。
