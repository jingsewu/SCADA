import React, { lazy } from "react"
import { Translation } from "react-i18next"

interface RouterItem {
    [param: string]: any
}

const meta = {
    keepAlive: true,
    closable: true,
    cache: true
}

const baseRouter = [
    {
        path: "/",
        // component: lazy(() => import("@/pages/Login"))
        component: lazy(() => import("@/pages/scada/monitor/ConnectedRectangles"))
    },
    {
        path: "/login",
        component: lazy(() => import("@/pages/Login"))
    },
    {
        path: "/register",
        component: lazy(() => import("@/pages/Register"))
    }
]

const menuRouter = [
    {
        path: "/user/user-manage",
        name: (
            <Translation>
                {(t) => t("userCenter.userManagement.title")}
            </Translation>
        ),
        component: lazy(() => import("@/pages/user/user_management"))
    },
    {
        path: "/user/role-manage",
        name: (
            <Translation>
                {(t) => t("userCenter.roleManagement.title")}
            </Translation>
        ),
        component: lazy(() => import("@/pages/user/role_management"))
    },
    {
        path: "/user/menu-manage",
        name: (
            <Translation>
                {(t) => t("userCenter.menuManagement.title")}
            </Translation>
        ),
        component: lazy(() => import("@/pages/user/menu_management"))
    },
    {
        path: "/user/login-log-manage",
        name: (
            <Translation>{(t) => t("userCenter.loginLogs.title")}</Translation>
        ),
        component: lazy(() => import("@/pages/user/login_log"))
    },

    // API Platform
    {
        path: "/api-platform/api-dashboard",
        name: (
            <Translation>
                {(t) => t("interfacePlatform.dashboard.title")}
            </Translation>
        ),
        component: lazy(() => import("@/pages/api_platform/api_dashboard"))
    },
    {
        path: "/api-platform/api-management",
        name: (
            <Translation>
                {(t) => t("interfacePlatform.interfaceManagement.title")}
            </Translation>
        ),
        component: lazy(() => import("@/pages/api_platform/api_management"))
    },
    {
        path: "/api-platform/api-log",
        name: (
            <Translation>
                {(t) => t("interfacePlatform.interfaceLogs.title")}
            </Translation>
        ),
        component: lazy(() => import("@/pages/api_platform/api_log"))
    },
    {
        path: "/api-platform/api-keys",
        name: (
            <Translation>
                {(t) => t("interfacePlatform.apiKeys.title")}
            </Translation>
        ),
        component: lazy(() => import("@/pages/api_platform/api_keys"))
    },

    //Scada
    {
        path: "/scada/monitor/alarm-history",
        name: (
            <Translation>
                {(t) => t("scada.monitor.alarmHistory.title")}
            </Translation>
        ),
        component: lazy(() => import("@/pages/scada/monitor/alarm_history"))
    },
    {
        path: "/scada/monitor/color-config",
        name: (
            <Translation>
                {(t) => t("scada.monitor.colorConfig.title")}
            </Translation>
        ),
        component: lazy(() => import("@/pages/scada/monitor/color_config"))
    },
    {
        path: "/scada/monitor/equipment-monitor",
        name: (
            <Translation>
                {(t) => t("scada.monitor.equipmentMonitor.title")}
            </Translation>
        ),
        component: lazy(
            () => import("@/pages/scada/monitor/equipment_monitor")
        )
    },
    {
        path: "/scada/monitor/equipment-scada",
        name: (
            <Translation>
                {(t) => t("scada.monitor.equipmentMonitor.title")}
            </Translation>
        ),
        component: lazy(
            () => import("@/pages/scada/monitor/ConnectedRectangles")
        )
    },
    {
        path: "/scada/monitor/scada-scan-rate",
        name: (
            <Translation>
                {(t) => t("scada.statics.scadaScanRate.title")}
            </Translation>
        ),
        component: lazy(() => import("@/pages/scada/statics/scada_scan_rate"))
    },
    {
        path: "/scada/monitor/scada-traffic-statistics",
        name: (
            <Translation>
                {(t) => t("scada.statics.scadaTrafficStatistics.title")}
            </Translation>
        ),
        component: lazy(
            () => import("@/pages/scada/statics/scada_traffic_statistics")
        )
    },
    {
        path: "/scada/log/scada-log",
        name: <Translation>{(t) => t("scada.log.scadaLog.title")}</Translation>,
        component: lazy(() => import("@/pages/scada/log/scada_log")) // Assuming one more file exists
    }
]

const router = menuRouter.map((item: RouterItem) => {
    return item.meta
        ? item
        : {
              ...item,
              meta
          }
})

const path2components = [...baseRouter, ...router]

export default path2components
