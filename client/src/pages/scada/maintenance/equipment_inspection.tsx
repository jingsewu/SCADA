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

// ===== 巡检计划 =====
const planFormBody = [
    {
        type: "hidden",
        name: "id"
    },
    {
        label: "计划名称",
        type: "input-text",
        name: "planName",
        required: true
    },
    {
        label: "计划类型",
        type: "select",
        name: "planType",
        required: true,
        options: ["日常巡检", "周期保养", "年度维护"]
    },
    {
        label: "关联设备编号",
        type: "input-text",
        name: "deviceNo",
        required: true
    },
    {
        label: "设备名称",
        type: "input-text",
        name: "deviceName",
        required: true
    },
    {
        label: "cron表达式",
        type: "input-text",
        name: "cronExpression",
        required: true,
        placeholder: "如: 0 0 8 ? * MON-FRI"
    },
    {
        label: "预计工时(h)",
        type: "input-number",
        name: "estimatedHours",
        min: 0
    },
    {
        label: "负责人",
        type: "input-text",
        name: "assignee",
        required: true
    },
    {
        label: "巡检内容",
        type: "textarea",
        name: "inspectionContent",
        required: true,
        minRows: 3
    },
    {
        label: "状态",
        type: "select",
        name: "status",
        required: true,
        options: ["启用", "停用"]
    },
    {
        label: "备注",
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
        label: "计划名称",
        searchable: true
    },
    {
        name: "planType",
        label: "计划类型",
        searchable: {
            type: "select",
            options: ["日常巡检", "周期保养", "年度维护"]
        }
    },
    {
        name: "deviceNo",
        label: "设备编号",
        searchable: true
    },
    {
        name: "deviceName",
        label: "设备名称"
    },
    {
        name: "cronExpression",
        label: "cron表达式"
    },
    {
        name: "estimatedHours",
        label: "预计工时(h)"
    },
    {
        name: "assignee",
        label: "负责人",
        searchable: true
    },
    {
        name: "status",
        label: "状态",
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
        label: "关联计划",
        type: "input-text",
        name: "planName",
        required: true
    },
    {
        label: "设备编号",
        type: "input-text",
        name: "deviceNo",
        required: true
    },
    {
        label: "巡检人",
        type: "input-text",
        name: "inspector",
        required: true
    },
    {
        label: "巡检时间",
        type: "input-datetime",
        name: "inspectionTime",
        required: true,
        format: "YYYY-MM-DD HH:mm:ss",
        inputFormat: "YYYY-MM-DD HH:mm:ss"
    },
    {
        label: "巡检结果",
        type: "select",
        name: "result",
        required: true,
        options: ["正常", "异常", "待处理"]
    },
    {
        label: "异常描述",
        type: "textarea",
        name: "abnormalDesc",
        visibleOn: "result === '异常'",
        required: true
    },
    {
        label: "处理方式",
        type: "textarea",
        name: "handleMethod",
        visibleOn: "result === '异常'"
    },
    {
        label: "现场图片",
        type: "input-image",
        name: "images",
        multiple: true,
        maxLength: 5,
        maxSize: 5242880,
        accept: ".png,.jpg,.jpeg"
    },
    {
        label: "备注",
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
        label: "关联计划",
        searchable: true
    },
    {
        name: "deviceNo",
        label: "设备编号",
        searchable: true
    },
    {
        name: "inspector",
        label: "巡检人",
        searchable: true
    },
    {
        name: "inspectionTime",
        label: "巡检时间",
        type: "datetime",
        format: "YYYY-MM-DD HH:mm:ss",
        sortable: true
    },
    {
        name: "result",
        label: "巡检结果",
        type: "tpl",
        tpl: "<span class='label label-${result === \"正常\" ? \"success\" : result === \"异常\" ? \"danger\" : \"warning\"}'>${result}</span>",
        searchable: {
            type: "select",
            options: ["正常", "异常", "待处理"]
        }
    },
    {
        name: "abnormalDesc",
        label: "异常描述"
    },
    {
        name: "handleMethod",
        label: "处理方式"
    }
];

const schema = {
    type: "page",
    title: "设备巡检",
    body: [
        {
            type: "tabs",
            tabs: [
                {
                    title: "巡检计划",
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
                                    label: "操作",
                                    width: 280,
                                    buttons: [
                                        {
                                            label: "修改",
                                            type: "button",
                                            actionType: "drawer",
                                            drawer: {
                                                title: "修改巡检计划",
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
                                            label: "查看记录",
                                            type: "button",
                                            actionType: "dialog",
                                            dialog: {
                                                title: "巡检记录 - ${planName}",
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
                                            label: "删除",
                                            type: "button",
                                            actionType: "ajax",
                                            level: "danger",
                                            confirmText: "确定要删除该巡检计划吗？",
                                            confirmTitle: "删除确认",
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
                                    label: "新增计划",
                                    actionType: "drawer",
                                    drawer: {
                                        title: "新增巡检计划",
                                        body: {
                                            type: "form",
                                            api: inspection_plan_create,
                                            body: planFormBody
                                        }
                                    }
                                },
                                {
                                    type: "button",
                                    label: "导入计划",
                                    actionType: "dialog",
                                    dialog: {
                                        title: "导入巡检计划",
                                        body: {
                                            type: "form",
                                            api: inspection_plan_import,
                                            body: [
                                                {
                                                    type: "input-file",
                                                    name: "file",
                                                    label: "选择Excel文件",
                                                    accept: ".xlsx,.xls",
                                                    required: true,
                                                    description: "请上传 .xlsx 或 .xls 格式的文件"
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
                    title: "巡检记录",
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
                                    label: "操作",
                                    width: 280,
                                    buttons: [
                                        {
                                            label: "修改",
                                            type: "button",
                                            actionType: "drawer",
                                            drawer: {
                                                title: "修改巡检记录",
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
                                            label: "查看图片",
                                            type: "button",
                                            actionType: "dialog",
                                            visibleOn: "images",
                                            dialog: {
                                                title: "现场图片",
                                                body: {
                                                    type: "images",
                                                    name: "images",
                                                    enlargeAble: true
                                                }
                                            }
                                        },
                                        {
                                            label: "删除",
                                            type: "button",
                                            actionType: "ajax",
                                            level: "danger",
                                            confirmText: "确定要删除该巡检记录吗？",
                                            confirmTitle: "删除确认",
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
                                    label: "新增记录",
                                    actionType: "drawer",
                                    drawer: {
                                        title: "新增巡检记录",
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
                    title: "巡检日历",
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
                                    label: "选择月份",
                                    format: "YYYY-MM",
                                    inputFormat: "YYYY-MM",
                                    value: "${REPLACE_WITH_CURRENT_MONTH}"
                                }
                            ],
                            actions: [
                                {
                                    type: "button",
                                    label: "查询",
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
                                        ["周日", "周一", "周二", "周三", "周四", "周五", "周六"].forEach(day => {
                                            html += `<th style="padding:8px;text-align:center;border:1px solid #e8e8e8;background:#fafafa;font-weight:600;">${day}</th>`;
                                        });
                                        html += `</tr></thead><tbody><tr>`;

                                        // Empty cells before first day
                                        for (let i = 0; i < firstDay; i++) {
                                            html += `<td style="padding:8px;border:1px solid #e8e8e8;height:80px;vertical-align:top;background:#f5f5f5;"></td>`;
                                        }

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
                                        html += `<span><span style="display:inline-block;width:12px;height:12px;border-radius:2px;background:#52c41a;margin-right:4px;vertical-align:middle;"></span>日常巡检</span>`;
                                        html += `<span><span style="display:inline-block;width:12px;height:12px;border-radius:2px;background:#1890ff;margin-right:4px;vertical-align:middle;"></span>周期保养</span>`;
                                        html += `<span><span style="display:inline-block;width:12px;height:12px;border-radius:2px;background:#faad14;margin-right:4px;vertical-align:middle;"></span>年度维护</span>`;
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
