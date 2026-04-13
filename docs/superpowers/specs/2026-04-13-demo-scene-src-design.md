# Design: demo-scene-src — TanStack Start 源码重建

**Date:** 2026-04-13
**Status:** Approved

---

## 背景

`demo-scene/` 目录包含一个 TanStack Start 应用的构建产物（bundle），用于部署到 Cloudflare Pages 作为 SCADA 项目 demo。目标是将该 bundle 逆向还原为可维护的源码项目，放置在 `demo-scene-src/` 目录中。

---

## 架构

### 框架选型

| 层次 | 技术 |
|------|------|
| 框架 | TanStack Start（基于 Vite 的 SSR React 框架）|
| 路由 | TanStack Router（文件路由） |
| 3D 渲染 | @react-three/fiber + @react-three/drei |
| 数据表格 | @tanstack/react-table |
| 样式 | Tailwind CSS v4 + 自定义 CSS 变量 |
| 字体 | Google Fonts (Fraunces + Manrope) |
| 语言 | TypeScript |

### 目录结构

```
demo-scene-src/
├── app/
│   ├── routes/
│   │   ├── __root.tsx          # 根布局：主题初始化 + Footer + <Outlet />
│   │   ├── index.tsx           # 路由 /：3D 输送线场景
│   │   ├── about.tsx           # 路由 /about：项目介绍
│   │   └── demo/
│   │       └── table.tsx       # 路由 /demo/table：数据表格
│   ├── components/
│   │   ├── Footer.tsx          # 页脚组件
│   │   └── ConveyorScene.tsx   # Three.js 场景（灯光 + 模型 + 控制器）
│   └── styles/
│       └── app.css             # Tailwind v4 入口 + CSS 变量定义
├── public/
│   ├── models/
│   │   └── conveyor.glb        # 输送线 3D 模型（从 demo-scene/ 复制）
│   ├── favicon.ico
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── app.config.ts               # TanStack Start 配置
├── package.json
├── tsconfig.json
└── vite.config.ts              # （如需自定义）
```

---

## 路由设计

从 bundle 中提取的路由树：

```typescript
// 路由结构（已从 bundle 还原）
const router = createRouter({
  routeTree,
  scrollRestoration: true,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})
```

| 路由 | 文件 | 说明 |
|------|------|------|
| `__root__` | `routes/__root.tsx` | 根布局，包含 Footer，挂载主题初始化脚本 |
| `/` | `routes/index.tsx` | 主页，全屏 3D 输送线场景 |
| `/about` | `routes/about.tsx` | 关于页面 |
| `/demo/table` | `routes/demo/table.tsx` | 数据表格示例页 |

---

## 组件详细设计

### 1. 根布局 `__root.tsx`

- 主题切换逻辑（从 localStorage 读取 `theme`，支持 `light`/`dark`/`auto`）
- 渲染 `<Outlet />` 承载子路由
- 渲染 `<Footer />` 组件
- `<Head>` 设置 title = "TanStack Start Starter"

### 2. Footer 组件（完全还原自 bundle）

```tsx
// 已从 bundle 中提取的完整结构
export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="shrink-0 border-t border-[var(--line)] px-4 pb-14 pt-10 text-[var(--sea-ink-soft)]">
      <div className="page-wrap flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <p className="m-0 text-sm">© {year} Your name here. All rights reserved.</p>
        <p className="island-kicker m-0">Built with TanStack Start</p>
      </div>
      <div className="mt-4 flex justify-center gap-4">
        {/* TanStack X + GitHub 链接 */}
      </div>
    </footer>
  )
}
```

### 3. 主页 3D 场景 `index.tsx` + `ConveyorScene.tsx`

从 bundle 完整还原的场景配置：

```tsx
// Canvas 配置
<Canvas
  camera={{ position: [14, 10, 18], fov: 45, near: 0.1, far: 50000 }}
  dpr={[1, 2]}
  shadows="soft"
  gl={{ antialias: true }}
>
  <Suspense fallback={null}>
    <SceneLights />
    <ConveyorModel />   {/* useGLTF('/models/conveyor.glb') */}
    <ContactShadows opacity={1} scale={40} blur={0.5} far={16} resolution={1024} color="#2c2c2c" frames={1} />
    <Environment preset="city" environmentIntensity={0.18} />
    <OrbitControls makeDefault enableDamping dampingFactor={0.06} minDistance={2} maxDistance={80} />
  </Suspense>
</Canvas>
```

灯光配置（已从 bundle 提取精确数值）：

| 灯光类型 | 参数 |
|---------|------|
| HemisphereLight | intensity=0.32, color=#b8d4de, groundColor=#141f1e |
| AmbientLight | intensity=0.14, color=#a8b8b5 |
| DirectionalLight（主） | position=[20,28,16], intensity=3.72, color=#fff6ed, shadows |
| DirectionalLight（副1）| position=[-16,12,-14], intensity=0.22, color=#8faabe |
| DirectionalLight（副2）| position=[6,8,-22], intensity=0.3, color=#6bb8a8 |
| PointLight | position=[10,4,8], intensity=0.18, color=#dceae8, distance=40 |

背景色：`#cfcfcf`
地面：PlaneGeometry 160×160，color=#f7f9fb，roughness=0.9，metalness=0.02

加载提示（中文）：`正在加载 3D 场景…`

### 4. About 页面（完全还原自 bundle）

```tsx
export default function AboutPage() {
  return (
    <main className="page-wrap mb-12 px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">About</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          A small starter with room to grow.
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          TanStack Start gives you type-safe routing, server functions, and modern SSR defaults.
          Use this as a clean foundation, then layer in your own routes, styling, and add-ons.
        </p>
      </section>
    </main>
  )
}
```

### 5. Table 页面（从 bundle 还原）

- 使用 `@tanstack/react-table` v8
- 功能：列过滤、全局搜索、分页（10/20/30/40/50 条/页）
- 操作按钮：`<<`, `<`, `>`, `>>` 分页，"Go to page" 输入框
- "Force Rerender" + "Refresh Data" 按钮
- 底部 JSON 预览（columnFilters + globalFilter）
- 暗色主题（bg-gray-800 系列）

---

## 样式设计

### CSS 变量（已从 bundle 还原）

```css
/* app.css */
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap');

:root {
  --font-sans: "Manrope", ui-sans-serif, system-ui, sans-serif;
  /* 以下变量需根据 light/dark 主题分别定义 */
  --sea-ink: ...;
  --sea-ink-soft: ...;
  --line: ...;
  --link-bg-hover: ...;
}
```

### 自定义 Tailwind 类

从 bundle 中识别的语义类：
- `page-wrap` — 页面宽度约束 + padding
- `island-shell` — 卡片容器样式
- `island-kicker` — 标签/小标题样式
- `display-title` — 大标题样式

---

## 构建与部署

### 构建目标

`demo-scene-src/` 构建后输出到 `demo-scene/`，保持与现有 CI/CD 工作流兼容：

```json
// package.json
{
  "scripts": {
    "dev": "vinxi dev",
    "build": "vinxi build",
    "build:demo": "vinxi build && cp -r .output/public/* ../demo-scene/"
  }
}
```

### CI/CD

现有 `.github/workflows/main.yml` 监听 `demo-scene/` 目录变化，部署到 Cloudflare Pages。构建后替换 `demo-scene/` 目录内容即可自动触发部署。

---

## 数据流

```
用户访问
  → TanStack Router 匹配路由
  → 加载对应路由组件（懒加载）
  → Suspense 显示加载状态（3D 场景显示"正在加载 3D 场景…"）
  → 组件渲染（3D 场景 / About / Table）
```

---

## 不在范围内

- 与现有 `client/`（amis + webpack）项目的整合
- 后端 API 对接
- 表格的真实数据来源（使用 mock 数据）
- 导航栏（bundle 中未发现明显的顶部 nav 组件）
