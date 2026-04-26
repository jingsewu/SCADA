import schema2component from "@/utils/schema2component";

const MOCK_METERS = [
    {
        id: 1,
        meterNo: "MT001",
        meterName: "1号配电室主表",
        meterType: "三相电表",
        cabinetNo: "CAB-01",
        location: "配电室1层",
        ratedVoltage: 380,
        ratedCurrent: 630,
        status: "正常",
        installDate: "2023-03-15",
        remark: "主进线电表"
    },
    {
        id: 2,
        meterNo: "MT002",
        meterName: "车间A动力表",
        meterType: "三相电表",
        cabinetNo: "CAB-01",
        location: "车间A配电箱",
        ratedVoltage: 380,
        ratedCurrent: 200,
        status: "正常",
        installDate: "2023-05-20",
        remark: "车间A主动力回路"
    },
    {
        id: 3,
        meterNo: "MT003",
        meterName: "厂区照明总表",
        meterType: "单相电表",
        cabinetNo: "CAB-02",
        location: "楼道北侧配电箱",
        ratedVoltage: 220,
        ratedCurrent: 100,
        status: "正常",
        installDate: "2023-08-10",
        remark: "厂区公共照明"
    },
    {
        id: 4,
        meterNo: "MT004",
        meterName: "车间B动力表",
        meterType: "三相电表",
        cabinetNo: "CAB-02",
        location: "车间B配电箱",
        ratedVoltage: 380,
        ratedCurrent: 200,
        status: "正常",
        installDate: "2023-09-01",
        remark: "车间B主动力回路"
    },
    {
        id: 5,
        meterNo: "MT005",
        meterName: "空调系统电表",
        meterType: "三相电表",
        cabinetNo: "CAB-03",
        location: "机房2层",
        ratedVoltage: 380,
        ratedCurrent: 100,
        status: "异常",
        installDate: "2024-01-08",
        remark: "中央空调系统专用"
    },
    {
        id: 6,
        meterNo: "MT006",
        meterName: "仓储区照明表",
        meterType: "单相电表",
        cabinetNo: "CAB-03",
        location: "仓储区入口",
        ratedVoltage: 220,
        ratedCurrent: 100,
        status: "离线",
        installDate: "2024-06-20",
        remark: "仓储区照明回路"
    }
];

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
        label: "scada.monitor.meterManagement.meterNo"
    },
    {
        name: "meterName",
        label: "scada.monitor.meterManagement.meterName"
    },
    {
        name: "meterType",
        label: "scada.monitor.meterManagement.meterType"
    },
    {
        name: "cabinetNo",
        label: "scada.monitor.meterManagement.cabinetNo"
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

const schema = {
    type: "page",
    title: "scada.monitor.meterManagement.title",
    data: {
        mockMeters: MOCK_METERS
    },
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
                            source: "$mockMeters",
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
                                            api: {
                                                url: "post:/scada/meter/delete/${id}",
                                                adaptor: () => ({ status: 0, msg: "删除成功", data: {} })
                                            }
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
                            body: [
                                {
                                    type: "select",
                                    name: "cabinetNo",
                                    label: "scada.monitor.meterManagement.cabinet",
                                    clearable: true,
                                    options: [
                                        { label: "CAB-01", value: "CAB-01" },
                                        { label: "CAB-02", value: "CAB-02" },
                                        { label: "CAB-03", value: "CAB-03" }
                                    ]
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
                                            tpl: "<div class='text-center'><h1 class='text-info'>128.6 KW</h1></div>"
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
                                            tpl: "<div class='text-center'><h1 class='text-danger'>342 A</h1></div>"
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
                                            tpl: "<div class='text-center'><h1 class='text-success'>379.2 V</h1></div>"
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
                                            tpl: "<div class='text-center'><h1 class='text-warning'>6</h1></div>"
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
                                                data: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"]
                                            },
                                            yAxis: { type: "value", name: "${scada.monitor.meterManagement.currentUnit | t}" },
                                            series: [
                                                {
                                                    name: "${scada.monitor.meterManagement.phaseACurrent | t}",
                                                    type: "line",
                                                    smooth: true,
                                                    data: [312, 298, 325, 340, 318, 305, 322, 335, 328, 315, 308, 296]
                                                },
                                                {
                                                    name: "${scada.monitor.meterManagement.phaseBCurrent | t}",
                                                    type: "line",
                                                    smooth: true,
                                                    data: [285, 272, 295, 310, 288, 276, 292, 305, 298, 283, 275, 265]
                                                },
                                                {
                                                    name: "${scada.monitor.meterManagement.phaseCCurrent | t}",
                                                    type: "line",
                                                    smooth: true,
                                                    data: [298, 284, 308, 322, 301, 289, 306, 318, 312, 298, 290, 278]
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
                                                data: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"]
                                            },
                                            yAxis: { type: "value", name: "${scada.monitor.meterManagement.powerUnit | t}" },
                                            series: [
                                                {
                                                    name: "${scada.monitor.meterManagement.activePower | t}",
                                                    type: "line",
                                                    smooth: true,
                                                    areaStyle: {},
                                                    data: [118, 112, 124, 135, 121, 115, 128, 138, 132, 119, 113, 107]
                                                },
                                                {
                                                    name: "${scada.monitor.meterManagement.reactivePower | t}",
                                                    type: "line",
                                                    smooth: true,
                                                    areaStyle: {},
                                                    data: [38, 35, 42, 49, 40, 36, 44, 48, 45, 39, 36, 32]
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
