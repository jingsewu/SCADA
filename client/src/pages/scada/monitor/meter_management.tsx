import schema2component from "@/utils/schema2component";
import { api_crud_search } from "@/pages/constantApi";
import { meter_create, meter_delete, meter_power_data } from "@/pages/scada/constants/api_constant";

const formBody = [
    {
        type: "hidden",
        name: "id"
    },
    {
        label: "电表编号",
        type: "input-text",
        name: "meterNo",
        required: true
    },
    {
        label: "电表名称",
        type: "input-text",
        name: "meterName",
        required: true
    },
    {
        label: "电表类型",
        type: "select",
        name: "meterType",
        required: true,
        options: ["单相电表", "三相电表"]
    },
    {
        label: "所属电柜",
        type: "input-text",
        name: "cabinetNo",
        required: true
    },
    {
        label: "安装位置",
        type: "input-text",
        name: "location",
        required: true
    },
    {
        label: "额定电压(V)",
        type: "input-number",
        name: "ratedVoltage"
    },
    {
        label: "额定电流(A)",
        type: "input-number",
        name: "ratedCurrent"
    },
    {
        label: "状态",
        type: "select",
        name: "status",
        required: true,
        options: ["正常", "异常", "离线"]
    },
    {
        label: "安装日期",
        type: "input-date",
        name: "installDate",
        format: "YYYY-MM-DD"
    },
    {
        label: "备注",
        type: "textarea",
        name: "remark"
    }
];

const crudColumns = [
    {
        name: "id",
        label: "ID",
        hidden: true
    },
    {
        name: "meterNo",
        label: "电表编号",
        searchable: true
    },
    {
        name: "meterName",
        label: "电表名称",
        searchable: true
    },
    {
        name: "meterType",
        label: "电表类型",
        searchable: {
            type: "select",
            options: ["单相电表", "三相电表"]
        }
    },
    {
        name: "cabinetNo",
        label: "所属电柜",
        searchable: true
    },
    {
        name: "location",
        label: "安装位置"
    },
    {
        name: "ratedVoltage",
        label: "额定电压(V)"
    },
    {
        name: "ratedCurrent",
        label: "额定电流(A)"
    },
    {
        name: "status",
        label: "状态",
        type: "tpl",
        tpl: "<span class='label label-${status === \"正常\" ? \"success\" : status === \"异常\" ? \"danger\" : \"default\"}'>${status}</span>"
    },
    {
        name: "installDate",
        label: "安装日期"
    },
    {
        name: "remark",
        label: "备注"
    }
];

const searchIdentity = "MMeter";

const schema = {
    type: "page",
    title: "电表管理",
    body: [
        {
            type: "tabs",
            tabs: [
                {
                    title: "电表列表",
                    body: [
                        {
                            type: "crud",
                            syncLocation: false,
                            name: "MeterTable",
                            api: api_crud_search,
                            defaultParams: {
                                searchIdentity: searchIdentity,
                                showColumns: crudColumns,
                                searchObject: {
                                    orderBy: "update_time desc"
                                }
                            },
                            autoGenerateFilter: {
                                columnsNum: 3,
                                showBtnToolbar: true
                            },
                            columns: [
                                ...crudColumns,
                                {
                                    type: "operation",
                                    label: "操作",
                                    width: 230,
                                    buttons: [
                                        {
                                            label: "修改",
                                            type: "button",
                                            actionType: "drawer",
                                            drawer: {
                                                title: "修改电表信息",
                                                closeOnEsc: true,
                                                closeOnOutside: true,
                                                body: {
                                                    type: "form",
                                                    api: meter_create,
                                                    body: formBody
                                                }
                                            }
                                        },
                                        {
                                            label: "删除",
                                            type: "button",
                                            actionType: "ajax",
                                            level: "danger",
                                            confirmText: "确定要删除该电表吗？",
                                            confirmTitle: "删除确认",
                                            api: meter_delete,
                                            reload: "MeterTable"
                                        }
                                    ],
                                    toggled: true
                                }
                            ],
                            headerToolbar: [
                                {
                                    type: "button",
                                    label: "新增电表",
                                    actionType: "drawer",
                                    drawer: {
                                        title: "新增电表",
                                        body: {
                                            type: "form",
                                            api: meter_create,
                                            body: formBody
                                        }
                                    }
                                },
                                "export-excel",
                                "reload"
                            ]
                        }
                    ]
                },
                {
                    title: "电力数据统计",
                    body: [
                        {
                            type: "form",
                            title: "",
                            mode: "horizontal",
                            className: "m-b-md",
                            target: "powerDataChart",
                            body: [
                                {
                                    type: "select",
                                    name: "cabinetNo",
                                    label: "电柜",
                                    clearable: true,
                                    source: {
                                        method: "post",
                                        url: "/search/search?page=1&perPage=100",
                                        data: {
                                            searchIdentity: searchIdentity,
                                            showColumns: [{ name: "cabinetNo", label: "所属电柜" }]
                                        },
                                        adaptor: (payload: any) => ({
                                            options: (payload?.data?.items || []).map((item: any) => ({
                                                label: item.cabinetNo,
                                                value: item.cabinetNo
                                            }))
                                        })
                                    }
                                },
                                {
                                    type: "input-datetime-range",
                                    name: "queryTime",
                                    label: "查询时间",
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
                                        header: { title: "当前总功率" },
                                        body: {
                                            type: "tpl",
                                            tpl: "<div class='text-center'><h1 class='text-info'>-- KW</h1></div>"
                                        }
                                    }
                                },
                                {
                                    md: 3,
                                    body: {
                                        type: "card",
                                        header: { title: "最高电流" },
                                        body: {
                                            type: "tpl",
                                            tpl: "<div class='text-center'><h1 class='text-danger'>-- A</h1></div>"
                                        }
                                    }
                                },
                                {
                                    md: 3,
                                    body: {
                                        type: "card",
                                        header: { title: "平均电压" },
                                        body: {
                                            type: "tpl",
                                            tpl: "<div class='text-center'><h1 class='text-success'>-- V</h1></div>"
                                        }
                                    }
                                },
                                {
                                    md: 3,
                                    body: {
                                        type: "card",
                                        header: { title: "电表总数" },
                                        body: {
                                            type: "tpl",
                                            tpl: "<div class='text-center'><h1 class='text-warning'>--</h1></div>"
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            type: "grid",
                            columns: [
                                {
                                    md: 6,
                                    body: {
                                        type: "chart",
                                        name: "powerDataChart",
                                        config: {
                                            title: { text: "电流趋势 (A)" },
                                            tooltip: { trigger: "axis" },
                                            legend: { data: ["A相电流", "B相电流", "C相电流"] },
                                            xAxis: {
                                                type: "category",
                                                data: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"]
                                            },
                                            yAxis: { type: "value", name: "电流(A)" },
                                            series: [
                                                {
                                                    name: "A相电流",
                                                    type: "line",
                                                    smooth: true,
                                                    data: [100, 98, 95, 97, 105, 108, 106, 104, 107, 103, 99, 96]
                                                },
                                                {
                                                    name: "B相电流",
                                                    type: "line",
                                                    smooth: true,
                                                    data: [98, 96, 93, 95, 103, 106, 104, 102, 105, 101, 97, 94]
                                                },
                                                {
                                                    name: "C相电流",
                                                    type: "line",
                                                    smooth: true,
                                                    data: [99, 97, 94, 96, 104, 107, 105, 103, 106, 102, 98, 95]
                                                }
                                            ],
                                            grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true }
                                        }
                                    }
                                },
                                {
                                    md: 6,
                                    body: {
                                        type: "chart",
                                        config: {
                                            title: { text: "功率趋势 (KW)" },
                                            tooltip: { trigger: "axis" },
                                            legend: { data: ["有功功率", "无功功率"] },
                                            xAxis: {
                                                type: "category",
                                                data: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"]
                                            },
                                            yAxis: { type: "value", name: "功率(KW)" },
                                            series: [
                                                {
                                                    name: "有功功率",
                                                    type: "line",
                                                    smooth: true,
                                                    areaStyle: {},
                                                    data: [45, 42, 38, 40, 55, 62, 58, 54, 60, 52, 44, 40]
                                                },
                                                {
                                                    name: "无功功率",
                                                    type: "line",
                                                    smooth: true,
                                                    areaStyle: {},
                                                    data: [12, 10, 8, 9, 15, 18, 16, 14, 17, 13, 11, 9]
                                                }
                                            ],
                                            grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

export default schema2component(schema);
