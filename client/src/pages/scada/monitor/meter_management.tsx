import schema2component from "@/utils/schema2component";
import { api_crud_search } from "@/pages/constantApi";
import { meter_create, meter_delete, meter_power_data } from "@/pages/scada/constants/api_constant";

const formBody = [
    {
        type: "hidden",
        name: "id"
    },
    {
        label: "scada.monitor.meterManagement.meterNo",
        type: "input-text",
        name: "meterNo",
        required: true
    },
    {
        label: "scada.monitor.meterManagement.meterName",
        type: "input-text",
        name: "meterName",
        required: true
    },
    {
        label: "scada.monitor.meterManagement.meterType",
        type: "select",
        name: "meterType",
        required: true,
        options: [
            { label: "scada.monitor.meterManagement.singlePhase", value: "单相电表" },
            { label: "scada.monitor.meterManagement.threePhase", value: "三相电表" }
        ]
    },
    {
        label: "scada.monitor.meterManagement.cabinetNo",
        type: "input-text",
        name: "cabinetNo",
        required: true
    },
    {
        label: "scada.monitor.meterManagement.location",
        type: "input-text",
        name: "location",
        required: true
    },
    {
        label: "scada.monitor.meterManagement.ratedVoltage",
        type: "input-number",
        name: "ratedVoltage"
    },
    {
        label: "scada.monitor.meterManagement.ratedCurrent",
        type: "input-number",
        name: "ratedCurrent"
    },
    {
        label: "common.status",
        type: "select",
        name: "status",
        required: true,
        options: [
            { label: "scada.monitor.meterManagement.statusNormal", value: "正常" },
            { label: "scada.monitor.meterManagement.statusAbnormal", value: "异常" },
            { label: "scada.monitor.meterManagement.statusOffline", value: "离线" }
        ]
    },
    {
        label: "scada.monitor.meterManagement.installDate",
        type: "input-date",
        name: "installDate",
        format: "YYYY-MM-DD"
    },
    {
        label: "common.remark",
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
        label: "scada.monitor.meterManagement.meterNo",
        searchable: true
    },
    {
        name: "meterName",
        label: "scada.monitor.meterManagement.meterName",
        searchable: true
    },
    {
        name: "meterType",
        label: "scada.monitor.meterManagement.meterType",
        searchable: {
            type: "select",
            options: [
                { label: "scada.monitor.meterManagement.singlePhase", value: "单相电表" },
                { label: "scada.monitor.meterManagement.threePhase", value: "三相电表" }
            ]
        }
    },
    {
        name: "cabinetNo",
        label: "scada.monitor.meterManagement.cabinetNo",
        searchable: true
    },
    {
        name: "location",
        label: "scada.monitor.meterManagement.location"
    },
    {
        name: "ratedVoltage",
        label: "scada.monitor.meterManagement.ratedVoltage"
    },
    {
        name: "ratedCurrent",
        label: "scada.monitor.meterManagement.ratedCurrent"
    },
    {
        name: "status",
        label: "common.status",
        type: "tpl",
        tpl: "<span class='label label-${status === \"正常\" ? \"success\" : status === \"异常\" ? \"danger\" : \"default\"}'>${status}</span>"
    },
    {
        name: "installDate",
        label: "scada.monitor.meterManagement.installDate"
    },
    {
        name: "remark",
        label: "common.remark"
    }
];

const searchIdentity = "MMeter";

const schema = {
    type: "page",
    title: "scada.monitor.meterManagement.title",
    body: [
        {
            type: "tabs",
            tabs: [
                {
                    title: "scada.monitor.meterManagement.meterList",
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
                                    label: "common.operation",
                                    width: 230,
                                    buttons: [
                                        {
                                            label: "button.modify",
                                            type: "button",
                                            actionType: "drawer",
                                            drawer: {
                                                title: "scada.monitor.meterManagement.editMeter",
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
                                            label: "button.delete",
                                            type: "button",
                                            actionType: "ajax",
                                            level: "danger",
                                            confirmText: "scada.monitor.meterManagement.confirmDelete",
                                            confirmTitle: "common.deleteConfirmTitle",
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
                                    label: "scada.monitor.meterManagement.addMeter",
                                    actionType: "drawer",
                                    drawer: {
                                        title: "scada.monitor.meterManagement.addMeter",
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
                    title: "scada.monitor.meterManagement.powerDataStats",
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
                                    label: "scada.monitor.meterManagement.cabinet",
                                    clearable: true,
                                    source: {
                                        method: "post",
                                        url: "/search/search?page=1&perPage=100",
                                        data: {
                                            searchIdentity: searchIdentity,
                                            showColumns: [{ name: "cabinetNo", label: "scada.monitor.meterManagement.cabinetNo" }]
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
                                    label: "scada.monitor.meterManagement.queryTime",
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
                                        header: { title: "scada.monitor.meterManagement.currentTotalPower" },
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
                                        header: { title: "scada.monitor.meterManagement.maxCurrent" },
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
                                        header: { title: "scada.monitor.meterManagement.avgVoltage" },
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
                                        header: { title: "scada.monitor.meterManagement.totalMeters" },
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
                                            title: { text: "${scada.monitor.meterManagement.currentTrend | t}" },
                                            tooltip: { trigger: "axis" },
                                            legend: { data: ["${scada.monitor.meterManagement.phaseACurrent | t}", "${scada.monitor.meterManagement.phaseBCurrent | t}", "${scada.monitor.meterManagement.phaseCCurrent | t}"] },
                                            xAxis: {
                                                type: "category",
                                                data: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"]
                                            },
                                            yAxis: { type: "value", name: "${scada.monitor.meterManagement.currentUnit | t}" },
                                            series: [
                                                {
                                                    name: "${scada.monitor.meterManagement.phaseACurrent | t}",
                                                    type: "line",
                                                    smooth: true,
                                                    data: [100, 98, 95, 97, 105, 108, 106, 104, 107, 103, 99, 96]
                                                },
                                                {
                                                    name: "${scada.monitor.meterManagement.phaseBCurrent | t}",
                                                    type: "line",
                                                    smooth: true,
                                                    data: [98, 96, 93, 95, 103, 106, 104, 102, 105, 101, 97, 94]
                                                },
                                                {
                                                    name: "${scada.monitor.meterManagement.phaseCCurrent | t}",
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
                                            title: { text: "${scada.monitor.meterManagement.powerTrend | t}" },
                                            tooltip: { trigger: "axis" },
                                            legend: { data: ["${scada.monitor.meterManagement.activePower | t}", "${scada.monitor.meterManagement.reactivePower | t}"] },
                                            xAxis: {
                                                type: "category",
                                                data: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"]
                                            },
                                            yAxis: { type: "value", name: "${scada.monitor.meterManagement.powerUnit | t}" },
                                            series: [
                                                {
                                                    name: "${scada.monitor.meterManagement.activePower | t}",
                                                    type: "line",
                                                    smooth: true,
                                                    areaStyle: {},
                                                    data: [45, 42, 38, 40, 55, 62, 58, 54, 60, 52, 44, 40]
                                                },
                                                {
                                                    name: "${scada.monitor.meterManagement.reactivePower | t}",
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
