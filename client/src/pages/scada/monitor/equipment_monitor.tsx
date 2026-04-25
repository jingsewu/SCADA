import schema2component from "@/utils/schema2component";
import {api_crud_search} from "@/pages/constantApi";
import {device_monitor_create, device_monitor_delete} from "@/pages/scada/constants/api_constant";

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
                                    api: device_monitor_create,
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
                            api: device_monitor_delete,
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
