# 海柔仓储 SCADA 系统 — 缺口功能 PRD

**文档日期：** 2026-04-26
**基于文档：** 海柔项目SCADA-BRD-德马0705.pdf
**范围：** BRD 中现有系统尚未实现的缺口功能（15 个功能点）
**交付方式：** 分 4 期独立交付，每期可独立上线

---

## 一、项目背景

### 现有系统概述

Jupiter SCADA Client 已实现以下功能：
- 用户/角色/菜单管理（CRUD）
- 登录审计日志
- API 平台管理（CRUD + Dashboard）
- SCADA 输送线可视化（第三方 iframe）
- 历史报警查询表格
- 设备监控状态表格
- SCADA 颜色配置
- 扫描频率 / 流量统计图表
- 电表管理（CRUD + 电力图表）
- PN 网络设备拓扑（CRUD + SVG 图）
- SCADA 操作日志查询
- 设备巡检计划/记录/日历

### 技术架构

- **框架：** React 18.2.0 + TypeScript 4.7.4
- **状态管理：** MobX 6 + MobX State Tree
- **UI：** amis 6.12 + Ant Design 5.12
- **实时通信：** WebSocket（后端推送 PLC 采集数据）
- **PLC 协议：** Modbus / Siemens S7（由后端网关处理，前端不直连）
- **路由：** React Router 6（SPA，BrowserRouter）
- **i18n：** i18next + react-i18next（zh-CN 默认）

---

## 二、BRD 差距分析

| # | BRD 功能 | 现有状态 | 缺口 |
|---|---|---|---|
| 1 | 输送线设备实时状态颜色 + 交互叠加层 | iframe 存在，无交互 | ❌ |
| 2 | 鼠标悬停显示设备编号 Tooltip | 无 | ❌ |
| 3 | 点击设备弹出详情面板 | 无 | ❌ |
| 4 | 故障设备橙色高亮 + 搜索定位 | 无 | ❌ |
| 5 | 报警实时弹窗叠加在画面上 | alarm_history 仅历史 | ❌ |
| 6 | 静态图纸文档展示（电气图/拓扑图） | 无 | ❌ |
| 7 | E柜位置与电气数据挂钩 | meter_management 无位置映射 | ⚠️ 部分 |
| 8 | PN 设备心跳实时颜色更新 | network_topology 存在，非实时 | ⚠️ 部分 |
| 9 | 实时报警列表（WebSocket + 确认操作） | 仅历史查询 | ❌ |
| 10 | 设备复位操作（管理员，带确认+审计） | 无 | ❌ |
| 11 | 故障知识库（按故障码查询 + CRUD） | 无 | ❌ |
| 12 | PLC 日志管理页面 | 无 | ❌ |
| 13 | SCADA 三级权限粒度 | 有角色系统，无 SCADA 专项粒度 | ⚠️ 部分 |
| 14 | 设备运行记录报表（含 Excel 导出） | scan_rate 非设备级 | ❌ |
| 15 | PLC 动作记录页面 | 无 | ❌ |
| 16 | 条码读取率统计（每台扫码枪） | 无 | ❌ |
| 17 | 故障记录 Excel 导出 | alarm_history 无导出 | ⚠️ 部分 |
| 18 | 保养预警 + 自动工单生成 | equipment_inspection 无自动触发 | ❌ |

---

## 三、P1 — 实时基础设施

> **定位：** 所有后续期次的基础，必须优先交付。

### P1-F1：WebSocket 全局客户端

**文件：** `src/utils/wsClient.ts`

**职责：**
- 单例连接，应用启动后在 `App.tsx` 内初始化
- 自动重连（指数退避，最大间隔 30s）
- 消息类型路由，支持订阅者注册/注销模式
- 暴露 MobX observable 状态：`connected: boolean`、`lastAlarm`、`deviceStates: Map<deviceId, status>`

**消息类型定义：**
```typescript
type WsMessageType =
  | "ALARM_NEW"          // 新报警
  | "ALARM_RESOLVED"     // 报警消除
  | "DEVICE_STATUS"      // 设备状态快照
  | "HEARTBEAT"          // 网络设备心跳
  | "RESET_RESULT"       // 复位操作结果
  | "MAINTENANCE_WARN";  // 保养预警触发
```

**i18n 键：** 无（工具模块，无 UI）

---

### P1-F2：实时报警面板

**路由：** `/scada/monitor/realtime-alarm`
**文件：** `src/pages/scada/monitor/realtime_alarm.tsx`

**功能：**
- 右侧抽屉式浮层，可常驻展开（状态存 localStorage）
- WebSocket `ALARM_NEW` 事件 → 新报警追加到列表顶部，播放提示音（可选）
- WebSocket `ALARM_RESOLVED` 事件 → 对应条目标记为"已消除"
- 未确认报警数量徽标显示在侧边栏菜单 `/scada/monitor/realtime-alarm` 入口

**报警条目字段：**

| 字段 | 说明 |
|---|---|
| 设备编号 | 点击跳转 P2-F2 设备详情 |
| 故障码 | 超链接跳转 P3-F2 知识库 |
| 故障描述 | 文本 |
| 发生时间 | 时间戳 |
| 状态 | 未确认 / 已确认 / 已消除 |
| 确认操作 | Level 2+ 权限可操作 |

**API：**
- `POST /scada/alarm/{id}/acknowledge` — 确认报警（记录确认人、时间）

**i18n 键前缀：** `scada.monitor.realtimeAlarm.*`

---

### P1-F3：PN 网络设备心跳实时化

**改造文件：** `src/pages/scada/monitor/network_topology.tsx`

**改造内容：**
- 引入 wsClient，订阅 `HEARTBEAT` 消息
- 消息格式：`{ deviceId: string, online: boolean, latency?: number }`
- 设备列表行颜色实时更新：在线=绿色标记，离线=红色标记
- 拓扑 SVG 图中对应节点颜色同步更新
- 无需重建拓扑结构，仅更新状态字段

**不改变：** 设备 CRUD、拓扑图编辑等现有功能

---

## 四、P2 — 图形交互增强

> **前提：** P1-F1 WebSocket 客户端已就绪；postMessage 协议需与第三方 iframe 供应商确认。

### P2-F1：Canvas 通信桥

**文件：** `src/utils/scadaBridge.ts`

**职责：** 封装与第三方 SCADA iframe 的双向 postMessage 通信

**发送命令（本项目 → iframe）：**
```typescript
{ type: "HIGHLIGHT_DEVICE", deviceId: string, color: "orange" | "red" | "clear" }
{ type: "LOCATE_DEVICE",    deviceId: string }
{ type: "CLEAR_HIGHLIGHT",  deviceId?: string }  // 不传 deviceId 则清除全部
```

**接收事件（iframe → 本项目）：**
```typescript
{ type: "DEVICE_CLICKED", deviceId: string }
{ type: "DEVICE_HOVERED", deviceId: string, x: number, y: number }
{ type: "DEVICE_UNHOVERED" }
```

> **外部依赖：** 以上协议格式需在项目启动前与第三方系统供应商书面确认。

---

### P2-F2：设备详情侧面板

**改造文件：** `src/pages/scada/monitor/ConnectedRectangles.tsx`

**触发：** scadaBridge 接收到 `DEVICE_CLICKED` → 打开右侧面板

**面板字段：**

| 字段 | 数据来源 |
|---|---|
| 设备编号 | iframe 事件 |
| 设备类型 | REST API |
| 当前状态 | WebSocket deviceStates |
| 安装位置 | REST API |
| 上次保养时间 | REST API |
| 当前活跃报警 | 列表，每条含故障码超链接 |
| 复位按钮 | Level 3 权限可见（P3-F1） |

**API：** `GET /scada/device/{id}/detail`

**i18n 键前缀：** `scada.monitor.deviceDetail.*`

---

### P2-F3：鼠标悬停 Tooltip

**改造文件：** `src/pages/scada/monitor/ConnectedRectangles.tsx`

- scadaBridge 接收 `DEVICE_HOVERED` → 在坐标 `(x, y)` 处渲染绝对定位 Tooltip
- Tooltip 内容：设备编号 + 状态色块
- 接收 `DEVICE_UNHOVERED` → 隐藏 Tooltip
- Tooltip 为纯展示，不阻塞 iframe 鼠标事件

---

### P2-F4：故障高亮 + 搜索定位

**改造文件：** `src/pages/scada/monitor/ConnectedRectangles.tsx`

**搜索栏：**
- 绝对定位叠加在 iframe 左上角
- 输入设备编号 → `scadaBridge.locateDevice(id)` + REST API 获取详情 → 打开 P2-F2 面板

**自动故障高亮（与 P1-F2 联动）：**
- WebSocket `ALARM_NEW` → `scadaBridge.highlightDevice(deviceId, "orange")`
- WebSocket `ALARM_RESOLVED` → `scadaBridge.clearHighlight(deviceId)`

---

### P2-F5：静态图纸文档库

**路由：** `/scada/monitor/document-library`
**文件：** `src/pages/scada/monitor/document_library.tsx`

**图纸分类（固定，不需动态配置）：**
1. PN 网络拓扑图
2. 电气一次图
3. E柜原理图

**功能：**
- 左侧分类列表，右侧 PDF 内嵌预览（`<iframe>` 或 react-pdf）
- Level 3 管理员可上传替换（文件上传到文件服务器，URL 存后端）
- Level 1/2 只读

**API：**
- `GET /scada/document/list` — 获取各类图纸当前 URL
- `POST /scada/document/upload` — 管理员上传（multipart/form-data）

**i18n 键前缀：** `scada.monitor.documentLibrary.*`

---

## 五、P3 — 运维操作

> **前提：** P1 全部就绪；P2-F2 设备详情面板已实现（复位按钮在其中）。

### P3-F1：设备复位操作

**位置：** P2-F2 设备详情面板内"复位"按钮

**权限：** Level 3（管理员）专属，其他级别不渲染按钮

**流程：**
1. 点击"复位"
2. 二次确认弹窗：显示设备编号 + "此操作将向 PLC 下发复位指令，请确认"
3. 确认 → `POST /scada/device/{id}/reset`
4. 等待 WebSocket `RESET_RESULT` 消息（超时 10s 提示失败）
5. Toast 显示结果；成功后刷新设备状态

**审计：** 后端自动记录（操作人 / 时间 / 设备ID / 操作结果）到操作日志，前端无需额外处理

---

### P3-F2：故障知识库

**路由：** `/scada/maintenance/fault-knowledge-base`
**文件：** `src/pages/scada/maintenance/fault_knowledge_base.tsx`

**数据结构：**

| 字段 | 类型 | 说明 |
|---|---|---|
| faultCode | string | 唯一键，如 "E001" |
| faultName | string | 故障名称 |
| deviceType | string | 适用设备类型 |
| description | string | 故障现象描述 |
| troubleshootingSteps | string | 排查步骤（富文本） |
| suggestion | string | 处理建议 |

**功能：**
- Level 1/2：按故障码或关键词搜索，查看详情
- Level 3：CRUD（amis schema 驱动）
- 从 P1-F2 报警列表 / P2-F2 设备面板的故障码点击跳转至对应条目

**API 前缀：** `/scada/faultKnowledge/`
**i18n 键前缀：** `scada.maintenance.faultKnowledge.*`

---

### P3-F3：PLC 日志管理

**路由：** `/scada/log/plc-log`
**文件：** `src/pages/scada/log/plc_log.tsx`

**字段：** 时间 / PLC 编号 / 日志类型 / 关联设备 / 原始报文摘要

**功能：**
- 多条件筛选：PLC 编号 / 时间范围 / 日志类型
- 分页查询，数据只读
- Excel 导出：`GET /scada/log/plc/export`（amis download action）

**i18n 键前缀：** `scada.log.plcLog.*`

---

### P3-F4：SCADA 三级权限扩展

**改造文件：**
- `src/stores/index.tsx` — store 新增 `scadaLevel: 1 | 2 | 3` 属性，从 `/user/api/currentUser/getAuth` 响应中读取
- `src/pages/user/role_management.tsx` — 角色编辑表单新增 `scadaLevel` 下拉字段

**权限矩阵：**

| 操作 | Level 1（只读） | Level 2（操作员） | Level 3（管理员） |
|---|---|---|---|
| 查看所有监控页面 | ✅ | ✅ | ✅ |
| 确认报警 | ❌ | ✅ | ✅ |
| 设备复位 | ❌ | ❌ | ✅ |
| 知识库 CRUD | ❌ | ❌ | ✅ |
| 图纸上传 | ❌ | ❌ | ✅ |

**实现方式：** 复用现有角色系统，新增 `scadaLevel` 字段，不新建权限系统

---

## 六、P4 — 报表与保养

> **前提：** P1-F1 WebSocket 客户端就绪（P4-F4 保养预警需要推送）。

### P4-F1：设备运行记录报表

**路由：** `/scada/report/device-operation`
**文件：** `src/pages/scada/report/device_operation_report.tsx`

**查询维度：** 时间范围 / 设备编号 / 设备类型 / 线体区段

**展示字段：** 设备编号 / 类型 / 累计运行时长(h) / 停机次数 / 故障次数 / 运行率(%)

**图表：** 按天的运行率趋势折线图（ECharts，图表标题用 `i18n.t()` 手动翻译）

**Excel 导出：** `GET /scada/report/device-operation/export`

**i18n 键前缀：** `scada.report.deviceOperation.*`

---

### P4-F2：条码读取率统计

**路由：** `/scada/report/barcode-stats`
**文件：** `src/pages/scada/report/barcode_stats.tsx`

**查询维度：** 时间范围 / 扫码枪编号 / 线体位置

**展示字段：** 扫码枪编号 / 位置 / 总扫描次数 / 有效读取 / 无效读取 / 读取成功率(%)

**图表：**
- 各扫码枪读取率对比柱状图
- 主线体吞吐量趋势折线图（时间分段）

**Excel 导出：** `GET /scada/report/barcode/export`

**i18n 键前缀：** `scada.report.barcodeStats.*`

---

### P4-F3：故障记录增强

**改造文件：** `src/pages/scada/monitor/alarm_history.tsx`

**新增内容：**
- Excel 导出按钮（amis download action → `GET /scada/alarm/export`）
- 筛选项补充"设备编号"字段
- 表格新增列：处理人 / 确认时间（来自 P1-F2 确认操作数据）

---

### P4-F4：保养预警与自动工单

**改造文件：** `src/pages/scada/maintenance/equipment_inspection.tsx`

**新增 Tab："预警配置"**

| 字段 | 说明 |
|---|---|
| 设备编号 | 选择设备 |
| 触发条件类型 | 运行小时数 / 动作次数 |
| 阈值 | 数字输入 |
| 预警提前量 | 触发前 N 小时/次预警 |

**新增 Tab："待处理工单"**
- 列出后端定时任务自动生成的保养工单
- 字段：设备编号 / 触发原因 / 生成时间 / 状态（待处理/处理中/已完成）
- Level 2+ 可认领工单并填写完成记录
- 侧边栏菜单显示未处理工单数量徽标

**WebSocket 联动：** 订阅 `MAINTENANCE_WARN` 消息 → Toast 通知 + 徽标数量更新

---

### P4-F5：PLC 动作记录

**路由：** `/scada/log/plc-action`
**文件：** `src/pages/scada/log/plc_action.tsx`

**字段：** 时间 / 设备编号 / 动作类型（启动/停止/变速/急停）/ 触发来源（自动/手动）/ 关联报警ID

**功能：**
- 多条件筛选：设备编号 / 时间范围 / 动作类型
- 数据只读，分页查询
- Excel 导出：`GET /scada/log/plc-action/export`

**i18n 键前缀：** `scada.log.plcAction.*`

---

## 七、新增路由汇总

| 路由 | 组件文件 | 所属期次 |
|---|---|---|
| `/scada/monitor/realtime-alarm` | `realtime_alarm.tsx` | P1 |
| `/scada/monitor/document-library` | `document_library.tsx` | P2 |
| `/scada/maintenance/fault-knowledge-base` | `fault_knowledge_base.tsx` | P3 |
| `/scada/log/plc-log` | `plc_log.tsx` | P3 |
| `/scada/report/device-operation` | `device_operation_report.tsx` | P4 |
| `/scada/report/barcode-stats` | `barcode_stats.tsx` | P4 |
| `/scada/log/plc-action` | `plc_action.tsx` | P4 |

**改造文件：**
- `src/utils/wsClient.ts` — 新增（P1）
- `src/utils/scadaBridge.ts` — 新增（P2）
- `src/pages/scada/monitor/network_topology.tsx` — 改造（P1）
- `src/pages/scada/monitor/ConnectedRectangles.tsx` — 改造（P2）
- `src/pages/scada/monitor/alarm_history.tsx` — 改造（P4）
- `src/pages/scada/maintenance/equipment_inspection.tsx` — 改造（P4）
- `src/stores/index.tsx` — 改造（P3）
- `src/pages/user/role_management.tsx` — 改造（P3）
- `src/routes/path2Compoment.tsx` — 新增 7 条路由

---

## 八、附录：外部依赖与风险

| 依赖项 | 影响期次 | 风险级别 | 缓解措施 |
|---|---|---|---|
| 第三方 iframe 支持 postMessage 协议 | P2 全部 | 高 | 项目启动前书面确认协议格式；P2 实现时做好降级方案（无 postMessage 则隐藏交互入口） |
| 后端 WebSocket 接口就绪 | P1、P3、P4 | 高 | 本地 Mock WebSocket 服务用于开发联调 |
| 后端聚合报表接口 | P4-F1、P4-F2 | 中 | 前端可先实现查询框架，等后端接口就绪后接入 |
| 文件服务器（图纸上传） | P2-F5 | 低 | 使用现有后端文件上传服务，无需新建 |
