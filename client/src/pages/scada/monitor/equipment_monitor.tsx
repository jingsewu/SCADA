import schema2component from "@/utils/schema2component";
import {api_crud_search} from "@/pages/constantApi";

// ===== Mock 数据（临时，后端就绪后移除）=====
const MOCK_SUCCESS = { status: 200, data: { status: 0, msg: "操作成功" } };
const DEVICE_MOCK_ITEMS = [
    { id: 1, deviceIp: "192.168.1.101", deviceName: "主控PLC", deviceType: "PLC", online: true, lastPingTime: "2026-04-26 10:05:00", remark: "主线控制器" },
    { id: 2, deviceIp: "192.168.1.102", deviceName: "操作员HMI", deviceType: "HMI", online: true, lastPingTime: "2026-04-26 10:04:30", remark: "" },
    { id: 3, deviceIp: "192.168.1.110", deviceName: "温度传感器组", deviceType: "Sensor", online: false, lastPingTime: "2026-04-26 09:15:00", remark: "库区A温湿度监控" },
    { id: 4, deviceIp: "192.168.1.120", deviceName: "现场总线网关", deviceType: "Gateway", online: true, lastPingTime: "2026-04-26 10:05:00", remark: "Modbus转以太网" },
    { id: 5, deviceIp: "192.168.1.130", deviceName: "AGV控制RTU", deviceType: "RTU", online: true, lastPingTime: "2026-04-26 10:03:00", remark: "" }
];
const mock_crud_device = { ...api_crud_search, mock: { status: 200, data: { status: 0, data: { items: DEVICE_MOCK_ITEMS, total: DEVICE_MOCK_ITEMS.length } } } };
const mock_device_create = { method: "post", url: "/scada/device-monitor/createOrUpdate", mock: MOCK_SUCCESS };
const mock_device_delete = { method: "post", url: "/scada/device-monitor/delete/${id}", mock: MOCK_SUCCESS };

const formBody = [
    {
        type: "hidden",
        name: "id"
    },
    {
        label: "scada.monitor.equipmentMonitor.deviceIp",
        type: "input-text",
        name: "deviceIp",
        required: true,
        validations: {
            isIpAddress: true
        }
    },
    {
        label: "scada.monitor.equipmentMonitor.deviceName",
        type: "input-text",
        name: "deviceName",
        required: true
    },
    {
        label: "scada.monitor.equipmentMonitor.deviceType",
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
        label: "scada.monitor.equipmentMonitor.remark",
        type: "textarea",
        name: "remark"
    },
    {
        label: "scada.monitor.equipmentMonitor.onlineStatus",
        type: "switch",
        name: "online",
        trueValue: true,
        falseValue: false
    },
    {
        label: "scada.monitor.equipmentMonitor.lastPingTime",
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
        label: "scada.monitor.equipmentMonitor.deviceIp",
        searchable: true
    },
    {
        name: "deviceName",
        label: "scada.monitor.equipmentMonitor.deviceName",
        searchable: true
    },
    {
        name: "deviceType",
        label: "scada.monitor.equipmentMonitor.deviceType",
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
        label: "scada.monitor.equipmentMonitor.onlineStatus"
    },
    {
        name: "lastPingTime",
        label: "scada.monitor.equipmentMonitor.lastPingTime",
        type: "datetime",
        format: "YYYY-MM-DD HH:mm:ss"
    },
    {
        name: "remark",
        label: "scada.monitor.equipmentMonitor.remark",
        type: "text"
    }
];

const searchIdentity = "MDeviceMonitor"

const schema = {
    type: "page",
    title: "scada.monitor.equipmentMonitor.pageTitle",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "DeviceMonitorTable",
            api: mock_crud_device,
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
                    label: "table.operation",
                    width: 230,
                    buttons: [
                        {
                            label: "button.modify",
                            type: "button",
                            actionType: "drawer",
                            drawer: {
                                title: "scada.monitor.equipmentMonitor.editDevice",
                                closeOnEsc: true,
                                closeOnOutside: true,
                                body: {
                                    type: "form",
                                    api: mock_device_create,
                                    body: formBody
                                }
                            }
                        },
                        {
                            label: "button.delete",
                            type: "button",
                            actionType: "ajax",
                            level: "danger",
                            confirmText: "toast.sureDelete",
                            confirmTitle: "button.delete",
                            api: mock_device_delete,
                            reload: "DeviceMonitorTable"
                        }
                    ],
                    toggled: true
                }],
            headerToolbar: [
                {
                    type: "button",
                    label: "scada.monitor.equipmentMonitor.addDevice",
                    actionType: "drawer",
                    drawer: {
                        title: "scada.monitor.equipmentMonitor.addDevice",
                        body: {
                            type: "form",
                            api: mock_device_create,
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
