# 杨正宇个人作品集

当前正式入口是根目录的 `index.html`，交互逻辑在 `app.js`，样式在 `styles.css`。项目继续使用现有的 Vite 构建环境。

## 已实现

- 三幕固定首屏：人物姿态、个人简介、项目经历随滚动连续推进
- WebGL 水面折射与鼠标轨迹涟漪
- 桌面端滚动、点击推进，移动端触控滑动
- 六个可浏览项目入口
- Behance 式独立作品弹窗、视频播放、上一件/下一件和关闭返回
- 桌面、平板与手机响应式布局
- 减少动态效果系统设置支持

## 本地运行

```powershell
npm install
npm run dev
```

## 生产构建

```powershell
npm run build
npm run preview
```

构建后的静态文件位于 `dist/`，可以部署到任意静态托管平台。

## 素材说明

- 首屏人物素材位于 `public/assets/site/hero/`
- 项目封面位于 `public/assets/site/projects/`
- 网页使用的 12 秒项目预览位于 `public/assets/site/previews/`
- 原始作品与拍摄素材仍保留在原有目录，没有被移动或覆盖
- 页面只公开邮箱，不展示出生日期与手机号

根目录 `src/` 中是此前保留的 React 实验组件，当前正式页面不依赖它们，也没有删除原有内容。
