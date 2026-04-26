-- ============================================================
-- Migration: replace hardcoded Chinese titles in u_menu with i18n keys
-- Fixes SCADA menu not supporting internationalization
-- Affected changeset: init-scada-menu (ran from f28cdcf with Chinese titles)
-- ============================================================

-- type=1: System root
UPDATE `u_menu` SET `title` = 'scada.menu.scada' WHERE `id` = 1200000000;

-- type=2: Group nodes
UPDATE `u_menu` SET `title` = 'scada.menu.monitor'     WHERE `id` = 1201000000;
UPDATE `u_menu` SET `title` = 'scada.menu.log'         WHERE `id` = 1202000000;
UPDATE `u_menu` SET `title` = 'scada.menu.statistics'  WHERE `id` = 1203000000;
UPDATE `u_menu` SET `title` = 'scada.menu.maintenance' WHERE `id` = 1204000000;

-- type=2: Page nodes under SCADA监控
UPDATE `u_menu` SET `title` = 'scada.menu.realTimeMonitor'  WHERE `id` = 1201010000;
UPDATE `u_menu` SET `title` = 'scada.menu.deviceMonitor'    WHERE `id` = 1201020000;
UPDATE `u_menu` SET `title` = 'scada.menu.alarmHistory'     WHERE `id` = 1201030000;
UPDATE `u_menu` SET `title` = 'scada.menu.colorConfig'      WHERE `id` = 1201040000;
UPDATE `u_menu` SET `title` = 'scada.menu.meterManagement'  WHERE `id` = 1201050000;
UPDATE `u_menu` SET `title` = 'scada.menu.networkTopology'  WHERE `id` = 1201060000;

-- type=2: Page nodes under SCADA日志 / SCADA统计 / 设备维护
UPDATE `u_menu` SET `title` = 'scada.menu.logPage'          WHERE `id` = 1202010000;
UPDATE `u_menu` SET `title` = 'scada.menu.scanRate'         WHERE `id` = 1203010000;
UPDATE `u_menu` SET `title` = 'scada.menu.trafficStats'     WHERE `id` = 1203020000;
UPDATE `u_menu` SET `title` = 'scada.menu.deviceInspection' WHERE `id` = 1204010000;

-- type=3: Button permissions under 设备监控
UPDATE `u_menu` SET `title` = 'scada.menu.btn.createOrUpdate' WHERE `id` = 1201020001;
UPDATE `u_menu` SET `title` = 'button.delete'                 WHERE `id` = 1201020002;

-- type=3: Button permissions under 颜色配置
UPDATE `u_menu` SET `title` = 'scada.menu.btn.createOrUpdate' WHERE `id` = 1201040001;
UPDATE `u_menu` SET `title` = 'button.delete'                 WHERE `id` = 1201040002;

-- type=3: Button permissions under 电表管理
UPDATE `u_menu` SET `title` = 'scada.menu.btn.createOrUpdate' WHERE `id` = 1201050001;
UPDATE `u_menu` SET `title` = 'button.delete'                 WHERE `id` = 1201050002;
UPDATE `u_menu` SET `title` = 'scada.menu.btn.viewPowerData'  WHERE `id` = 1201050003;

-- type=3: Button permissions under 网络拓扑图
UPDATE `u_menu` SET `title` = 'scada.menu.btn.createOrUpdate' WHERE `id` = 1201060001;
UPDATE `u_menu` SET `title` = 'button.delete'                 WHERE `id` = 1201060002;
UPDATE `u_menu` SET `title` = 'scada.menu.btn.viewTopology'   WHERE `id` = 1201060003;

-- type=3: Button permissions under 设备巡检
UPDATE `u_menu` SET `title` = 'scada.menu.btn.createOrUpdateInspectionPlan'   WHERE `id` = 1204010001;
UPDATE `u_menu` SET `title` = 'scada.menu.btn.deleteInspectionPlan'           WHERE `id` = 1204010002;
UPDATE `u_menu` SET `title` = 'scada.menu.btn.viewCalendar'                   WHERE `id` = 1204010003;
UPDATE `u_menu` SET `title` = 'button.import'                                 WHERE `id` = 1204010004;
UPDATE `u_menu` SET `title` = 'scada.menu.btn.createOrUpdateInspectionRecord' WHERE `id` = 1204010005;
UPDATE `u_menu` SET `title` = 'scada.menu.btn.deleteInspectionRecord'         WHERE `id` = 1204010006;
