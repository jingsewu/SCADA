import schema2component from "@/utils/schema2component";
import {api_crud_search} from "@/pages/constantApi";
import {device_monitor_create, device_monitor_delete} from "@/pages/scada/constants/api_constant";

const formBody = [
    {
        type: "hidden",
        name: "id"
    },
    {
        label: "设备IP",
        type: "input-text",
        name: "deviceIp",
        required: true,
        validations: {
            isIpAddress: true
        }
    },
    {
        label: "设备名称",
        type: "input-text",
        name: "deviceName",
        required: true
    },
    {
        label: "设备类型",
        type: "select",
        name: "deviceType",
        required: true,
        options: [
            "PLC",
            "HMI",
            "RTU",
            "Sensor",
            "Gateway"
        ]
    },
    {
        label: "备注",
        type: "textarea",
        name: "remark"
    },
    {
        label: "在线状态",
        type: "switch",
        name: "online",
        trueValue: true,
        falseValue: false
    },
    {
        label: "最后心跳时间",
        type: "datetime",
        name: "lastPingTime",
        format: "YYYY-MM-DD HH:mm:ss",
        inputFormat: "YYYY-MM-DD HH:mm:ss"
    }
];

const crudColumns = [
    {
        name: "id",
        label: "ID",
        hidden: true
    },
    {
        name: "deviceIp",
        label: "设备IP",
        searchable: true
    },
    {
        name: "deviceName",
        label: "设备名称",
        searchable: true
    },
    {
        name: "deviceType",
        label: "设备类型",
        searchable: {
            type: "select",
            options: [
                "PLC",
                "HMI",
                "RTU",
                "Sensor",
                "Gateway"
            ]
        }
    },
    {
        name: "online",
        label: "在线状态",
        type: "mapping",
        map: {
            true: {
                text: "在线",
                type: "success"
            },
            false: {
                text: "离线",
                type: "danger"
            }
        }
    },
    {
        name: "lastPingTime",
        label: "最后心跳",
        type: "datetime",
        format: "YYYY-MM-DD HH:mm:ss"
    },
    {
        name: "remark",
        label: "备注",
        type: "text"
    }
];

const searchIdentity = "MDeviceMonitor"

const schema = {
    type: "page",
    title: "设备监控管理",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "DeviceMonitorTable",
            api: api_crud_search,
            defaultParams: {
                searchIdentity: searchIdentity,
                showColumns: crudColumns,
                searchObject: {
                    orderBy: "update_time desc"
                }
            },
            columns: [...crudColumns,
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
                                title: "修改设备信息",
                                closeOnEsc: true,
                                closeOnOutside: true,
                                body: {
                                    type: "form",
                                    api: device_monitor_create,
                                    body: formBody
                                }
                            }
                        },
                        {
                            label: "删除",
                            type: "button",
                            actionType: "ajax",
                            level: "danger",
                            confirmText: "确定要删除该设备吗？",
                            confirmTitle: "删除确认",
                            api: device_monitor_delete,
                            reload: "DeviceMonitorTable"
                        }
                    ],
                    toggled: true
                }],
            headerToolbar: [
                {
                    type: "button",
                    label: "新增设备",
                    actionType: "drawer",
                    drawer: {
                        title: "新增设备",
                        body: {
                            type: "form",
                            api: device_monitor_create,
                            body: formBody
                        }
                    }
                },
                "export-excel",
                "reload"
            ]
        }
    ]
};

export default schema2component(schema);
