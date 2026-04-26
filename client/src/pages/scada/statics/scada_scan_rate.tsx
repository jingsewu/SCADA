import schema2component from "@/utils/schema2component";
import i18n from "i18next";

const schema = {
    type: "page",
    title: "scada.statics.scanRate.pageTitle",
    body: [
        {
            type: "form",
            title: "scada.statics.scanRate.filterConditions",
            mode: "horizontal",
            className: "m-b-md",
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
                    placeholder: "scada.statics.scanRate.scanner.placeholder"
                },
                {
                    type: "input-datetime-range",
                    name: "queryTime",
                    label: "scada.statics.scanRate.queryTime",
                    value: "2025-03-13 00:00:00,2025-03-14 00:00:00",
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
        {
            type: "grid",
            columns: [
                {
                    md: 3,
                    body: {
                        type: "card",
                        header: {
                            title: "scada.statics.scanRate.avgScanRate"
                        },
                        body: {
                            type: "tpl",
                            tpl: "<div class='text-center'><h1 class='text-success'>99.76%</h1></div>"
                        }
                    }
                },
                {
                    md: 3,
                    body: {
                        type: "card",
                        header: {
                            title: "scada.statics.scanRate.maxScanRate"
                        },
                        body: {
                            type: "tpl",
                            tpl: "<div class='text-center'><h1 class='text-success'>99.91%</h1><p class='text-muted'>扫码器: 200</p></div>"
                        }
                    }
                },
                {
                    md: 3,
                    body: {
                        type: "card",
                        header: {
                            title: "scada.statics.scanRate.minScanRate"
                        },
                        body: {
                            type: "tpl",
                            tpl: "<div class='text-center'><h1 class='text-warning'>99.02%</h1><p class='text-muted'>扫码器: 208</p></div>"
                        }
                    }
                },
                {
                    md: 3,
                    body: {
                        type: "card",
                        header: {
                            title: "scada.statics.scanRate.scannerCount"
                        },
                        body: {
                            type: "tpl",
                            tpl: "<div class='text-center'><h1 class='text-info'>12</h1><p class='text-muted'>个扫码器</p></div>"
                        }
                    }
                }
            ]
        },
        {
            type: "card",
            header: {
                title: "scada.statics.scanRate.chart.cardTitle"
            },
            body: {
                type: "chart",
                config: {
                    title: {
                        text: i18n.t("scada.statics.scanRate.pageTitle")
                    },
                    tooltip: {
                        trigger: "axis",
                        formatter: "{b}<br/>{a}: {c}%"
                    },
                    legend: {
                        data: [i18n.t("scada.statics.scanRate.scanRate")]
                    },
                    xAxis: {
                        type: "category",
                        data: ["200", "201", "202", "203", "204", "205", "206", "207", "208", "209", "211", "212"]
                    },
                    yAxis: {
                        type: "value",
                        min: 99.0,
                        max: 100,
                        axisLabel: {
                            formatter: "{value}%"
                        }
                    },
                    series: [
                        {
                            name: i18n.t("scada.statics.scanRate.scanRate"),
                            type: "bar",
                            data: [99.91, 99.64, 99.9, 99.79, 99.89, 99.46, 99.61, 99.55, 99.02, 99.33, 99.76, 99.89],
                            itemStyle: {
                                color: "#f5222d" // 红色柱状图
                            },
                            label: {
                                show: true,
                                position: "top",
                                formatter: "{c}%"
                            }
                        }
                    ],
                    grid: {
                        left: "3%",
                        right: "4%",
                        bottom: "3%",
                        containLabel: true
                    }
                }
            }
        },
        {
            type: "grid",
            columns: [
                {
                    md: 8,
                    body: {
                        type: "chart",
                        config: {
                            title: {
                                text: i18n.t("scada.statics.scanRate.chart.scannerCompare")
                            },
                            tooltip: {
                                trigger: "axis"
                            },
                            legend: {
                                data: [
                                    i18n.t("scada.statics.scanRate.totalCount"),
                                    i18n.t("scada.statics.scanRate.successCount")
                                ]
                            },
                            xAxis: {
                                type: "category",
                                data: ["200", "201", "202", "203", "204", "205", "206", "207", "208", "209", "211", "212"]
                            },
                            yAxis: {
                                type: "value"
                            },
                            series: [
                                {
                                    name: i18n.t("scada.statics.scanRate.totalCount"),
                                    type: "bar",
                                    data: [10000, 9500, 10500, 9800, 10200, 9200, 9700, 9400, 9100, 9600, 10100, 9900]
                                },
                                {
                                    name: i18n.t("scada.statics.scanRate.successCount"),
                                    type: "bar",
                                    data: [9991, 9466, 10490, 9780, 10190, 9151, 9662, 9354, 9001, 9542, 10077, 9889]
                                }
                            ]
                        }
                    }
                },
                {
                    md: 4,
                    body: {
                        type: "chart",
                        config: {
                            title: {
                                text: i18n.t("scada.statics.scanRate.chart.distribution")
                            },
                            tooltip: {
                                trigger: "item",
                                formatter: "{a} <br/>{b}: {c} ({d}%)"
                            },
                            legend: {
                                orient: "vertical",
                                left: "left"
                            },
                            series: [
                                {
                                    name: i18n.t("scada.statics.scanRate.chart.distributionRange"),
                                    type: "pie",
                                    radius: "50%",
                                    data: [
                                        { value: 8, name: "99.8%-100%" },
                                        { value: 3, name: "99.5%-99.8%" },
                                        { value: 1, name: "99.0%-99.5%" }
                                    ],
                                    emphasis: {
                                        itemStyle: {
                                            shadowBlur: 10,
                                            shadowOffsetX: 0,
                                            shadowColor: "rgba(0, 0, 0, 0.5)"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            ]
        }
    ]
};

export default schema2component(schema);
