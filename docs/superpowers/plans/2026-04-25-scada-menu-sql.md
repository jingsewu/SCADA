# SCADA Menu SQL Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create `init_scada_menu.sql` with 31 INSERT statements that register all 10 SCADA client pages in the `u_menu` table, including type=3 button permissions, then wire it into the Liquibase changelog.

**Architecture:** One new SQL file contains all SCADA menu data (root → groups → pages → button permissions). A new Liquibase changeSet references it so it runs automatically on server startup for both fresh and existing installs.

**Tech Stack:** MySQL 8.0, Liquibase 3.8 (via Spring Boot), SQL

---

## Files

| Action | Path |
|---|---|
| **Create** | `server/server/scada-server/src/main/resources/db/sql/init/user/init_scada_menu.sql` |
| **Modify** | `server/server/scada-server/src/main/resources/db/changelog/db.changelog-1.0.xml` |

---

## Task 1: Write the SQL file

**Files:**
- Create: `server/server/scada-server/src/main/resources/db/sql/init/user/init_scada_menu.sql`

- [ ] **Step 1: Create the SQL file with all 31 INSERT statements**

Write the following content to `server/server/scada-server/src/main/resources/db/sql/init/user/init_scada_menu.sql`:

```sql
-- ============================================================
-- SCADA Menu Initialization
-- system_code: 'scada'
-- ID range: 1200000000+
-- ============================================================

-- ---- type=1: System Root ----
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1200000000, 'admin', 'scada', 0, 1, 'SCADA', NULL, 'scada', 3, 'scadaapp', '', 1, 0, 0, '', NULL);

-- ---- type=2: Groups (parent = 1200000000) ----
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1201000000, 'admin', 'scada', 1200000000, 2, 'SCADA监控', NULL, '/scada/monitor', 1, NULL, '/scada/monitor', 1, 0, 0, '', 0);
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1202000000, 'admin', 'scada', 1200000000, 2, 'SCADA日志', NULL, '/scada/log', 2, NULL, '/scada/log', 1, 0, 0, '', 0);
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1203000000, 'admin', 'scada', 1200000000, 2, 'SCADA统计', NULL, '/scada/statics', 3, NULL, '/scada/statics', 1, 0, 0, '', 0);
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1204000000, 'admin', 'scada', 1200000000, 2, '设备维护', NULL, '/scada/maintenance', 4, NULL, '/scada/maintenance', 1, 0, 0, '', 0);

-- ---- type=2: Pages under SCADA监控 (parent = 1201000000) ----
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1201010000, 'admin', 'scada', 1201000000, 2, '实时监控', NULL, '/scada/monitor/equipment-scada', 1, NULL, '/scada/monitor/equipment-scada', 1, 0, 0, '', 0);
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1201020000, 'admin', 'scada', 1201000000, 2, '设备监控', NULL, '/scada/monitor/equipment-monitor', 2, NULL, '/scada/monitor/equipment-monitor', 1, 0, 0, '', 0);
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1201030000, 'admin', 'scada', 1201000000, 2, '报警历史', NULL, '/scada/monitor/alarm-history', 3, NULL, '/scada/monitor/alarm-history', 1, 0, 0, '', 0);
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1201040000, 'admin', 'scada', 1201000000, 2, '颜色配置', NULL, '/scada/monitor/color-config', 4, NULL, '/scada/monitor/color-config', 1, 0, 0, '', 0);
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1201050000, 'admin', 'scada', 1201000000, 2, '电表管理', NULL, '/scada/monitor/meter-management', 5, NULL, '/scada/monitor/meter-management', 1, 0, 0, '', 0);
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1201060000, 'admin', 'scada', 1201000000, 2, '网络拓扑图', NULL, '/scada/monitor/network-topology', 6, NULL, '/scada/monitor/network-topology', 1, 0, 0, '', 0);

-- ---- type=2: Pages under SCADA日志 (parent = 1202000000) ----
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1202010000, 'admin', 'scada', 1202000000, 2, 'SCADA日志', NULL, '/scada/log/scada-log', 1, NULL, '/scada/log/scada-log', 1, 0, 0, '', 0);

-- ---- type=2: Pages under SCADA统计 (parent = 1203000000) ----
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1203010000, 'admin', 'scada', 1203000000, 2, 'SCADA扫描频率', NULL, '/scada/monitor/scada-scan-rate', 1, NULL, '/scada/monitor/scada-scan-rate', 1, 0, 0, '', 0);
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1203020000, 'admin', 'scada', 1203000000, 2, 'SCADA流量统计', NULL, '/scada/monitor/scada-traffic-statistics', 2, NULL, '/scada/monitor/scada-traffic-statistics', 1, 0, 0, '', 0);

-- ---- type=2: Pages under 设备维护 (parent = 1204000000) ----
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1204010000, 'admin', 'scada', 1204000000, 2, '设备巡检', NULL, '/scada/maintenance/equipment-inspection', 1, NULL, '/scada/maintenance/equipment-inspection', 1, 0, 0, '', 0);

-- ---- type=3: Button permissions under 设备监控 (parent = 1201020000) ----
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1201020001, 'admin', 'scada', 1201020000, 3, '新增/修改', NULL, 'post:/scada/device-monitor/createOrUpdate', 1, NULL, NULL, 1, 0, 0, '', NULL);
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1201020002, 'admin', 'scada', 1201020000, 3, '删除', NULL, 'post:/scada/device-monitor/delete/${id}', 2, NULL, NULL, 1, 0, 0, '', NULL);

-- ---- type=3: Button permissions under 颜色配置 (parent = 1201040000) ----
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1201040001, 'admin', 'scada', 1201040000, 3, '新增/修改', NULL, 'post:/scada/color-config/createOrUpdate', 1, NULL, NULL, 1, 0, 0, '', NULL);
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1201040002, 'admin', 'scada', 1201040000, 3, '删除', NULL, 'post:/scada/color-config/delete/${id}', 2, NULL, NULL, 1, 0, 0, '', NULL);

-- ---- type=3: Button permissions under 电表管理 (parent = 1201050000) ----
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1201050001, 'admin', 'scada', 1201050000, 3, '新增/修改', NULL, 'post:/scada/meter/createOrUpdate', 1, NULL, NULL, 1, 0, 0, '', NULL);
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1201050002, 'admin', 'scada', 1201050000, 3, '删除', NULL, 'post:/scada/meter/delete/${id}', 2, NULL, NULL, 1, 0, 0, '', NULL);
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1201050003, 'admin', 'scada', 1201050000, 3, '查看用电数据', NULL, 'post:/scada/meter/powerData', 3, NULL, NULL, 1, 0, 0, '', NULL);

-- ---- type=3: Button permissions under 网络拓扑图 (parent = 1201060000) ----
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1201060001, 'admin', 'scada', 1201060000, 3, '新增/修改', NULL, 'post:/scada/network-device/createOrUpdate', 1, NULL, NULL, 1, 0, 0, '', NULL);
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1201060002, 'admin', 'scada', 1201060000, 3, '删除', NULL, 'post:/scada/network-device/delete/${id}', 2, NULL, NULL, 1, 0, 0, '', NULL);
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1201060003, 'admin', 'scada', 1201060000, 3, '查看拓扑', NULL, 'get:/scada/network-device/topology', 3, NULL, NULL, 1, 0, 0, '', NULL);

-- ---- type=3: Button permissions under 设备巡检 (parent = 1204010000) ----
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1204010001, 'admin', 'scada', 1204010000, 3, '新增/修改巡检计划', NULL, 'post:/scada/inspection-plan/createOrUpdate', 1, NULL, NULL, 1, 0, 0, '', NULL);
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1204010002, 'admin', 'scada', 1204010000, 3, '删除巡检计划', NULL, 'post:/scada/inspection-plan/delete/${id}', 2, NULL, NULL, 1, 0, 0, '', NULL);
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1204010003, 'admin', 'scada', 1204010000, 3, '查看日历', NULL, 'get:/scada/inspection-plan/calendar', 3, NULL, NULL, 1, 0, 0, '', NULL);
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1204010004, 'admin', 'scada', 1204010000, 3, '导入', NULL, 'post:/scada/inspection-plan/import', 4, NULL, NULL, 1, 0, 0, '', NULL);
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1204010005, 'admin', 'scada', 1204010000, 3, '新增/修改巡检记录', NULL, 'post:/scada/inspection-record/createOrUpdate', 5, NULL, NULL, 1, 0, 0, '', NULL);
INSERT INTO `u_menu` (`id`, `create_user`, `system_code`, `parent_id`, `type`, `title`, `description`, `permissions`, `order_num`, `icon`, `path`, `enable`, `create_time`, `update_time`, `update_user`, `iframe_show`) VALUES (1204010006, 'admin', 'scada', 1204010000, 3, '删除巡检记录', NULL, 'post:/scada/inspection-record/delete/${id}', 6, NULL, NULL, 1, 0, 0, '', NULL);
```

- [ ] **Step 2: Verify row count**

```bash
grep -c "^INSERT" server/server/scada-server/src/main/resources/db/sql/init/user/init_scada_menu.sql
```

Expected output: `31`

- [ ] **Step 3: Verify no ID duplicates within the file**

```bash
grep -oE '\([0-9]{10},' server/server/scada-server/src/main/resources/db/sql/init/user/init_scada_menu.sql \
  | sort | uniq -d
```

Expected output: *(empty — no duplicates)*

- [ ] **Step 4: Commit**

```bash
git add server/server/scada-server/src/main/resources/db/sql/init/user/init_scada_menu.sql
git commit -m "feat: add SCADA menu init SQL (31 entries)"
```

---

## Task 2: Wire the SQL file into Liquibase changelog

**Files:**
- Modify: `server/server/scada-server/src/main/resources/db/changelog/db.changelog-1.0.xml`

- [ ] **Step 1: Add a new changeSet after the existing `init` changeSet**

Current file (`db.changelog-1.0.xml`):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog
        xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
        http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-3.8.xsd">

    <!-- Create a table -->
    <changeSet id="init" author="Kinser">
        <sqlFile path="classpath:db/sql/init/user/init_user.sql"/>
        <sqlFile path="classpath:db/sql/init/user/init_menu.sql"/>
    </changeSet>

</databaseChangeLog>
```

Replace with:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog
        xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
        http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-3.8.xsd">

    <!-- Create a table -->
    <changeSet id="init" author="Kinser">
        <sqlFile path="classpath:db/sql/init/user/init_user.sql"/>
        <sqlFile path="classpath:db/sql/init/user/init_menu.sql"/>
    </changeSet>

    <!-- SCADA menu entries -->
    <changeSet id="init-scada-menu" author="Kinser">
        <sqlFile path="classpath:db/sql/init/user/init_scada_menu.sql"/>
    </changeSet>

</databaseChangeLog>
```

> **Why a separate changeSet?** The `init` changeSet has already been executed on existing installs. Liquibase tracks executed changeSets by ID and won't re-run them. A new `id="init-scada-menu"` ensures the SCADA inserts run on both fresh and existing databases.

- [ ] **Step 2: Verify the XML is well-formed**

```bash
xmllint --noout server/server/scada-server/src/main/resources/db/changelog/db.changelog-1.0.xml 2>&1
```

Expected output: *(empty — no errors)*

If `xmllint` is not installed: open the file and visually confirm all tags are closed and indentation is consistent.

- [ ] **Step 3: Commit**

```bash
git add server/server/scada-server/src/main/resources/db/changelog/db.changelog-1.0.xml
git commit -m "feat: register init_scada_menu.sql in Liquibase changelog"
```

---

## Task 3: Verify against a running database (optional but recommended)

If MySQL is accessible (via Docker or direct connection), run the following to confirm the rows loaded correctly.

- [ ] **Step 1: Execute the SQL directly against MySQL**

```bash
# Via Docker (if the container is running)
docker exec -i $(docker compose ps -q mysql) \
  mysql -uroot -proot scada < \
  server/server/scada-server/src/main/resources/db/sql/init/user/init_scada_menu.sql
```

Or via the MySQL CLI if connected directly:

```sql
USE scada;
SOURCE server/server/scada-server/src/main/resources/db/sql/init/user/init_scada_menu.sql;
```

Expected output: `Query OK, 1 row affected` repeated 31 times (no errors).

- [ ] **Step 2: Verify total row count**

```sql
SELECT COUNT(*) FROM u_menu WHERE system_code = 'scada';
```

Expected: `31`

- [ ] **Step 3: Verify hierarchy is intact**

```sql
-- Root
SELECT id, type, title, parent_id FROM u_menu WHERE system_code = 'scada' AND type = 1;
-- Expected: 1 row, id=1200000000, parent_id=0, title='SCADA'

-- Groups
SELECT id, type, title, parent_id, order_num FROM u_menu WHERE system_code = 'scada' AND type = 2 AND parent_id = 1200000000 ORDER BY order_num;
-- Expected: 4 rows: SCADA监控, SCADA日志, SCADA统计, 设备维护

-- Monitor pages
SELECT id, title, path FROM u_menu WHERE system_code = 'scada' AND parent_id = 1201000000 ORDER BY order_num;
-- Expected: 6 rows with correct paths

-- Button permissions
SELECT COUNT(*) FROM u_menu WHERE system_code = 'scada' AND type = 3;
-- Expected: 16
```

- [ ] **Step 4: Rollback if errors found**

If any INSERT failed (e.g., duplicate key, wrong database), clean up with:

```sql
DELETE FROM u_menu WHERE system_code = 'scada';
```

Then fix the SQL and re-run Step 1.

---

## Self-Review Checklist

- [x] All 31 IDs are in the `12xxxxxxxx` range with no overlaps with existing WMS (10/20xx), User (11xx), or api-platform (snowflake) IDs
- [x] All 10 page paths match routes defined in `client/src/routes/path2Compoment.tsx`
- [x] All 16 button permission strings match constants in `client/src/pages/scada/constants/api_constant.tsx`
- [x] `parent_id` values are self-consistent (every child references a parent defined earlier in the file)
- [x] `type=3` entries have `path = NULL` and `iframe_show = NULL`, matching existing button permission pattern
- [x] New Liquibase changeSet uses a new unique ID (`init-scada-menu`) so it runs on both fresh and existing DBs
- [x] Build resources mirror path (`build/resources/main/db/...`) will be updated automatically by Maven/Gradle build
