import schema2component from "@/utils/schema2component";
import { api_crud_search } from "@/pages/constantApi";

// 表单配置（新增/修改时使用）
const formBody = [
    {
        type: "hidden",
        name: "id"
    },
    {
        label: "设备编号",
        type: "input-text",
        name: "deviceNo",
        required: true,
        placeholder: "请输入设备编号"
    },
    {
        label: "报警信息",
        type: "textarea",
        name: "alarmInfo",
        required: true,
        placeholder: "请输入报警信息"
    },
    {
        label: "建议解决方案",
        type: "textarea",
        name: "solution",
        placeholder: "请输入建议解决方案"
    },
    {
        label: "报警时间",
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
        label: "设备编号",
        searchable: {
            type: "input-text",
            name: "deviceNo",
            placeholder: "请输入设备编号"
        }
    },
    {
        name: "alarmInfo",
        label: "报警信息",
        searchable: {
            type: "input-text",
            name: "alarmInfo",
            placeholder: "请输入报警信息"
        }
    },
    {
        name: "solution",
        label: "建议解决方案"
    },
    {
        name: "alarmTime",
        label: "报警时间",
        type: "datetime",
        format: "YYYY-MM-DD HH:mm:ss",
        sortable: true
    }
];

const searchIdentity = "DeviceAlarm"; // 用于后端接口标识

const schema = {
    type: "page",
    title: "设备报警信息管理",
    body: [
        {
            type: "crud",
            syncLocation: false,
            api: {
                ...api_crud_search,
                adapt: (payload:any) => ({
                    ...payload,
                    searchIdentity: searchIdentity
                })
            },
            // 搜索表单配置
            filter: {
                title: "",
                body: [
                    {
                        type: "input-text",
                        name: "deviceNo",
                        label: "设备编号",
                        placeholder: "请输入设备编号"
                    },
                    {
                        type: "input-text",
                        name: "alarmInfo",
                        label: "报警信息",
                        placeholder: "请输入报警信息"
                    },
                    {
                        type: "input-datetime-range",
                        name: "alarmTime",
                        label: "报警时间",
                        placeholder: ["开始日期", "结束日期"],
                        format: "YYYY-MM-DD HH:mm:ss"
                    },
                    {
                        type: "submit",
                        label: "搜索",
                        level: "primary"
                    },
                    {
                        type: "reset",
                        label: "重置"
                    }
                ]
            },
            // 表格列配置
            columns: crudColumns,
            // 顶部工具栏按钮
            headerToolbar: [
                {
                    type: "button",
                    label: "新增",
                    level: "success",
                    icon: "fa fa-plus",
                    actionType: "dialog",
                    dialog: {
                        title: "新增报警信息",
                        body: {
                            type: "form",
                            api: {
                                method: "post",
                                url: "/api/device-alarm/add", // 请替换为实际新增接口
                                data: {
                                    searchIdentity
                                }
                            },
                            body: formBody
                        }
                    }
                },
                {
                    type: "button",
                    label: "修改",
                    level: "info",
                    icon: "fa fa-edit",
                    actionType: "dialog",
                    disabledOn: "!this.items.length", // 有选中项时才启用
                    dialog: {
                        title: "修改报警信息",
                        body: {
                            type: "form",
                            initApi: {
                                method: "get",
                                url: "/api/device-alarm/get/${id}" // 请替换为实际查询接口
                            },
                            api: {
                                method: "post",
                                url: "/api/device-alarm/update", // 请替换为实际修改接口
                                data: {
                                    searchIdentity
                                }
                            },
                            body: formBody
                        }
                    }
                },
                {
                    type: "button",
                    label: "删除",
                    level: "danger",
                    icon: "fa fa-trash",
                    actionType: "ajax",
                    confirmText: "确定要删除选中的记录吗？",
                    api: {
                        method: "post",
                        url: "/api/device-alarm/delete", // 请替换为实际删除接口
                        data: {
                            ids: "${ARRAYJOIN(ids, ',')}",
                            searchIdentity
                        }
                    }
                },
                {
                    type: "export-excel",
                    label: "导出",
                    api: "/api/device-alarm/export" // 请替换为实际导出接口
                },
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
                    label: "编辑",
                    level: "link",
                    actionType: "dialog",
                    dialog: {
                        title: "编辑报警信息",
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
                    label: "删除",
                    level: "link",
                    className: "text-danger",
                    actionType: "ajax",
                    confirmText: "确定要删除这条记录吗？",
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
                    label: "批量删除",
                    actionType: "ajax",
                    confirmText: "确定要删除选中的 ${items.length} 条记录吗？",
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
