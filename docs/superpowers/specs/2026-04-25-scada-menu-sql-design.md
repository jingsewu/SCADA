# SCADA Menu SQL Design

**Date:** 2026-04-25
**Scope:** Generate `u_menu` INSERT statements for all SCADA client pages

---

## Background

The current `init_menu.sql` was accidentally overwritten with login log data. The original file (recoverable from git history at commit `22285cb`) contains menus for four systems: `wms`, `user`, `api-platform`, `mdm`. There are **no SCADA entries** in any version of the file.

The SCADA client (`client/src/pages/scada/`) has 10 pages with routes defined in `client/src/routes/path2Compoment.tsx`. A new SQL script must be created to register these pages as navigable menus.

---

## Menu Table Schema

`u_menu` columns:

| Column | Notes |
|---|---|
| `id` | Numeric ID, SCADA uses 12xxxxxxxx range |
| `create_user` | `'admin'` |
| `system_code` | `'scada'` |
| `parent_id` | `0` for root; parent ID for children |
| `type` | `1`=system root, `2`=group/page, `3`=button permission |
| `title` | Chinese display name |
| `description` | `NULL` |
| `permissions` | Path for type=2; API endpoint for type=3 |
| `order_num` | Sort order within siblings |
| `icon` | Icon name (root only); `NULL` for others |
| `path` | URL path for navigation; `NULL` for type=3 |
| `enable` | `1` |
| `create_time` | `0` |
| `update_time` | `0` |
| `update_user` | `''` |
| `iframe_show` | `0` for pages; `NULL` for root/permissions |

---

## Menu Tree (25 entries)

### type=1 Root

| ID | title | system_code | icon | permissions | path |
|---|---|---|---|---|---|
| 1200000000 | SCADA | scada | scadaapp | scada | '' |

### type=2 Groups (parent = 1200000000)

| ID | title | permissions | path | order |
|---|---|---|---|---|
| 1201000000 | SCADA监控 | /scada/monitor | /scada/monitor | 1 |
| 1202000000 | SCADA日志 | /scada/log | /scada/log | 2 |
| 1203000000 | SCADA统计 | /scada/statics | /scada/statics | 3 |
| 1204000000 | 设备维护 | /scada/maintenance | /scada/maintenance | 4 |

### type=2 Pages under SCADA监控 (parent = 1201000000)

| ID | title | permissions / path | order |
|---|---|---|---|
| 1201010000 | 实时监控 | /scada/monitor/equipment-scada | 1 |
| 1201020000 | 设备监控 | /scada/monitor/equipment-monitor | 2 |
| 1201030000 | 报警历史 | /scada/monitor/alarm-history | 3 |
| 1201040000 | 颜色配置 | /scada/monitor/color-config | 4 |
| 1201050000 | 电表管理 | /scada/monitor/meter-management | 5 |
| 1201060000 | 网络拓扑图 | /scada/monitor/network-topology | 6 |

### type=2 Pages under SCADA日志 (parent = 1202000000)

| ID | title | permissions / path | order |
|---|---|---|---|
| 1202010000 | SCADA日志 | /scada/log/scada-log | 1 |

### type=2 Pages under SCADA统计 (parent = 1203000000)

| ID | title | permissions / path | order |
|---|---|---|---|
| 1203010000 | SCADA扫描频率 | /scada/monitor/scada-scan-rate | 1 |
| 1203020000 | SCADA流量统计 | /scada/monitor/scada-traffic-statistics | 2 |

### type=2 Pages under 设备维护 (parent = 1204000000)

| ID | title | permissions / path | order |
|---|---|---|---|
| 1204010000 | 设备巡检 | /scada/maintenance/equipment-inspection | 1 |

### type=3 Button Permissions

| ID | title | parent | permissions |
|---|---|---|---|
| 1201020001 | 新增/修改 | 1201020000 (设备监控) | post:/scada/device-monitor/createOrUpdate |
| 1201020002 | 删除 | 1201020000 (设备监控) | post:/scada/device-monitor/delete/${id} |
| 1201040001 | 新增/修改 | 1201040000 (颜色配置) | post:/scada/color-config/createOrUpdate |
| 1201040002 | 删除 | 1201040000 (颜色配置) | post:/scada/color-config/delete/${id} |
| 1201050001 | 新增/修改 | 1201050000 (电表管理) | post:/scada/meter/createOrUpdate |
| 1201050002 | 删除 | 1201050000 (电表管理) | post:/scada/meter/delete/${id} |
| 1201050003 | 查看用电数据 | 1201050000 (电表管理) | post:/scada/meter/powerData |
| 1201060001 | 新增/修改 | 1201060000 (网络拓扑图) | post:/scada/network-device/createOrUpdate |
| 1201060002 | 删除 | 1201060000 (网络拓扑图) | post:/scada/network-device/delete/${id} |
| 1201060003 | 查看拓扑 | 1201060000 (网络拓扑图) | get:/scada/network-device/topology |
| 1204010001 | 新增/修改巡检计划 | 1204010000 (设备巡检) | post:/scada/inspection-plan/createOrUpdate |
| 1204010002 | 删除巡检计划 | 1204010000 (设备巡检) | post:/scada/inspection-plan/delete/${id} |
| 1204010003 | 查看日历 | 1204010000 (设备巡检) | get:/scada/inspection-plan/calendar |
| 1204010004 | 导入 | 1204010000 (设备巡检) | post:/scada/inspection-plan/import |
| 1204010005 | 新增/修改巡检记录 | 1204010000 (设备巡检) | post:/scada/inspection-record/createOrUpdate |
| 1204010006 | 删除巡检记录 | 1204010000 (设备巡检) | post:/scada/inspection-record/delete/${id} |

---

## Output File

**New file:** `server/server/scada-server/src/main/resources/db/sql/init/user/init_scada_menu.sql`

**Update:** `server/server/scada-server/src/main/resources/db/changelog/db.changelog-1.0.xml`
— Add `<sqlFile path="classpath:db/sql/init/user/init_scada_menu.sql"/>` inside the existing `init` changeSet.

---

## Route Alignment

All page paths match routes defined in `client/src/routes/path2Compoment.tsx`:

| Page component | Route path |
|---|---|
| ConnectedRectangles | `/scada/monitor/equipment-scada` |
| equipment_monitor | `/scada/monitor/equipment-monitor` |
| alarm_history | `/scada/monitor/alarm-history` |
| color_config | `/scada/monitor/color-config` |
| meter_management | `/scada/monitor/meter-management` |
| network_topology | `/scada/monitor/network-topology` |
| scada_log | `/scada/log/scada-log` |
| scada_scan_rate | `/scada/monitor/scada-scan-rate` |
| scada_traffic_statistics | `/scada/monitor/scada-traffic-statistics` |
| equipment_inspection | `/scada/maintenance/equipment-inspection` |
