import schema2component from "@/utils/schema2component";
import { api_crud_search } from "@/pages/constantApi";
import {
    inspection_plan_create,
    inspection_plan_delete,
    inspection_plan_import,
    inspection_plan_calendar,
    inspection_record_create,
    inspection_record_delete
} from "@/pages/scada/constants/api_constant";
import i18n from "i18next";

// ===== 巡检计划 =====
const planFormBody = [
    {
        type: "hidden",
        name: "id"
    },
    {
        label: "scada.maintenance.inspection.planName",
        type: "input-text",
        name: "planName",
        required: true
    },
    {
        label: "scada.maintenance.inspection.planType",
        type: "select",
        name: "planType",
        required: true,
        options: [
            { label: "scada.maintenance.inspection.dailyInspection", value: "日常巡检" },
            { label: "scada.maintenance.inspection.periodicMaintenance", value: "周期保养" },
            { label: "scada.maintenance.inspection.annualMaintenance", value: "年度维护" }
        ]
    },
    {
        label: "scada.maintenance.inspection.deviceNo",
        type: "input-text",
        name: "deviceNo",
        required: true
    },
    {
        label: "scada.maintenance.inspection.deviceName",
        type: "input-text",
        name: "deviceName",
        required: true
    },
    {
        label: "scada.maintenance.inspection.cronExpression",
        type: "input-text",
        name: "cronExpression",
        required: true,
        placeholder: "scada.maintenance.inspection.cronPlaceholder"
    },
    {
        label: "scada.maintenance.inspection.estimatedHours",
        type: "input-number",
        name: "estimatedHours",
        min: 0
    },
    {
        label: "scada.maintenance.inspection.assignee",
        type: "input-text",
        name: "assignee",
        required: true
    },
    {
        label: "scada.maintenance.inspection.inspectionContent",
        type: "textarea",
        name: "inspectionContent",
        required: true,
        minRows: 3
    },
    {
        label: "common.status",
        type: "select",
        name: "status",
        required: true,
        options: [
            { label: "scada.maintenance.inspection.statusEnabled", value: "启用" },
            { label: "scada.maintenance.inspection.statusDisabled", value: "停用" }
        ]
    },
    {
        label: "common.remark",
        type: "textarea",
        name: "remark"
    }
];

const planColumns = [
    {
        name: "id",
        label: "ID",
        hidden: true
    },
    {
        name: "planName",
        label: "scada.maintenance.inspection.planName",
        searchable: true
    },
    {
        name: "planType",
        label: "scada.maintenance.inspection.planType",
        searchable: {
            type: "select",
            options: [
                { label: "scada.maintenance.inspection.dailyInspection", value: "日常巡检" },
                { label: "scada.maintenance.inspection.periodicMaintenance", value: "周期保养" },
                { label: "scada.maintenance.inspection.annualMaintenance", value: "年度维护" }
            ]
        }
    },
    {
        name: "deviceNo",
        label: "scada.maintenance.inspection.deviceNo",
        searchable: true
    },
    {
        name: "deviceName",
        label: "scada.maintenance.inspection.deviceName"
    },
    {
        name: "cronExpression",
        label: "scada.maintenance.inspection.cronExpression"
    },
    {
        name: "estimatedHours",
        label: "scada.maintenance.inspection.estimatedHours"
    },
    {
        name: "assignee",
        label: "scada.maintenance.inspection.assignee",
        searchable: true
    },
    {
        name: "status",
        label: "common.status",
        type: "tpl",
        tpl: "<span class='label label-${status === \"启用\" ? \"success\" : \"default\"}'>${status}</span>"
    }
];

// ===== 巡检记录 =====
const recordFormBody = [
    {
        type: "hidden",
        name: "id"
    },
    {
        label: "scada.maintenance.inspection.relatedPlan",
        type: "input-text",
        name: "planName",
        required: true
    },
    {
        label: "scada.maintenance.inspection.deviceNo",
        type: "input-text",
        name: "deviceNo",
        required: true
    },
    {
        label: "scada.maintenance.inspection.inspector",
        type: "input-text",
        name: "inspector",
        required: true
    },
    {
        label: "scada.maintenance.inspection.inspectionTime",
        type: "input-datetime",
        name: "inspectionTime",
        required: true,
        format: "YYYY-MM-DD HH:mm:ss",
        inputFormat: "YYYY-MM-DD HH:mm:ss"
    },
    {
        label: "scada.maintenance.inspection.result",
        type: "select",
        name: "result",
        required: true,
        options: [
            { label: "scada.maintenance.inspection.resultNormal", value: "正常" },
            { label: "scada.maintenance.inspection.resultAbnormal", value: "异常" },
            { label: "scada.maintenance.inspection.resultPending", value: "待处理" }
        ]
    },
    {
        label: "scada.maintenance.inspection.abnormalDesc",
        type: "textarea",
        name: "abnormalDesc",
        visibleOn: "result === '异常'",
        required: true
    },
    {
        label: "scada.maintenance.inspection.handleMethod",
        type: "textarea",
        name: "handleMethod",
        visibleOn: "result === '异常'"
    },
    {
        label: "scada.maintenance.inspection.siteImages",
        type: "input-image",
        name: "images",
        multiple: true,
        maxLength: 5,
        maxSize: 5242880,
        accept: ".png,.jpg,.jpeg"
    },
    {
        label: "common.remark",
        type: "textarea",
        name: "remark"
    }
];

const recordColumns = [
    {
        name: "id",
        label: "ID",
        hidden: true
    },
    {
        name: "planName",
        label: "scada.maintenance.inspection.relatedPlan",
        searchable: true
    },
    {
        name: "deviceNo",
        label: "scada.maintenance.inspection.deviceNo",
        searchable: true
    },
    {
        name: "inspector",
        label: "scada.maintenance.inspection.inspector",
        searchable: true
    },
    {
        name: "inspectionTime",
        label: "scada.maintenance.inspection.inspectionTime",
        type: "datetime",
        format: "YYYY-MM-DD HH:mm:ss",
        sortable: true
    },
    {
        name: "result",
        label: "scada.maintenance.inspection.result",
        type: "tpl",
        tpl: "<span class='label label-${result === \"正常\" ? \"success\" : result === \"异常\" ? \"danger\" : \"warning\"}'>${result}</span>",
        searchable: {
            type: "select",
            options: [
                { label: "scada.maintenance.inspection.resultNormal", value: "正常" },
                { label: "scada.maintenance.inspection.resultAbnormal", value: "异常" },
                { label: "scada.maintenance.inspection.resultPending", value: "待处理" }
            ]
        }
    },
    {
        name: "abnormalDesc",
        label: "scada.maintenance.inspection.abnormalDesc"
    },
    {
        name: "handleMethod",
        label: "scada.maintenance.inspection.handleMethod"
    }
];

const schema = {
    type: "page",
    title: "scada.maintenance.inspection.pageTitle",
    body: [
        {
            type: "tabs",
            tabs: [
                {
                    title: "scada.maintenance.inspection.planTab",
                    body: [
                        {
                            type: "crud",
                            syncLocation: false,
                            name: "InspectionPlanTable",
                            api: api_crud_search,
                            defaultParams: {
                                searchIdentity: "MInspectionPlan",
                                showColumns: planColumns,
                                searchObject: {
                                    orderBy: "update_time desc"
                                }
                            },
                            autoGenerateFilter: {
                                columnsNum: 3,
                                showBtnToolbar: true
                            },
                            columns: [
                                ...planColumns,
                                {
                                    type: "operation",
                                    label: "common.operation",
                                    width: 280,
                                    buttons: [
                                        {
                                            label: "button.modify",
                                            type: "button",
                                            actionType: "drawer",
                                            drawer: {
                                                title: "scada.maintenance.inspection.editPlan",
                                                closeOnEsc: true,
                                                closeOnOutside: true,
                                                body: {
                                                    type: "form",
                                                    api: inspection_plan_create,
                                                    body: planFormBody
                                                }
                                            }
                                        },
                                        {
                                            label: "scada.maintenance.inspection.viewRecords",
                                            type: "button",
                                            actionType: "dialog",
                                            dialog: {
                                                title: "${scada.maintenance.inspection.recordTab | t} - ${planName}",
                                                size: "lg",
                                                body: {
                                                    type: "crud",
                                                    syncLocation: false,
                                                    api: api_crud_search,
                                                    defaultParams: {
                                                        searchIdentity: "MInspectionRecord",
                                                        showColumns: recordColumns,
                                                        searchObject: {
                                                            orderBy: "inspection_time desc",
                                                            "planName": "${planName}"
                                                        }
                                                    },
                                                    columns: recordColumns
                                                }
                                            }
                                        },
                                        {
                                            label: "button.delete",
                                            type: "button",
                                            actionType: "ajax",
                                            level: "danger",
                                            confirmText: "scada.maintenance.inspection.confirmDeletePlan",
                                            confirmTitle: "common.deleteConfirmTitle",
                                            api: inspection_plan_delete,
                                            reload: "InspectionPlanTable"
                                        }
                                    ],
                                    toggled: true
                                }
                            ],
                            headerToolbar: [
                                {
                                    type: "button",
                                    label: "scada.maintenance.inspection.addPlan",
                                    actionType: "drawer",
                                    drawer: {
                                        title: "scada.maintenance.inspection.addPlanDrawer",
                                        body: {
                                            type: "form",
                                            api: inspection_plan_create,
                                            body: planFormBody
                                        }
                                    }
                                },
                                {
                                    type: "button",
                                    label: "scada.maintenance.inspection.importPlan",
                                    actionType: "dialog",
                                    dialog: {
                                        title: "scada.maintenance.inspection.importPlanDialog",
                                        body: {
                                            type: "form",
                                            api: inspection_plan_import,
                                            body: [
                                                {
                                                    type: "input-file",
                                                    name: "file",
                                                    label: "scada.maintenance.inspection.selectExcelFile",
                                                    accept: ".xlsx,.xls",
                                                    required: true,
                                                    description: "scada.maintenance.inspection.fileDescription"
                                                }
                                            ]
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
                    title: "scada.maintenance.inspection.recordTab",
                    body: [
                        {
                            type: "crud",
                            syncLocation: false,
                            name: "InspectionRecordTable",
                            api: api_crud_search,
                            defaultParams: {
                                searchIdentity: "MInspectionRecord",
                                showColumns: recordColumns,
                                searchObject: {
                                    orderBy: "inspection_time desc"
                                }
                            },
                            autoGenerateFilter: {
                                columnsNum: 3,
                                showBtnToolbar: true
                            },
                            columns: [
                                ...recordColumns,
                                {
                                    type: "operation",
                                    label: "common.operation",
                                    width: 280,
                                    buttons: [
                                        {
                                            label: "button.modify",
                                            type: "button",
                                            actionType: "drawer",
                                            drawer: {
                                                title: "scada.maintenance.inspection.editRecord",
                                                closeOnEsc: true,
                                                closeOnOutside: true,
                                                body: {
                                                    type: "form",
                                                    api: inspection_record_create,
                                                    body: recordFormBody
                                                }
                                            }
                                        },
                                        {
                                            label: "scada.maintenance.inspection.viewImages",
                                            type: "button",
                                            actionType: "dialog",
                                            visibleOn: "images",
                                            dialog: {
                                                title: "scada.maintenance.inspection.siteImages",
                                                body: {
                                                    type: "images",
                                                    name: "images",
                                                    enlargeAble: true
                                                }
                                            }
                                        },
                                        {
                                            label: "button.delete",
                                            type: "button",
                                            actionType: "ajax",
                                            level: "danger",
                                            confirmText: "scada.maintenance.inspection.confirmDeleteRecord",
                                            confirmTitle: "common.deleteConfirmTitle",
                                            api: inspection_record_delete,
                                            reload: "InspectionRecordTable"
                                        }
                                    ],
                                    toggled: true
                                }
                            ],
                            headerToolbar: [
                                {
                                    type: "button",
                                    label: "scada.maintenance.inspection.addRecord",
                                    actionType: "drawer",
                                    drawer: {
                                        title: "scada.maintenance.inspection.addRecordDrawer",
                                        body: {
                                            type: "form",
                                            api: inspection_record_create,
                                            body: recordFormBody
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
                    title: "scada.maintenance.inspection.calendarTab",
                    body: [
                        {
                            type: "form",
                            title: "",
                            mode: "horizontal",
                            className: "m-b-md",
                            target: "calendarService",
                            body: [
                                {
                                    type: "input-month",
                                    name: "month",
                                    label: "scada.maintenance.inspection.selectMonth",
                                    format: "YYYY-MM",
                                    inputFormat: "YYYY-MM",
                                    value: "${REPLACE_WITH_CURRENT_MONTH}"
                                }
                            ],
                            actions: [
                                {
                                    type: "button",
                                    label: "scada.maintenance.inspection.query",
                                    actionType: "submit",
                                    level: "primary"
                                }
                            ]
                        },
                        {
                            type: "service",
                            name: "calendarService",
                            api: inspection_plan_calendar,
                            body: [
                                {
                                    type: "custom",
                                    html: "<div id='inspection-calendar' style='width:100%;min-height:500px;'></div>",
                                    onMount: (dom: HTMLElement, data: any) => {
                                        const container = dom.querySelector("#inspection-calendar");
                                        if (!container) return;

                                        const t = i18n.t.bind(i18n);
                                        const plans = data?.items || [];
                                        const now = new Date();
                                        const year = now.getFullYear();
                                        const month = now.getMonth();
                                        const firstDay = new Date(year, month, 1).getDay();
                                        const daysInMonth = new Date(year, month + 1, 0).getDate();
                                        const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

                                        let html = `<div style="text-align:center;margin-bottom:16px;">`;
                                        html += `<h2 style="font-size:20px;color:#333;">${year}年${monthNames[month]}</h2>`;
                                        html += `</div>`;

                                        html += `<table style="width:100%;border-collapse:collapse;table-layout:fixed;">`;
                                        html += `<thead><tr>`;
                                        const weekDays = [
                                            t("scada.maintenance.inspection.calendarSun"),
                                            t("scada.maintenance.inspection.calendarMon"),
                                            t("scada.maintenance.inspection.calendarTue"),
                                            t("scada.maintenance.inspection.calendarWed"),
                                            t("scada.maintenance.inspection.calendarThu"),
                                            t("scada.maintenance.inspection.calendarFri"),
                                            t("scada.maintenance.inspection.calendarSat")
                                        ];
                                        weekDays.forEach(day => {
                                            html += `<th style="padding:8px;text-align:center;border:1px solid #e8e8e8;background:#fafafa;font-weight:600;">${day}</th>`;
                                        });
                                        html += `</tr></thead><tbody><tr>`;

                                        // Empty cells before first day
                                        for (let i = 0; i < firstDay; i++) {
                                            html += `<td style="padding:8px;border:1px solid #e8e8e8;height:80px;vertical-align:top;background:#f5f5f5;"></td>`;
                                        }

                                        const planTypeLabels: Record<string, string> = {
                                            "日常巡检": t("scada.maintenance.inspection.dailyInspection"),
                                            "周期保养": t("scada.maintenance.inspection.periodicMaintenance"),
                                            "年度维护": t("scada.maintenance.inspection.annualMaintenance")
                                        };

                                        for (let d = 1; d <= daysInMonth; d++) {
                                            const dayOfWeek = (firstDay + d - 1) % 7;
                                            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                                            const dayPlans = plans.filter((p: any) => p.date === dateStr);
                                            const isToday = d === now.getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

                                            html += `<td style="padding:4px;border:1px solid #e8e8e8;height:80px;vertical-align:top;${isToday ? "background:#e6f7ff;" : ""}">`;
                                            html += `<div style="font-weight:${isToday ? "bold" : "normal"};color:${isToday ? "#1890ff" : "#333"};margin-bottom:4px;">${d}</div>`;

                                            dayPlans.forEach((p: any) => {
                                                const color = p.planType === "日常巡检" ? "#52c41a" : p.planType === "周期保养" ? "#1890ff" : "#faad14";
                                                html += `<div style="background:${color};color:#fff;font-size:11px;padding:1px 4px;border-radius:2px;margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${p.planName}">${p.planName}</div>`;
                                            });

                                            html += `</td>`;

                                            if (dayOfWeek === 6 && d < daysInMonth) {
                                                html += `</tr><tr>`;
                                            }
                                        }

                                        // Fill remaining cells
                                        const lastDayOfWeek = (firstDay + daysInMonth - 1) % 7;
                                        for (let i = lastDayOfWeek + 1; i < 7; i++) {
                                            html += `<td style="padding:8px;border:1px solid #e8e8e8;height:80px;vertical-align:top;background:#f5f5f5;"></td>`;
                                        }

                                        html += `</tr></tbody></table>`;

                                        // Legend
                                        html += `<div style="margin-top:12px;display:flex;gap:16px;">`;
                                        html += `<span><span style="display:inline-block;width:12px;height:12px;border-radius:2px;background:#52c41a;margin-right:4px;vertical-align:middle;"></span>${planTypeLabels["日常巡检"]}</span>`;
                                        html += `<span><span style="display:inline-block;width:12px;height:12px;border-radius:2px;background:#1890ff;margin-right:4px;vertical-align:middle;"></span>${planTypeLabels["周期保养"]}</span>`;
                                        html += `<span><span style="display:inline-block;width:12px;height:12px;border-radius:2px;background:#faad14;margin-right:4px;vertical-align:middle;"></span>${planTypeLabels["年度维护"]}</span>`;
                                        html += `</div>`;

                                        container.innerHTML = html;
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
