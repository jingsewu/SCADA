# SCADA Menu i18n Design

**Date:** 2026-04-26
**Status:** Approved
**Scope:** `init_scada_menu.sql` + `zh-cn.json` + `en-us.json`

## Background

The `init_scada_menu.sql` file initializes 31 SCADA menu entries. Currently all `title` fields contain hardcoded Chinese text (e.g., `'实时监控'`). When users switch the UI language to English, the frontend's `t(link.title)` fallback in `LayoutAside.tsx` fails to find a translation and displays raw Chinese.

The WMS module already uses the correct pattern: storing i18n keys in the `title` DB column and maintaining translations in the locale JSON files.

## Goal

Make SCADA menu titles react to language switching (zh-CN ↔ en-US) by adopting the same i18n key pattern used by WMS.

## Approach

**Store i18n keys in the SQL `title` field.** No schema changes, no backend changes. The frontend's existing `t(link.title)` call handles everything automatically.

## Files to Change

| File | Change |
|------|--------|
| `server/server/scada-server/src/main/resources/db/sql/init/user/init_scada_menu.sql` | Replace Chinese title values with i18n keys |
| `client/src/locales/zh-cn.json` | Add `scada.menu.*` keys with Chinese values |
| `client/src/locales/en-us.json` | Add `scada.menu.*` keys with English values |

No Liquibase migration changeset needed (environments can re-initialize from SQL).

## i18n Key Mapping

Key naming convention: `scada.menu.<camelCaseName>` for menus, `scada.menu.btn.<action>` for button permissions.

### Menu Entries (type 1 & 2)

| ID | Chinese title | i18n key | zh-CN value | en-US value |
|----|--------------|----------|-------------|-------------|
| 1200000000 | SCADA | `scada.menu.scada` | SCADA | SCADA |
| 1201000000 | SCADA监控 | `scada.menu.monitor` | SCADA监控 | SCADA Monitor |
| 1202000000 | SCADA日志 | `scada.menu.log` | SCADA日志 | SCADA Log |
| 1203000000 | SCADA统计 | `scada.menu.statistics` | SCADA统计 | SCADA Statistics |
| 1204000000 | 设备维护 | `scada.menu.maintenance` | 设备维护 | Equipment Maintenance |
| 1201010000 | 实时监控 | `scada.menu.realTimeMonitor` | 实时监控 | Real-time Monitoring |
| 1201020000 | 设备监控 | `scada.menu.deviceMonitor` | 设备监控 | Device Monitor |
| 1201030000 | 报警历史 | `scada.menu.alarmHistory` | 报警历史 | Alarm History |
| 1201040000 | 颜色配置 | `scada.menu.colorConfig` | 颜色配置 | Color Config |
| 1201050000 | 电表管理 | `scada.menu.meterManagement` | 电表管理 | Meter Management |
| 1201060000 | 网络拓扑图 | `scada.menu.networkTopology` | 网络拓扑图 | Network Topology |
| 1202010000 | SCADA日志 (page) | `scada.menu.logPage` | SCADA日志 | SCADA Log |
| 1203010000 | SCADA扫描频率 | `scada.menu.scanRate` | SCADA扫描频率 | SCADA Scan Rate |
| 1203020000 | SCADA流量统计 | `scada.menu.trafficStats` | SCADA流量统计 | SCADA Traffic Statistics |
| 1204010000 | 设备巡检 | `scada.menu.deviceInspection` | 设备巡检 | Device Inspection |

### Button Permission Entries (type 3)

Button titles follow the same pattern as other modules. Map each `title` value to an existing shared key if one exists (e.g., `button.add`, `button.delete`), or define a new `scada.menu.btn.*` key.

| Chinese title | i18n key |
|--------------|----------|
| 新增/修改 | `scada.menu.btn.createUpdate` |
| 删除 | `scada.menu.btn.delete` |
| 查看 | `scada.menu.btn.view` |

> Check `zh-cn.json` and `en-us.json` during implementation — if `button.add`, `button.delete`, `button.view` etc. already exist and match semantically, reuse those keys instead of creating new ones.

## Frontend

No changes required. `LayoutAside.tsx` already implements:

```tsx
{link.languageValueMappings?.[store.locale] || t(link.title)}
```

Once `title` contains a valid i18n key, `t(link.title)` resolves it correctly.

## Out of Scope

- Backend API changes
- Database schema changes
- Liquibase migration changeset
- Any other module's menu entries