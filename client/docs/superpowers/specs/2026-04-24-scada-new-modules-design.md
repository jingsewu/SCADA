# SCADA 新功能模块设计文档

## 概述

基于海柔项目 SCADA-BRD 文档，为现有 SCADA 系统新增三个功能模块：
- **电表管理** - 电柜电表信息的 CRUD 管理及电流/电压/功率数据统计
- **网络拓扑图** - PN 网络设备连接状态管理与拓扑可视化
- **设备巡检** - 设备巡检计划制定、巡检记录管理、日历提醒

对应 BRD 文档：功能描述 4/10（电表）、功能描述 9/11/18（网络拓扑）、功能描述 23-25 4.5.4 保养计划（巡检）。

## 技术方案

遵循项目现有模式：
- Amis schema 驱动 + `schema2component` 渲染
- API 常量定义在 `src/pages/scada/constants/api_constant.tsx`
- 路由注册在 `src/routes/path2Compoment.tsx`
- 通用搜索接口 `api_crud_search` + `searchIdentity` 标识

## 文件结构

```
src/pages/scada/
├── monitor/
│   ├── meter_management.tsx          # 电表管理（新增）
│   └── network_topology.tsx          # 网络拓扑图（新增）
├── maintenance/                      # 设备维护（新增目录）
│   └── equipment_inspection.tsx      # 设备巡检（新增）
├── constants/
│   └── api_constant.tsx              # 追加 API 定义
```

路由变更文件：`src/routes/path2Compoment.tsx`

---

## 模块一：电表管理

### 路由
- 路径：`/scada/monitor/meter-management`
- i18n key：`scada.monitor.meterManagement.title`

### API 接口

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 新增/编辑 | POST | `/scada/meter/createOrUpdate` | 创建或更新电表 |
| 删除 | POST | `/scada/meter/delete/${id}` | 删除电表 |
| 列表查询 | POST | 通用 `api_crud_search` | searchIdentity: `MMeter` |
| 电力数据查询 | POST | `/scada/meter/powerData` | 查询电流/电压/功率历史数据 |

### 数据字段

**电表基础信息 (formBody)：**

| 字段 | 类型 | label | 必填 | 说明 |
|------|------|-------|------|------|
| id | hidden | - | - | 主键 |
| meterNo | input-text | 电表编号 | 是 | 唯一标识 |
| meterName | input-text | 电表名称 | 是 | |
| meterType | select | 电表类型 | 是 | 选项：单相电表、三相电表 |
| cabinetNo | input-text | 所属电柜 | 是 | 关联电柜编号 |
| location | input-text | 安装位置 | 是 | |
| ratedVoltage | input-number | 额定电压(V) | 否 | |
| ratedCurrent | input-number | 额定电流(A) | 否 | |
| status | select | 状态 | 是 | 选项：正常、异常、离线 |
| installDate | input-date | 安装日期 | 否 | |
| remark | textarea | 备注 | 否 | |

**CRUD 表格列 (crudColumns)：**
meterNo(可搜索)、meterName(可搜索)、meterType(下拉搜索)、cabinetNo(可搜索)、location、ratedVoltage、ratedCurrent、status、installDate、remark

**searchIdentity:** `MMeter`

### 页面结构

页面使用 Amis `tabs` 组件，包含两个 Tab：

**Tab 1 - 电表列表：**
- 标准 CRUD 表格，参考 `equipment_monitor.tsx` 模式
- headerToolbar: 新增电表按钮 + 导出 Excel + 刷新
- 操作列: 修改(drawer) + 删除(确认弹窗)

**Tab 2 - 电力数据统计：**
- 顶部筛选表单：电柜选择(select) + 时间范围(datetime-range) + 搜索/重置按钮
- 统计卡片行 (grid 4列)：当前总功率(KW)、最高电流(A)、平均电压(V)、电表总数
- ECharts 图表区域 (grid 2列)：
  - 左：电流趋势图 (line chart, 对应 BRD 图 13 SP1电流/SP2电流)
  - 右：功率趋势图 (line chart, 对应 BRD 图 13 SP1功率/SP2功率)

---

## 模块二：网络拓扑图

### 路由
- 路径：`/scada/monitor/network-topology`
- i18n key：`scada.monitor.networkTopology.title`

### API 接口

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 新增/编辑 | POST | `/scada/network-device/createOrUpdate` | 创建或更新网络设备 |
| 删除 | POST | `/scada/network-device/delete/${id}` | 删除网络设备 |
| 列表查询 | POST | 通用 `api_crud_search` | searchIdentity: `MNetworkDevice` |
| 拓扑数据 | GET | `/scada/network-device/topology` | 获取拓扑图数据(节点+连线) |

### 数据字段

**网络设备信息 (formBody)：**

| 字段 | 类型 | label | 必填 | 说明 |
|------|------|-------|------|------|
| id | hidden | - | - | 主键 |
| deviceNo | input-text | 设备编号 | 是 | 如 SCF1F02020 |
| deviceName | input-text | 设备名称 | 是 | |
| deviceType | select | 设备类型 | 是 | PLC、扫码器、网关、服务器、交换机、变频器 |
| ipAddress | input-text | IP地址 | 是 | IP 格式校验 |
| pnStation | input-text | PN站号 | 否 | Profinet 站号 |
| parentDevice | input-text | 上级设备 | 否 | 所连接的上级交换机/PLC 编号 |
| connectionType | select | 连接方式 | 否 | Ethernet、Profinet、Profibus、RS485 |
| online | switch | 在线状态 | 否 | |
| lastHeartbeat | datetime | 最后心跳 | 否 | |
| remark | textarea | 备注 | 否 | |

**CRUD 表格列 (crudColumns)：**
deviceNo(可搜索)、deviceName(可搜索)、deviceType(下拉搜索)、ipAddress(可搜索)、pnStation、connectionType、online(颜色标记)、lastHeartbeat、remark

**searchIdentity:** `MNetworkDevice`

### 页面结构

页面使用 Amis `tabs` 组件，包含两个 Tab：

**Tab 1 - 设备列表：**
- 标准 CRUD 表格
- online 字段使用 tpl 渲染颜色状态：`<span class='label label-success'>在线</span>` / `<span class='label label-danger'>离线</span>`
- headerToolbar: 新增设备 + 导出 Excel + 刷新

**Tab 2 - 拓扑图：**
- 使用 Amis `service` 组件加载拓扑数据
- 内嵌 Amis `custom` 组件，通过 `onMount` 回调用原生 JS/SVG 渲染拓扑图
- 拓扑图布局：参考 BRD 图 18 Profinet 网络诊断图
  - 顶部：Ethernet 主干网络
  - 中间：交换机层
  - 底部：PLC / IO 模块层
- 节点颜色：绿色(在线) / 红色(离线) / 灰色(未知)
- 节点点击弹出设备详情 dialog

---

## 模块三：设备巡检

### 路由
- 路径：`/scada/maintenance/equipment-inspection`
- i18n key：`scada.maintenance.equipmentInspection.title`

### API 接口

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 计划-新增/编辑 | POST | `/scada/inspection-plan/createOrUpdate` | 创建或更新巡检计划 |
| 计划-删除 | POST | `/scada/inspection-plan/delete/${id}` | 删除巡检计划 |
| 计划-列表 | POST | 通用 `api_crud_search` | searchIdentity: `MInspectionPlan` |
| 记录-新增/编辑 | POST | `/scada/inspection-record/createOrUpdate` | 创建或更新巡检记录 |
| 记录-删除 | POST | `/scada/inspection-record/delete/${id}` | 删除巡检记录 |
| 记录-列表 | POST | 通用 `api_crud_search` | searchIdentity: `MInspectionRecord` |
| 日历数据 | GET | `/scada/inspection-plan/calendar` | 获取指定月份的巡检日历数据 |
| 导入计划 | POST | `/scada/inspection-plan/import` | Excel 批量导入巡检计划 |

### 数据字段

**巡检计划 (planFormBody)：**

| 字段 | 类型 | label | 必填 | 说明 |
|------|------|-------|------|------|
| id | hidden | - | - | 主键 |
| planName | input-text | 计划名称 | 是 | |
| planType | select | 计划类型 | 是 | 日常巡检、周期保养、年度维护 |
| deviceNo | input-text | 关联设备 | 是 | 设备编号 |
| deviceName | input-text | 设备名称 | 是 | |
| cronExpression | input-text | cron 表达式 | 是 | 巡检周期调度 |
| estimatedHours | input-number | 预计工时(h) | 否 | |
| assignee | input-text | 负责人 | 是 | |
| inspectionContent | textarea | 巡检内容 | 是 | 具体巡检步骤/检查项 |
| status | select | 状态 | 是 | 启用、停用 |
| remark | textarea | 备注 | 否 | |

**巡检记录 (recordFormBody)：**

| 字段 | 类型 | label | 必填 | 说明 |
|------|------|-------|------|------|
| id | hidden | - | - | 主键 |
| planName | input-text | 关联计划 | 是 | |
| deviceNo | input-text | 设备编号 | 是 | |
| inspector | input-text | 巡检人 | 是 | |
| inspectionTime | input-datetime | 巡检时间 | 是 | |
| result | select | 巡检结果 | 是 | 正常、异常、待处理 |
| abnormalDesc | textarea | 异常描述 | 否 | result=异常时必填 |
| handleMethod | textarea | 处理方式 | 否 | |
| images | input-image | 现场图片 | 否 | 支持多图上传, 最大 5MB |
| remark | textarea | 备注 | 否 | |

**searchIdentity:** `MInspectionPlan` / `MInspectionRecord`

### 页面结构

页面使用 Amis `tabs` 组件，包含三个 Tab：

**Tab 1 - 巡检计划：**
- 标准 CRUD 表格
- headerToolbar: 新增计划 + 导入(上传 Excel) + 导出 Excel + 刷新
- 操作列: 修改(drawer) + 删除 + 查看记录(跳转 Tab 2 并过滤)
- status 字段使用 tpl 颜色渲染：启用(绿) / 停用(灰)

**Tab 2 - 巡检记录：**
- 标准 CRUD 表格
- result 字段颜色渲染：正常(绿) / 异常(红) / 待处理(橙)
- headerToolbar: 新增记录 + 导出 Excel + 刷新
- 操作列: 修改(drawer) + 删除 + 查看图片(dialog)

**Tab 3 - 巡检日历：**
- 对应 BRD 图 32 维养计划日历视图
- 使用 Amis `service` + `custom` 组件渲染月历
- 日历格子内显示当天的巡检计划条目（色块标记）
- 点击日期弹出当天计划详情 dialog
- 月份切换按钮（上月/本月/下月）

---

## 路由注册

在 `src/routes/path2Compoment.tsx` 的 `menuRouter` 数组中追加：

```typescript
// 电表管理
{
    path: "/scada/monitor/meter-management",
    name: <Translation>{(t) => t("scada.monitor.meterManagement.title")}</Translation>,
    component: lazy(() => import("@/pages/scada/monitor/meter_management"))
},
// 网络拓扑图
{
    path: "/scada/monitor/network-topology",
    name: <Translation>{(t) => t("scada.monitor.networkTopology.title")}</Translation>,
    component: lazy(() => import("@/pages/scada/monitor/network_topology"))
},
// 设备巡检
{
    path: "/scada/maintenance/equipment-inspection",
    name: <Translation>{(t) => t("scada.maintenance.equipmentInspection.title")}</Translation>,
    component: lazy(() => import("@/pages/scada/maintenance/equipment_inspection"))
},
```

## API 常量定义

在 `src/pages/scada/constants/api_constant.tsx` 中追加：

```typescript
// 电表管理
export const meter_create = "post:/scada/meter/createOrUpdate"
export const meter_delete = "post:/scada/meter/delete/${id}"
export const meter_power_data = "post:/scada/meter/powerData"

// 网络设备
export const network_device_create = "post:/scada/network-device/createOrUpdate"
export const network_device_delete = "post:/scada/network-device/delete/${id}"
export const network_device_topology = "get:/scada/network-device/topology"

// 巡检计划
export const inspection_plan_create = "post:/scada/inspection-plan/createOrUpdate"
export const inspection_plan_delete = "post:/scada/inspection-plan/delete/${id}"
export const inspection_plan_calendar = "get:/scada/inspection-plan/calendar"
export const inspection_plan_import = "post:/scada/inspection-plan/import"

// 巡检记录
export const inspection_record_create = "post:/scada/inspection-record/createOrUpdate"
export const inspection_record_delete = "post:/scada/inspection-record/delete/${id}"
```

## i18n 翻译键

需要在 `src/locales/` 下的中英文文件中添加：

```json
{
  "scada.monitor.meterManagement.title": "电表管理",
  "scada.monitor.networkTopology.title": "网络拓扑图",
  "scada.maintenance.equipmentInspection.title": "设备巡检"
}
```

## 不在范围内

- 后端 Java 服务实现
- 数据库表结构创建
- 与 PLC 的实时通讯集成
- 拓扑图的实时心跳刷新（需后端 WebSocket 支持）
