import schema2component from "@/utils/schema2component";
import { api_crud_search } from "@/pages/constantApi";
import i18n from "i18next";

// ==================== 静态模拟数据 ====================
// TODO: 后端接口就绪后，将以下静态数据替换为 API 调用
// 建议接口: POST /scada/api/trafficStatistics/summary
// 返回格式: { scannerList: [{scannerNo, flowTotal, readCount, noReadCount}], totalFlow, deviceCount }

const scannerLabels = [
    "SC-100", "SC-110", "SC-150", "SC-198", "SC-200",
    "SC-202", "SC-210", "SC-220", "SC-300", "SC-400",
    "SC-401", "SC-450"
];
const flowTotalData = [173, 26, 180, 145, 210, 195, 168, 132, 198, 155, 142, 188];
const readCountData = [170, 25, 177, 142, 207, 192, 165, 130, 195, 152, 140, 185];
const noReadCountData = [3, 1, 3, 3, 3, 3, 3, 2, 3, 3, 2, 3];
const totalFlow = flowTotalData.reduce((a, b) => a + b, 0);
const deviceCount = scannerLabels.length;
const avgFlow = (totalFlow / deviceCount).toFixed(1);
// ==================== 静态数据结束 ====================

const searchIdentity = "ScanRateLog";

// CRUD 表格列配置
const crudColumns = [
    {
        name: "dvcNo",
        label: "scada.statics.traffic.dvcNo"
    },
    {
        name: "scannerNo",
        label: "scada.statics.traffic.scannerNo"
    },
    {
        name: "flowTotal",
        label: "scada.statics.traffic.flowTotal",
        sortable: true
    },
];

const schema = {
    type: "page",
    title: "scada.statics.traffic.pageTitle",
    body: [
        // ========== 1. 筛选区域 ==========
        {
            type: "form",
            title: "",
            mode: "horizontal",
            className: "m-b-md",
            target: "trafficCrud",
            body: [
                {
                    type: "select",
                    name: "plcCabinet",
                    label: "scada.statics.scanRate.plcCabinet",
                    value: "PLC2",
                    clearable: false,
                    options: [
                        { label: "PLC1", value: "PLC1" },
                        { label: "PLC2", value: "PLC2" },
                        { label: "PLC3", value: "PLC3" }
                    ]
                },
                {
                    type: "input-text",
                    name: "scannerNo",
                    label: "scada.statics.scanRate.scanner",
                    placeholder: "scada.statics.traffic.scannerNo.placeholder"
                },
                {
                    type: "input-datetime-range",
                    name: "queryTime",
                    label: "scada.statics.scanRate.queryTime",
                    format: "YYYY-MM-DD HH:mm:ss",
                    inputFormat: "YYYY-MM-DD HH:mm:ss"
                }
            ],
            actions: [
                {
                    type: "button",
                    label: "button.search",
                    actionType: "submit",
                    level: "primary"
                },
                {
                    type: "button",
                    label: "button.reset",
                    actionType: "reset"
                }
            ]
        },

        // ========== 2. 统计卡片 ==========
        {
            type: "grid",
            className: "m-b-md",
            columns: [
                {
                    md: 4,
                    body: {
                        type: "card",
                        header: {
                            title: "scada.statics.traffic.flowTotal"
                        },
                        body: {
                            type: "tpl",
                            tpl: `<div class='text-center'><h1 class='text-primary'>${totalFlow}</h1><p class='text-muted'>scada.statics.traffic.card.totalFlow.unit</p></div>`
                        }
                    }
                },
                {
                    md: 4,
                    body: {
                        type: "card",
                        header: {
                            title: "scada.statics.traffic.deviceCount"
                        },
                        body: {
                            type: "tpl",
                            tpl: `<div class='text-center'><h1 class='text-info'>${deviceCount}</h1><p class='text-muted'>scada.statics.traffic.card.deviceCount.unit</p></div>`
                        }
                    }
                },
                {
                    md: 4,
                    body: {
                        type: "card",
                        header: {
                            title: "scada.statics.traffic.avgFlow"
                        },
                        body: {
                            type: "tpl",
                            tpl: `<div class='text-center'><h1 class='text-success'>${avgFlow}</h1><p class='text-muted'>scada.statics.traffic.card.avgFlow.unit</p></div>`
                        }
                    }
                }
            ]
        },

        // ========== 3. 柱状图 - 流量统计 ==========
        {
            type: "card",
            className: "m-b-md",
            header: {
                title: "scada.statics.traffic.barChart"
            },
            body: {
                type: "chart",
                height: 400,
                // TODO: 对接后端接口后取消注释以下 api 配置
                // api: {
                //     method: "POST",
                //     url: "/scada/api/trafficStatistics/chart",
                //     adaptor: (payload: any) => ({
                //         ...payload,
                //         config: { /* 根据返回数据动态构建 ECharts config */ }
                //     })
                // },
                config: {
                    tooltip: {
                        trigger: "axis",
                        axisPointer: { type: "shadow" }
                    },
                    legend: {
                        data: [
                            i18n.t("scada.statics.traffic.chart.totalFlow"),
                            i18n.t("scada.statics.traffic.chart.validRead"),
                            i18n.t("scada.statics.traffic.chart.invalidRead")
                        ]
                    },
                    grid: {
                        left: "3%",
                        right: "4%",
                        bottom: "3%",
                        containLabel: true
                    },
                    xAxis: {
                        type: "category",
                        data: scannerLabels,
                        axisLabel: {
                            rotate: 30
                        }
                    },
                    yAxis: {
                        type: "value",
                        name: i18n.t("scada.statics.traffic.chart.quantity")
                    },
                    series: [
                        {
                            name: i18n.t("scada.statics.traffic.chart.totalFlow"),
                            type: "bar",
                            data: flowTotalData,
                            itemStyle: {
                                color: "#1890ff"
                            },
                            label: {
                                show: true,
                                position: "top"
                            }
                        },
                        {
                            name: i18n.t("scada.statics.traffic.chart.validRead"),
                            type: "bar",
                            data: readCountData,
                            itemStyle: {
                                color: "#52c41a"
                            }
                        },
                        {
                            name: i18n.t("scada.statics.traffic.chart.invalidRead"),
                            type: "bar",
                            data: noReadCountData,
                            itemStyle: {
                                color: "#f5222d"
                            }
                        }
                    ]
                }
            }
        },

        // ========== 4. 单位流量柱状图 ==========
        {
            type: "card",
            className: "m-b-md",
            header: {
                title: "scada.statics.traffic.unitFlowCompare"
            },
            body: {
                type: "chart",
                height: 350,
                config: {
                    tooltip: {
                        trigger: "axis",
                        formatter: `{b}<br/>{a}: {c} ${i18n.t("scada.statics.traffic.chart.unitFlowUnit")}`
                    },
                    grid: {
                        left: "3%",
                        right: "4%",
                        bottom: "3%",
                        containLabel: true
                    },
                    xAxis: {
                        type: "category",
                        data: scannerLabels,
                        axisLabel: {
                            rotate: 30
                        }
                    },
                    yAxis: {
                        type: "value",
                        name: i18n.t("scada.statics.traffic.chart.unitFlowUnit"),
                        axisLabel: {
                            formatter: "{value}"
                        }
                    },
                    series: [
                        {
                            name: i18n.t("scada.statics.traffic.chart.unitFlow"),
                            type: "bar",
                            data: [7.21, 1.17, 7.63, 6.04, 8.75, 8.13, 7.00, 5.50, 8.25, 6.46, 5.92, 7.83],
                            itemStyle: {
                                color: {
                                    type: "linear",
                                    x: 0, y: 0, x2: 0, y2: 1,
                                    colorStops: [
                                        { offset: 0, color: "#1890ff" },
                                        { offset: 1, color: "#096dd9" }
                                    ]
                                }
                            },
                            label: {
                                show: true,
                                position: "top",
                                formatter: "{c}"
                            }
                        }
                    ]
                }
            }
        },

        // ========== 5. CRUD 数据明细表格 ==========
        {
            type: "crud",
            name: "trafficCrud",
            syncLocation: false,
            api: {
                ...api_crud_search
            },
            defaultParams: {
                searchIdentity: searchIdentity,
                showColumns: crudColumns
            },
            columns: crudColumns,
            columnsTogglable: false,
            headerToolbar: [
                {
                    type: "export-excel"
                },
                {
                    type: "reload"
                }
            ],
            footerToolbar: [
                "statistics",
                {
                    type: "pagination",
                    layout: "total, perPage, pager, goPage",
                    perPage: 10,
                    perPageAvailable: [10, 20, 50, 100],
                    showPageInput: true
                }
            ],
            features: ["create", "update", "delete", "bulkDelete"]
        }
    ]
};

export default schema2component(schema);
