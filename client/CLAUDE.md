# CLAUDE.md - Jupiter / Open Warehouse Execution System (SCADA Client)

## Project Overview

A warehouse execution system (WMS/SCADA) with real-time monitoring, user management, API platform, and equipment monitoring. Chinese-language project.

## Tech Stack

- **Framework:** React 18.2.0 + TypeScript 4.7.4
- **Build:** Webpack 5 (dev config: `build/webpack.config.dev.js`, prod: `build/webpack.config.prod.js`)
- **State Management:** MobX 6 + MobX State Tree 5
- **UI:** amis 6.12 + Ant Design 5.12 + Bootstrap 5
- **Routing:** React Router 6.20.0 (BrowserRouter, SPA)
- **HTTP:** Axios with custom interceptor (`src/utils/requestInterceptor.ts`)
- **i18n:** i18next + react-i18next (zh-CN default)
- **Tab Caching:** react-activation (KeepAlive)
- **Charts:** Chart.js + D3.js
- **Editor:** Monaco Editor (workers bundled separately)

## Project Structure

```
src/
  index.tsx              # Entry point, bootstraps React app
  App.tsx                # Root component: MobX Provider + AliveScope + RootRoute
  routes/
    index.tsx            # BrowserRouter: /login -> Login, /* -> Admin
    path2Compoment.tsx   # Route definitions (baseRouter + menuRouter)
    RouterGuard.tsx      # Dynamic route matching with lazy loading + KeepAlive
  pages/
    index.tsx            # Admin layout (sidebar + header + tabs + content/iframe)
    Login.tsx            # Login page
    404.tsx              # Not found page
    components/
      TabsLayout.tsx     # Dynamic tab management for routes
    user/                # User management pages
    api_platform/        # API platform pages
    scada/
      monitor/
        ConnectedRectangles.tsx  # SCADA conveyor monitor (iframe to external)
        alarm_history.tsx
        color_config.tsx
        equipment_monitor.tsx
      statics/           # SCADA statistics pages
      log/               # SCADA log pages
  stores/
    index.tsx            # MobX State Tree main store (theme, user, locale, layout)
    User.ts              # User model (login/logout, localStorage auth)
    Warehouse.ts
  components/
    LayoutAside.tsx      # Sidebar navigation
    LayoutHeader.tsx     # Header with app selector + language switcher
    Chatbot.tsx          # AI chatbot modal
    AMisRenderer.tsx     # amis page renderer
  utils/
    requestInterceptor.ts  # Axios wrapper with auth headers
  locales/               # i18n translation files
  scss/                  # Global styles
  icon/                  # SVG icons
```

## Key Commands

```bash
npm run dev        # Start dev server (webpack-dev-server, port 4001)
npm run build      # Production build to ./dist
npm start          # Alias for npm run dev
```

## Development Notes

### Routing

- Routes defined in `src/routes/path2Compoment.tsx` as `baseRouter` (public) + `menuRouter` (authenticated)
- `RouterGuard.tsx` does exact pathname matching against path2components array
- Unmatched paths render amis `NotFound` component (404)
- Default route `/` renders `ConnectedRectangles` (SCADA conveyor monitor)
- ConnectedRectangles route: `/scada/monitor/equipment-scada`

### Authentication

- Login stores username + token in localStorage
- `Admin` component checks `store.user.isAuthenticated` on mount
- Menu/permissions fetched from `/user/api/currentUser/getAuth`
- API gateway proxy: `/gw` -> backend (configured in webpack dev server)

### Multi-App Support

- Backend returns menu structure with `iframeShow` flag
- When `iframeShow=true`, renders external iframe instead of React routes
- Supports cross-iframe locale messaging

### Path Alias

- `@/` maps to `./src/` (configured in tsconfig.json and webpack resolve.alias)

### Webpack Dev Config

- The actual dev config is `build/webpack.config.dev.js` (not in git, copy from `build/webpack.config.example.dev.js`)
- `historyApiFallback: true` enabled for SPA routing
- Hot reload via React Refresh

### State Management

- MobX State Tree store at `src/stores/index.tsx`
- Properties: theme, user, warehouse, asideFixed, asideFolded, offScreen, locale
- MobX decorators: `@inject("store") @observer` pattern on class components