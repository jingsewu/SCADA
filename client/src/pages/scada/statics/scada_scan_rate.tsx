import schema2component from "@/utils/schema2component";
import { api_crud_search } from "@/pages/constantApi";

const searchIdentity = "ScanRateStatistic"; // 请根据实际情况修改

const schema = {
    type: "page",
    title: "扫码率统计",
    body: [
        {
            type: "form",
            title: "筛选条件",
            mode: "horizontal",
            wrapWithPanel: false,
            className: "m-b-md",
            body: [
                {
                    type: "select",
                    name: "plcCabinet",
                    label: "PLC柜",
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
                    label: "扫码器",
                    placeholder: "请输入扫码器"
                },
                {
                    type: "input-datetime-range",
                    name: "queryTime",
                    label: "查询时间",
                    value: "2025-03-13 00:00:00,2025-03-14 00:00:00",
                    format: "YYYY-MM-DD HH:mm:ss",
                    inputFormat: "YYYY-MM-DD HH:mm:ss"
                }
            ],
            actions: [
                {
                    type: "button",
                    label: "搜索",
                    actionType: "submit",
                    level: "primary"
                },
                {
                    type: "button",
                    label: "重置",
                    actionType: "reset"
                },
                {
                    type: "button",
                    label: "数据列表",
                    actionType: "dialog",
                    dialog: {
                        title: "扫码率数据列表",
                        size: "lg",
                        body: {
                            type: "service",
                            api: {
                                ...api_crud_search,
                                adapt: (payload:any) => ({
                                    ...payload,
                                    searchIdentity: searchIdentity
                                })
                            },
                            body: {
                                type: "table",
                                columns: [
                                    {
                                        name: "scannerNo",
                                        label: "扫码器编号"
                                    },
                                    {
                                        name: "scanRate",
                                        label: "扫码率",
                                        type: "tpl",
                                        tpl: "${scanRate}%"
                                    },
                                    {
                                        name: "totalCount",
                                        label: "总数量"
                                    },
                                    {
                                        name: "successCount",
                                        label: "成功数量"
                                    },
                                    {
                                        name: "createTime",
                                        label: "统计时间"
                                    }
                                ]
                            }
                        }
                    }
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
                            title: "平均扫码率"
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
                            title: "最高扫码率"
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
                            title: "最低扫码率"
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
                            title: "统计扫码器数"
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
                title: "扫码率统计图表"
            },
            body: {
                type: "chart",
                config: {
                    title: {
                        text: "扫码率统计"
                    },
                    tooltip: {
                        trigger: "axis",
                        formatter: "{b}<br/>{a}: {c}%"
                    },
                    legend: {
                        data: ["扫码率"]
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
                            name: "扫码率",
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
                                text: "扫码器对比"
                            },
                            tooltip: {
                                trigger: "axis"
                            },
                            legend: {
                                data: ["总数量", "成功数量"]
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
                                    name: "总数量",
                                    type: "bar",
                                    data: [10000, 9500, 10500, 9800, 10200, 9200, 9700, 9400, 9100, 9600, 10100, 9900]
                                },
                                {
                                    name: "成功数量",
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
                                text: "扫码率分布"
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
                                    name: "扫码率区间",
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
