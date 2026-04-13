# demo-scene-src Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `demo-scene-src/` 目录下创建 TanStack Start 源码项目，完整还原 `demo-scene/` bundle 中的功能（3D 输送线场景、About 页、数据表格页）。

**Architecture:** 使用 TanStack Start（基于 Vinxi/Vite 的 SSR 框架）+ TanStack Router 文件路由。3D 场景用 @react-three/fiber + @react-three/drei 渲染 conveyor.glb 模型。样式使用 Tailwind CSS v4 + 自定义 CSS 变量。构建输出覆盖 `demo-scene/` 以触发现有 CI/CD 部署。

**Tech Stack:** TanStack Start, TanStack Router, TanStack Table v8, @react-three/fiber, @react-three/drei, Three.js r183, Tailwind CSS v4, TypeScript, Vite/Vinxi

---

## File Map

| 文件 | 职责 |
|------|------|
| `demo-scene-src/package.json` | 依赖声明 + npm scripts |
| `demo-scene-src/tsconfig.json` | TypeScript 配置 |
| `demo-scene-src/app.config.ts` | TanStack Start 应用配置（路由、SSR） |
| `demo-scene-src/app/routes/__root.tsx` | 根布局：主题初始化 + Footer + Outlet |
| `demo-scene-src/app/routes/index.tsx` | 路由 `/`：3D 输送线主场景 |
| `demo-scene-src/app/routes/about.tsx` | 路由 `/about`：关于页面 |
| `demo-scene-src/app/routes/demo/table.tsx` | 路由 `/demo/table`：TanStack Table 示例 |
| `demo-scene-src/app/components/Footer.tsx` | 页脚组件（版权 + 社交链接） |
| `demo-scene-src/app/components/ConveyorScene.tsx` | Three.js 场景：灯光 + 模型 + 控制器 |
| `demo-scene-src/app/utils/makeData.ts` | 生成 5000 条 mock 人员数据 |
| `demo-scene-src/app/styles/app.css` | Tailwind v4 入口 + CSS 变量（light/dark 主题） |
| `demo-scene-src/public/models/conveyor.glb` | 输送线 3D 模型（从 demo-scene/ 复制） |
| `demo-scene-src/public/favicon.ico` | 从 demo-scene/ 复制 |
| `demo-scene-src/public/manifest.json` | PWA manifest |

---

## Task 1: 初始化项目结构 + 依赖

**Files:**
- Create: `demo-scene-src/package.json`
- Create: `demo-scene-src/tsconfig.json`
- Create: `demo-scene-src/app.config.ts`

- [ ] **Step 1: 创建目录**

```bash
mkdir -p demo-scene-src/app/routes/demo
mkdir -p demo-scene-src/app/components
mkdir -p demo-scene-src/app/styles
mkdir -p demo-scene-src/app/utils
mkdir -p demo-scene-src/public/models
```

- [ ] **Step 2: 创建 package.json**

```json
{
  "name": "demo-scene-src",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vinxi dev",
    "build": "vinxi build",
    "start": "vinxi start",
    "preview": "vinxi start"
  },
  "dependencies": {
    "@react-three/drei": "^9.115.0",
    "@react-three/fiber": "^8.17.10",
    "@tanstack/react-router": "^1.114.0",
    "@tanstack/react-start": "^1.114.0",
    "@tanstack/react-table": "^8.21.2",
    "@tanstack/router-plugin": "^1.114.0",
    "match-sorter": "^8.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "sort-by": "^1.2.0",
    "three": "^0.171.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/three": "^0.171.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.0",
    "vinxi": "^0.5.3"
  }
}
```

- [ ] **Step 3: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "moduleDetection": "force",
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "paths": {
      "~/*": ["./app/*"]
    }
  },
  "include": ["app/**/*", "app.config.ts"]
}
```

- [ ] **Step 4: 创建 app.config.ts**

```typescript
import { defineConfig } from '@tanstack/react-start/config'
import tsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  tsr: {
    appDirectory: 'app',
    autoCodeSplitting: true,
  },
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      tailwindcss(),
    ],
  },
})
```

- [ ] **Step 5: 安装依赖**

在 `demo-scene-src/` 目录中运行：

```bash
cd demo-scene-src && npm install
```

预期：`node_modules/` 创建，无 peer dependency error。

- [ ] **Step 6: Commit**

```bash
git add demo-scene-src/package.json demo-scene-src/tsconfig.json demo-scene-src/app.config.ts
git commit -m "feat: initialize demo-scene-src TanStack Start project"
```

---

## Task 2: 样式系统（Tailwind v4 + CSS 变量）

**Files:**
- Create: `demo-scene-src/app/styles/app.css`

- [ ] **Step 1: 创建 app.css（Tailwind v4 + 主题变量）**

```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap');

@import "tailwindcss";

@layer base {
  :root,
  :host {
    --font-sans: "Manrope", ui-sans-serif, system-ui, sans-serif;
  }

  /* Light theme (default) */
  :root,
  :root.light {
    --sea-ink: #0a1628;
    --sea-ink-soft: #4a5568;
    --line: #e2e8f0;
    --link-bg-hover: #f0f4f8;
    --bg: #ffffff;
    --island-bg: #f8fafc;
    color-scheme: light;
  }

  /* Dark theme */
  :root.dark {
    --sea-ink: #e2e8f0;
    --sea-ink-soft: #94a3b8;
    --line: #2d3748;
    --link-bg-hover: #1a202c;
    --bg: #0d1117;
    --island-bg: #161b22;
    color-scheme: dark;
  }

  body {
    font-family: var(--font-sans);
    background-color: var(--bg);
    color: var(--sea-ink);
  }
}

@layer components {
  .page-wrap {
    max-width: 72rem;
    margin-inline: auto;
    padding-inline: 1.5rem;
  }

  .island-shell {
    background-color: var(--island-bg);
    border: 1px solid var(--line);
  }

  .island-kicker {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--sea-ink-soft);
  }

  .display-title {
    font-family: "Fraunces", ui-serif, Georgia, serif;
    line-height: 1.1;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add demo-scene-src/app/styles/app.css
git commit -m "feat: add Tailwind v4 styles and CSS theme variables"
```

---

## Task 3: 根布局 + Footer 组件

**Files:**
- Create: `demo-scene-src/app/components/Footer.tsx`
- Create: `demo-scene-src/app/routes/__root.tsx`

- [ ] **Step 1: 创建 Footer.tsx（完整还原自 bundle）**

```tsx
export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="shrink-0 border-t border-[var(--line)] px-4 pb-14 pt-10 text-[var(--sea-ink-soft)]">
      <div className="page-wrap flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <p className="m-0 text-sm">
          © {year} Your name here. All rights reserved.
        </p>
        <p className="island-kicker m-0">Built with TanStack Start</p>
      </div>
      <div className="mt-4 flex justify-center gap-4">
        <a
          href="https://x.com/tan_stack"
          target="_blank"
          rel="noreferrer"
          className="rounded-xl p-2 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
        >
          <span className="sr-only">Follow TanStack on X</span>
          <svg viewBox="0 0 16 16" aria-hidden="true" width="32" height="32">
            <path
              fill="currentColor"
              d="M12.6 1h2.2L10 6.48 15.64 15h-4.41L7.78 9.82 3.23 15H1l5.14-5.84L.72 1h4.52l3.12 4.73L12.6 1zm-.77 12.67h1.22L4.57 2.26H3.26l8.57 11.41z"
            />
          </svg>
        </a>
        <a
          href="https://github.com/TanStack"
          target="_blank"
          rel="noreferrer"
          className="rounded-xl p-2 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
        >
          <span className="sr-only">Go to TanStack GitHub</span>
          <svg viewBox="0 0 16 16" aria-hidden="true" width="32" height="32">
            <path
              fill="currentColor"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
            />
          </svg>
        </a>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: 创建 __root.tsx（根布局）**

```tsx
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { Footer } from '~/components/Footer'
import appCss from '~/styles/app.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'TanStack Start Starter' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`,
          }}
        />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] flex flex-col h-dvh max-h-dvh overflow-hidden">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <Outlet />
        </div>
        <Footer />
        <Scripts />
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add demo-scene-src/app/components/Footer.tsx demo-scene-src/app/routes/__root.tsx
git commit -m "feat: add root layout and Footer component"
```

---

## Task 4: About 页面

**Files:**
- Create: `demo-scene-src/app/routes/about.tsx`

- [ ] **Step 1: 创建 about.tsx（完整还原自 bundle）**

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <main className="page-wrap mb-12 px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">About</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          A small starter with room to grow.
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          TanStack Start gives you type-safe routing, server functions, and
          modern SSR defaults. Use this as a clean foundation, then layer in
          your own routes, styling, and add-ons.
        </p>
      </section>
    </main>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add demo-scene-src/app/routes/about.tsx
git commit -m "feat: add About page route"
```

---

## Task 5: 复制静态资源

**Files:**
- Create: `demo-scene-src/public/models/conveyor.glb` (copy)
- Create: `demo-scene-src/public/favicon.ico` (copy)
- Create: `demo-scene-src/public/logo192.png` (copy)
- Create: `demo-scene-src/public/logo512.png` (copy)
- Create: `demo-scene-src/public/robots.txt` (copy)
- Create: `demo-scene-src/public/manifest.json`

- [ ] **Step 1: 复制静态资源**

从项目根目录运行：

```bash
cp demo-scene/models/conveyor.glb demo-scene-src/public/models/
cp demo-scene/favicon.ico demo-scene-src/public/
cp demo-scene/logo192.png demo-scene-src/public/
cp demo-scene/logo512.png demo-scene-src/public/
cp demo-scene/robots.txt demo-scene-src/public/
```

- [ ] **Step 2: 创建 manifest.json**

```json
{
  "short_name": "TanStack App",
  "name": "Create TanStack App Sample",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

- [ ] **Step 3: Commit**

```bash
git add demo-scene-src/public/
git commit -m "feat: add public assets (conveyor.glb, icons, manifest)"
```

---

## Task 6: ConveyorScene 3D 组件

**Files:**
- Create: `demo-scene-src/app/components/ConveyorScene.tsx`

- [ ] **Step 1: 创建 ConveyorScene.tsx（完整还原场景参数）**

```tsx
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  useGLTF,
  ContactShadows,
  Environment,
  OrbitControls,
  Bounds,
} from '@react-three/drei'
import type { GLTF } from 'three-stdlib'
import * as THREE from 'three'

// 预加载模型
useGLTF.preload('/models/conveyor.glb')

type ConveyorGLTF = GLTF & {
  nodes: {
    [key: string]: THREE.Mesh
  }
  materials: {
    M_01___Default: THREE.MeshStandardMaterial
    M_02___Default: THREE.MeshStandardMaterial
    M_03___Default: THREE.MeshStandardMaterial
    M_04___Default: THREE.MeshStandardMaterial
    M_05___Default: THREE.MeshStandardMaterial
    M_022___Default: THREE.MeshStandardMaterial
    [key: string]: THREE.MeshStandardMaterial
  }
}

function ConveyorModel() {
  const { nodes, materials } = useGLTF('/models/conveyor.glb') as ConveyorGLTF

  return (
    <group scale={0.003}>
      {/* 渲染所有网格 - 从 GLB 中的几何体名称动态生成 */}
      {Object.entries(nodes).map(([name, node]) => {
        if (node.isMesh) {
          const mesh = node as THREE.Mesh
          return (
            <mesh
              key={name}
              castShadow
              receiveShadow
              geometry={mesh.geometry}
              material={mesh.material}
              position={mesh.position}
              rotation={mesh.rotation}
              scale={mesh.scale}
            />
          )
        }
        return null
      })}
    </group>
  )
}

function SceneLights() {
  return (
    <>
      {/* 从 bundle 提取的精确灯光参数 */}
      <color attach="background" args={['#cfcfcf']} />
      <hemisphereLight
        intensity={0.32}
        color="#b8d4de"
        groundColor="#141f1e"
      />
      <ambientLight intensity={0.14} color="#a8b8b5" />
      <directionalLight
        castShadow
        position={[20, 28, 16]}
        intensity={3.72}
        color="#fff6ed"
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.00015}
        shadow-normalBias={0.025}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-36, 36, 36, -36, 0.5, 140]}
        />
      </directionalLight>
      <directionalLight
        position={[-16, 12, -14]}
        intensity={0.22}
        color="#8faabe"
      />
      <directionalLight
        position={[6, 8, -22]}
        intensity={0.3}
        color="#6bb8a8"
      />
      <pointLight
        position={[10, 4, 8]}
        intensity={0.18}
        color="#dceae8"
        distance={40}
      />
    </>
  )
}

function SceneContent() {
  return (
    <>
      <SceneLights />
      <group>
        <Bounds fit clip observe damping={6} margin={1.2} top>
          <group scale={0.003}>
            <ConveyorModel />
          </group>
        </Bounds>
        {/* 地面 */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
          <planeGeometry args={[160, 160]} />
          <meshStandardMaterial color="#f7f9fb" roughness={0.9} metalness={0.02} />
        </mesh>
        {/* 接触阴影 */}
        <ContactShadows
          opacity={1}
          scale={40}
          blur={0.5}
          far={16}
          resolution={1024}
          color="#2c2c2c"
          frames={1}
        />
      </group>
      {/* 环境光（城市预设） */}
      <Environment preset="city" environmentIntensity={0.18} />
      {/* 轨道控制器 */}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.06}
        minDistance={2}
        maxDistance={80}
      />
    </>
  )
}

export function ConveyorScene() {
  return (
    <main className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
      <div className="relative min-h-0 w-full min-w-0 flex-1">
        <Canvas
          className="absolute inset-0 h-full w-full"
          camera={{ position: [14, 10, 18], fov: 45, near: 0.1, far: 50000 }}
          dpr={[1, 2]}
          shadows="soft"
          gl={{ antialias: true }}
        >
          <Suspense fallback={null}>
            <SceneContent />
          </Suspense>
        </Canvas>
        {/* 加载占位（Canvas 外层，Suspense fallback 显示时可见） */}
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add demo-scene-src/app/components/ConveyorScene.tsx
git commit -m "feat: add ConveyorScene 3D component with exact lighting from bundle"
```

---

## Task 7: 主页路由（3D 场景）

**Files:**
- Create: `demo-scene-src/app/routes/index.tsx`

- [ ] **Step 1: 创建 index.tsx**

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { ConveyorScene } from '~/components/ConveyorScene'

export const Route = createFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-0 w-full min-w-0 flex-1 items-center justify-center bg-[rgba(12,26,28,0.6)] text-sm text-[var(--sea-ink-soft)]"
          aria-hidden
        >
          正在加载 3D 场景…
        </div>
      }
    >
      <ConveyorScene />
    </Suspense>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add demo-scene-src/app/routes/index.tsx
git commit -m "feat: add index route with 3D conveyor scene"
```

---

## Task 8: Mock 数据工具

**Files:**
- Create: `demo-scene-src/app/utils/makeData.ts`

- [ ] **Step 1: 创建 makeData.ts（还原自 bundle 的人员数据生成器）**

```typescript
import { faker } from '@faker-js/faker'

export type Person = {
  id: string
  firstName: string
  lastName: string
  age: number
  visits: number
  progress: number
  status: 'relationship' | 'complicated' | 'single'
  subRows?: Person[]
}

const range = (len: number) => {
  const arr: number[] = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = (): Person => {
  return {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: faker.number.int(40),
    visits: faker.number.int(1000),
    progress: faker.number.int(100),
    status: faker.helpers.shuffle<Person['status']>([
      'relationship',
      'complicated',
      'single',
    ])[0]!,
  }
}

export function makeData(...lens: number[]): Person[] {
  const makeDataLevel = (depth = 0): Person[] => {
    const len = lens[depth]!
    return range(len).map((): Person => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}
```

注意：需要安装 `@faker-js/faker`。在 Step 2 中添加到 package.json。

- [ ] **Step 2: 添加 faker 依赖**

在 `demo-scene-src/` 目录中运行：

```bash
cd demo-scene-src && npm install @faker-js/faker
```

- [ ] **Step 3: Commit**

```bash
git add demo-scene-src/app/utils/makeData.ts demo-scene-src/package.json demo-scene-src/package-lock.json
git commit -m "feat: add makeData mock data generator with faker"
```

---

## Task 9: Table 页面（TanStack Table 完整实现）

**Files:**
- Create: `demo-scene-src/app/routes/demo/table.tsx`

- [ ] **Step 1: 创建 demo/table.tsx（完整还原自 bundle）**

```tsx
import { createFileRoute } from '@tanstack/react-router'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  type SortingFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  sortingFns,
} from '@tanstack/react-table'
import {
  type RankingInfo,
  rankItem,
  compareItems,
} from '@tanstack/match-sorter-utils'
import { useEffect, useMemo, useReducer, useState } from 'react'
import { makeData, type Person } from '~/utils/makeData'

export const Route = createFileRoute('/demo/table')({
  component: TablePage,
})

// 扩展类型以支持 fuzzy filter
declare module '@tanstack/react-table' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

// Fuzzy 过滤函数（从 bundle 还原）
const fuzzyFilter: FilterFn<unknown> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

// Fuzzy 排序函数（从 bundle 还原）
const fuzzySort: SortingFn<unknown> = (rowA, rowB, columnId) => {
  let dir = 0
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!,
    )
  }
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

// Debounced input（从 bundle 还原）
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)
    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

// 列过滤输入（从 bundle 还原）
function Filter({ column }: { column: import('@tanstack/react-table').Column<Person, unknown> }) {
  const columnFilterValue = column.getFilterValue()
  return (
    <DebouncedInput
      type="text"
      value={(columnFilterValue ?? '') as string}
      onChange={(value) => column.setFilterValue(value)}
      placeholder="Search..."
      className="w-full px-2 py-1 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
    />
  )
}

function TablePage() {
  const rerender = useReducer(() => ({}), {})[1]
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  // 列定义（从 bundle 完整还原）
  const columns = useMemo<ColumnDef<Person, unknown>[]>(
    () => [
      {
        accessorKey: 'id',
        filterFn: 'equalsString',
      },
      {
        accessorKey: 'firstName',
        cell: (info) => info.getValue(),
        filterFn: 'includesStringSensitive',
      },
      {
        accessorFn: (row) => row.lastName,
        id: 'lastName',
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
        filterFn: 'includesString',
      },
      {
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        id: 'fullName',
        header: 'Full Name',
        cell: (info) => info.getValue(),
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
      },
    ],
    [],
  )

  const [data, setData] = useState(() => makeData(5000))
  const refreshData = () => setData(() => makeData(50000))

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'fuzzy',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })

  useEffect(() => {
    if (
      table.getState().columnFilters[0]?.id === 'fullName' &&
      table.getState().sorting[0]?.id !== 'fullName'
    ) {
      table.setSorting([{ id: 'fullName', desc: false }])
    }
  }, [table.getState().columnFilters[0]?.id])

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* 全局搜索 */}
      <div>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={(value) => setGlobalFilter(String(value))}
          className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Search all columns..."
        />
      </div>
      <div className="h-4" />

      {/* 表格 */}
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="w-full text-sm text-gray-200">
          <thead className="bg-gray-800 text-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="px-4 py-3 text-left"
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          className={
                            header.column.getCanSort()
                              ? 'cursor-pointer select-none hover:text-blue-400 transition-colors'
                              : ''
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{ asc: ' 🔼', desc: ' 🔽' }[
                            header.column.getIsSorted() as string
                          ] ?? null}
                        </div>
                        {header.column.getCanFilter() ? (
                          <div className="mt-2">
                            <Filter column={header.column} />
                          </div>
                        ) : null}
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-700">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-800 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="h-4" />

      {/* 分页控制（从 bundle 完整还原） */}
      <div className="flex flex-wrap items-center gap-2 text-gray-200">
        <button
          className="px-3 py-1 bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="px-3 py-1 bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="px-3 py-1 bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="px-3 py-1 bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="w-16 px-2 py-1 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value))
          }}
          className="px-2 py-1 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 text-gray-400">
        {table.getPrePaginationRowModel().rows.length} Rows
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => rerender()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Force Rerender
        </button>
        <button
          onClick={() => refreshData()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* 状态预览 */}
      <pre className="mt-4 p-4 bg-gray-800 rounded-lg text-gray-300 overflow-auto">
        {JSON.stringify(
          {
            columnFilters: table.getState().columnFilters,
            globalFilter: table.getState().globalFilter,
          },
          null,
          2,
        )}
      </pre>
    </div>
  )
}
```

- [ ] **Step 2: 安装 match-sorter-utils**

```bash
cd demo-scene-src && npm install @tanstack/match-sorter-utils
```

- [ ] **Step 3: Commit**

```bash
git add demo-scene-src/app/routes/demo/table.tsx demo-scene-src/package.json demo-scene-src/package-lock.json
git commit -m "feat: add Table page with TanStack Table, fuzzy filter and pagination"
```

---

## Task 10: 开发验证

**Files:** 无新文件

- [ ] **Step 1: 启动开发服务器**

```bash
cd demo-scene-src && npm run dev
```

预期输出：
```
  ➜  Local:   http://localhost:3000/
  ➜  Network: ...
```

- [ ] **Step 2: 验证各路由**

在浏览器中依次访问：

| URL | 预期 |
|-----|------|
| `http://localhost:3000/` | 全屏 3D 输送线场景，支持鼠标旋转/缩放 |
| `http://localhost:3000/about` | About 页面，显示标题 "A small starter with room to grow." |
| `http://localhost:3000/demo/table` | 数据表格，含搜索框、分页控制、5000 行数据 |

- [ ] **Step 3: 验证主题切换**

打开浏览器 DevTools，执行：

```javascript
localStorage.setItem('theme', 'dark')
location.reload()
```

预期：页面切换为深色主题（`--sea-ink` 等变量生效）。

- [ ] **Step 4: 如有构建错误，逐一排查**

常见问题：
- Three.js 类型错误：确认 `@types/three` 版本与 `three` 一致
- `useGLTF.preload` 位置：必须在组件定义之后、文件顶层调用
- Tailwind v4 语法：使用 `@import "tailwindcss"` 而非 `@tailwind base`

---

## Task 11: 构建 + 输出覆盖 demo-scene/

**Files:**
- Modify: `demo-scene-src/package.json`（添加 build:demo script）

- [ ] **Step 1: 执行构建**

```bash
cd demo-scene-src && npm run build
```

预期：`.output/public/` 目录生成（TanStack Start 默认输出路径）。

- [ ] **Step 2: 验证构建产物**

```bash
ls demo-scene-src/.output/public/
```

预期包含：`index.html`, `_build/` 或 `assets/`, `models/`

- [ ] **Step 3: 添加 build:demo 脚本**

修改 `demo-scene-src/package.json` 的 scripts：

```json
{
  "scripts": {
    "dev": "vinxi dev",
    "build": "vinxi build",
    "start": "vinxi start",
    "build:demo": "vinxi build && cp -r .output/public/* ../demo-scene/"
  }
}
```

- [ ] **Step 4: 执行 build:demo 并验证**

```bash
cd demo-scene-src && npm run build:demo
```

验证 `demo-scene/` 目录内容已更新：

```bash
ls ../demo-scene/
```

预期：包含新的 `index.html` 和静态资源。

- [ ] **Step 5: Commit**

```bash
git add demo-scene-src/package.json demo-scene/
git commit -m "build: add build:demo script and update demo-scene with source build output"
```

---

## 自查（Self-Review）

### Spec Coverage

| 需求 | 对应 Task |
|------|-----------|
| TanStack Start 项目初始化 | Task 1 |
| Tailwind v4 + CSS 变量（--sea-ink 等） | Task 2 |
| 根布局 + 主题初始化脚本 | Task 3 |
| Footer 组件（完整还原） | Task 3 |
| About 页面（完整还原） | Task 4 |
| 静态资源（conveyor.glb 等） | Task 5 |
| 3D 场景组件（灯光参数完整） | Task 6 |
| 主页路由 `/` | Task 7 |
| Mock 数据生成器 | Task 8 |
| Table 页面（分页/过滤/搜索） | Task 9 |
| 开发验证 | Task 10 |
| 构建并覆盖 demo-scene/ | Task 11 |

### 关键注意点

1. **Task 8 中的 `makeData`** 使用 `@faker-js/faker`，这是从 bundle 中推断出的数据形状；实际 bundle 中的数据生成器可能不使用 faker，但生成的数据结构（id, firstName, lastName）是一致的。

2. **Task 6 ConveyorModel** 中使用了动态渲染所有 mesh 的方式，而非 bundle 中的逐一硬编码。这样更简洁，且功能完全等价（模型外观一致）。

3. **`vite-tsconfig-paths`** 需要在 Task 1 时额外安装：
   ```bash
   cd demo-scene-src && npm install -D vite-tsconfig-paths
   ```
   请在 Task 1 Step 5 执行安装时确认已包含。
