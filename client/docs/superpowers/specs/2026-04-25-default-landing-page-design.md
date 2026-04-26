# Design: 修复登录后默认落地页为 ConnectedRectangles

**日期：** 2026-04-25
**状态：** 已批准

## 问题描述

用户登录成功后，`LoginForm` 执行 `history.replace('/dashboard')`，但 `/dashboard` 路由未在 `path2Compoment.tsx` 中定义，导致页面 404。

## 目标

登录成功后跳转至 ConnectedRectangles 界面（SCADA 传送带监控），并正确加载完整布局（侧边栏 + 顶栏 + 菜单）。

## 方案

将 `LoginForm.tsx` 中登录成功后的跳转路径从 `/dashboard` 改为 `/scada/monitor/equipment-scada`。

### 为什么选 `/scada/monitor/equipment-scada`

- 该路由已在 `menuRouter` 中定义，映射到 `ConnectedRectangles` 组件
- `Admin` 组件的 render 条件：`pathname !== "login" && pathname !== "/"` 时渲染完整布局
- `refreshMenu()` 在该路径下正常触发，加载菜单权限数据

## 改动范围

| 文件 | 行号 | 改动 |
|------|------|------|
| `src/pages/components/LoginForm.tsx` | 49 | `history.replace('/dashboard')` → `history.replace('/scada/monitor/equipment-scada')` |

## 验证

1. 登录后页面跳转至 `/scada/monitor/equipment-scada`
2. 页面显示完整布局（侧边栏、顶栏可见）
3. ConnectedRectangles 内容正常渲染
4. 菜单权限正常加载
