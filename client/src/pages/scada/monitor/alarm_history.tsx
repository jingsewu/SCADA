import schema2component from "@/utils/schema2component";
import { api_crud_search } from "@/pages/constantApi";

// 表单配置（新增/修改时使用）
const formBody = [
    {
        type: "hidden",
        name: "id"
    },
    {
        label: "scada.monitor.alarmHistory.deviceNo",
        type: "input-text",
        name: "deviceNo",
        required: true,
        placeholder: "scada.monitor.alarmHistory.deviceNo.placeholder"
    },
    {
        label: "scada.monitor.alarmHistory.alarmInfo",
        type: "textarea",
        name: "alarmInfo",
        required: true,
        placeholder: "scada.monitor.alarmHistory.alarmInfo.placeholder"
    },
    {
        label: "scada.monitor.alarmHistory.solution",
        type: "textarea",
        name: "solution",
        placeholder: "scada.monitor.alarmHistory.solution.placeholder"
    },
    {
        label: "scada.monitor.alarmHistory.alarmTime",
        type: "input-datetime",
        name: "alarmTime",
        required: true,
        format: "YYYY-MM-DD HH:mm:ss"
    }
];

// CRUD 表格列配置
const crudColumns = [
    {
        name: "id",
        label: "ID"
    },
    {
        name: "deviceNo",
        label: "scada.monitor.alarmHistory.deviceNo",
        searchable: {
            type: "input-text",
            name: "deviceNo",
            placeholder: "scada.monitor.alarmHistory.deviceNo.placeholder"
        }
    },
    {
        name: "alarmInfo",
        label: "scada.monitor.alarmHistory.alarmInfo",
        searchable: {
            type: "input-text",
            name: "alarmInfo",
            placeholder: "scada.monitor.alarmHistory.alarmInfo.placeholder"
        }
    },
    {
        name: "solution",
        label: "scada.monitor.alarmHistory.solution"
    },
    {
        name: "alarmTime",
        label: "scada.monitor.alarmHistory.alarmTime",
        type: "datetime",
        format: "YYYY-MM-DD HH:mm:ss",
        sortable: true
    }
];

const searchIdentity = "DeviceAlarm"; // 用于后端接口标识

const schema = {
    type: "page",
    title: "scada.monitor.alarmHistory.pageTitle",
    body: [
        {
            type: "crud",
            syncLocation: false,
            api: {
                ...api_crud_search
            },
            defaultParams: {
                searchIdentity: searchIdentity,
                showColumns: crudColumns,
                searchObject: {
                    orderBy: "alarm_time desc"
                }
            },
            // 搜索表单配置
            filter: {
                title: "",
                body: [
                    {
                        type: "input-text",
                        name: "deviceNo",
                        label: "scada.monitor.alarmHistory.deviceNo",
                        placeholder: "scada.monitor.alarmHistory.deviceNo.placeholder"
                    },
                    {
                        type: "input-text",
                        name: "alarmInfo",
                        label: "scada.monitor.alarmHistory.alarmInfo",
                        placeholder: "scada.monitor.alarmHistory.alarmInfo.placeholder"
                    },
                    {
                        type: "input-datetime-range",
                        name: "alarmTime",
                        label: "scada.monitor.alarmHistory.alarmTime",
                        placeholder: ["scada.monitor.alarmHistory.startDate", "scada.monitor.alarmHistory.endDate"],
                        format: "YYYY-MM-DD HH:mm:ss"
                    },
                    {
                        type: "submit",
                        label: "button.search",
                        level: "primary"
                    },
                    {
                        type: "reset",
                        label: "button.reset"
                    }
                ]
            },
            // 表格列配置
            columns: crudColumns,
            // 顶部工具栏按钮
            headerToolbar: [
                // {
                //     type: "button",
                //     label: "新增",
                //     level: "success",
                //     icon: "fa fa-plus",
                //     actionType: "dialog",
                //     dialog: {
                //         title: "新增报警信息",
                //         body: {
                //             type: "form",
                //             api: {
                //                 method: "post",
                //                 url: "/api/device-alarm/add", // 请替换为实际新增接口
                //                 data: {
                //                     searchIdentity
                //                 }
                //             },
                //             body: formBody
                //         }
                //     }
                // },
                // {
                //     type: "button",
                //     label: "修改",
                //     level: "info",
                //     icon: "fa fa-edit",
                //     actionType: "dialog",
                //     disabledOn: "!this.items.length", // 有选中项时才启用
                //     dialog: {
                //         title: "修改报警信息",
                //         body: {
                //             type: "form",
                //             initApi: {
                //                 method: "get",
                //                 url: "/api/device-alarm/get/${id}" // 请替换为实际查询接口
                //             },
                //             api: {
                //                 method: "post",
                //                 url: "/api/device-alarm/update", // 请替换为实际修改接口
                //                 data: {
                //                     searchIdentity
                //                 }
                //             },
                //             body: formBody
                //         }
                //     }
                // },
                // {
                //     type: "button",
                //     label: "删除",
                //     level: "danger",
                //     icon: "fa fa-trash",
                //     actionType: "ajax",
                //     confirmText: "确定要删除选中的记录吗？",
                //     api: {
                //         method: "post",
                //         url: "/api/device-alarm/delete", // 请替换为实际删除接口
                //         data: {
                //             ids: "${ARRAYJOIN(ids, ',')}",
                //             searchIdentity
                //         }
                //     }
                // },
                // {
                //     type: "export-excel",
                //     label: "导出",
                //     api: "/api/device-alarm/export" // 请替换为实际导出接口
                // },
                "reload"
            ],
            // 底部工具栏配置
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
            // 操作列配置
            itemActions: [
                {
                    type: "button",
                    label: "button.edit",
                    level: "link",
                    actionType: "dialog",
                    dialog: {
                        title: "scada.monitor.alarmHistory.editAlarm",
                        body: {
                            type: "form",
                            initApi: {
                                method: "get",
                                url: "/api/device-alarm/get/${id}"
                            },
                            api: {
                                method: "post",
                                url: "/api/device-alarm/update"
                            },
                            body: formBody
                        }
                    }
                },
                {
                    type: "button",
                    label: "button.delete",
                    level: "link",
                    className: "text-danger",
                    actionType: "ajax",
                    confirmText: "toast.sureDelete",
                    api: {
                        method: "post",
                        url: "/api/device-alarm/delete",
                        data: {
                            ids: "${id}",
                            searchIdentity
                        }
                    }
                }
            ],
            // 启用功能
            features: ["create", "filter", "view", "update", "delete", "bulkDelete"],
            // 批量操作
            bulkActions: [
                {
                    label: "button.batchDelete",
                    actionType: "ajax",
                    confirmText: "toast.sureBatchDelete",
                    api: {
                        method: "post",
                        url: "/api/device-alarm/batch-delete", // 请替换为实际批量删除接口
                        data: {
                            ids: "${ARRAYJOIN(ids, ',')}",
                            searchIdentity
                        }
                    }
                }
            ],
            // 表格行选中
            keepItemSelectionOnPageChange: true,
            maxKeepItemSelectionLength: 100
        }
    ]
};

export default schema2component(schema);
