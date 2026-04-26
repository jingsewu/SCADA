import schema2component from "@/utils/schema2component";
import { network_device_create, network_device_delete } from "@/pages/scada/constants/api_constant";
import i18n from "i18next";

// TODO: mock data — remove when backend ready, restore api calls
const MOCK_DEVICES = [
    { id: 1,  deviceNo: "SERVER-01", deviceName: "SCADA主服务器",  deviceType: "服务器", ipAddress: "192.168.1.1",  pnStation: null, parentDevice: null,       connectionType: null,       online: true,  lastHeartbeat: "2026-04-26 08:00:00", remark: null },
    { id: 2,  deviceNo: "SW-01",     deviceName: "核心交换机",     deviceType: "交换机", ipAddress: "192.168.1.2",  pnStation: null, parentDevice: "SERVER-01", connectionType: "Ethernet", online: true,  lastHeartbeat: "2026-04-26 08:00:05", remark: null },
    { id: 3,  deviceNo: "PLC-01",    deviceName: "一区PLC",        deviceType: "PLC",    ipAddress: "192.168.1.10", pnStation: "1",  parentDevice: "SW-01",     connectionType: "Profinet", online: true,  lastHeartbeat: "2026-04-26 08:00:10", remark: null },
    { id: 4,  deviceNo: "PLC-02",    deviceName: "二区PLC",        deviceType: "PLC",    ipAddress: "192.168.1.11", pnStation: "2",  parentDevice: "SW-01",     connectionType: "Profinet", online: true,  lastHeartbeat: "2026-04-26 08:00:11", remark: null },
    { id: 5,  deviceNo: "PLC-03",    deviceName: "三区PLC",        deviceType: "PLC",    ipAddress: "192.168.1.12", pnStation: "3",  parentDevice: "SW-01",     connectionType: "Profinet", online: false, lastHeartbeat: "2026-04-26 06:32:00", remark: "离线维修中" },
    { id: 6,  deviceNo: "GW-01",     deviceName: "一区Profinet网关", deviceType: "网关", ipAddress: "192.168.1.20", pnStation: "11", parentDevice: "PLC-01",    connectionType: "Profinet", online: true,  lastHeartbeat: "2026-04-26 08:00:12", remark: null },
    { id: 7,  deviceNo: "GW-02",     deviceName: "二区Profinet网关", deviceType: "网关", ipAddress: "192.168.1.21", pnStation: "21", parentDevice: "PLC-02",    connectionType: "Profinet", online: true,  lastHeartbeat: "2026-04-26 08:00:13", remark: null },
    { id: 8,  deviceNo: "SCAN-01",   deviceName: "入库口扫码器",   deviceType: "扫码器", ipAddress: "192.168.1.30", pnStation: "12", parentDevice: "PLC-01",    connectionType: "Profinet", online: true,  lastHeartbeat: "2026-04-26 08:00:15", remark: null },
    { id: 9,  deviceNo: "SCAN-02",   deviceName: "分拣口扫码器",   deviceType: "扫码器", ipAddress: "192.168.1.31", pnStation: "13", parentDevice: "PLC-01",    connectionType: "Profinet", online: true,  lastHeartbeat: "2026-04-26 08:00:15", remark: null },
    { id: 10, deviceNo: "SCAN-03",   deviceName: "出库口扫码器",   deviceType: "扫码器", ipAddress: "192.168.1.32", pnStation: "22", parentDevice: "PLC-02",    connectionType: "Profinet", online: true,  lastHeartbeat: "2026-04-26 08:00:16", remark: null },
    { id: 11, deviceNo: "SCAN-04",   deviceName: "复核台扫码器",   deviceType: "扫码器", ipAddress: "192.168.1.33", pnStation: "23", parentDevice: "PLC-02",    connectionType: "Profinet", online: false, lastHeartbeat: "2026-04-26 07:15:00", remark: null },
    { id: 12, deviceNo: "SCAN-05",   deviceName: "三区扫码器",     deviceType: "扫码器", ipAddress: "192.168.1.34", pnStation: "31", parentDevice: "PLC-03",    connectionType: "Profinet", online: null,  lastHeartbeat: null,                  remark: null },
    { id: 13, deviceNo: "VFD-01",    deviceName: "一区输送机变频器", deviceType: "变频器", ipAddress: "192.168.1.40", pnStation: "14", parentDevice: "PLC-01",    connectionType: "Profibus", online: true,  lastHeartbeat: "2026-04-26 08:00:20", remark: null },
    { id: 14, deviceNo: "VFD-02",    deviceName: "二区输送机变频器A", deviceType: "变频器", ipAddress: "192.168.1.41", pnStation: "24", parentDevice: "PLC-02",    connectionType: "Profibus", online: true,  lastHeartbeat: "2026-04-26 08:00:21", remark: null },
    { id: 15, deviceNo: "VFD-03",    deviceName: "二区输送机变频器B", deviceType: "变频器", ipAddress: "192.168.1.42", pnStation: "25", parentDevice: "PLC-02",    connectionType: "Profibus", online: true,  lastHeartbeat: "2026-04-26 08:00:21", remark: null }
];

const formBody = [
    {
        type: "hidden",
        name: "id"
    },
    {
        label: "scada.monitor.networkTopology.deviceNo",
        type: "input-text",
        name: "deviceNo",
        required: true
    },
    {
        label: "scada.monitor.networkTopology.deviceName",
        type: "input-text",
        name: "deviceName",
        required: true
    },
    {
        label: "scada.monitor.networkTopology.deviceType",
        type: "select",
        name: "deviceType",
        required: true,
        options: [
            { label: "PLC", value: "PLC" },
            { label: "scada.monitor.networkTopology.scanner", value: "扫码器" },
            { label: "scada.monitor.networkTopology.gateway", value: "网关" },
            { label: "scada.monitor.networkTopology.server", value: "服务器" },
            { label: "scada.monitor.networkTopology.switch", value: "交换机" },
            { label: "scada.monitor.networkTopology.vfd", value: "变频器" }
        ]
    },
    {
        label: "scada.monitor.networkTopology.ipAddress",
        type: "input-text",
        name: "ipAddress",
        required: true,
        validations: {
            isIpAddress: true
        }
    },
    {
        label: "scada.monitor.networkTopology.pnStation",
        type: "input-text",
        name: "pnStation"
    },
    {
        label: "scada.monitor.networkTopology.parentDevice",
        type: "input-text",
        name: "parentDevice"
    },
    {
        label: "scada.monitor.networkTopology.connectionType",
        type: "select",
        name: "connectionType",
        options: ["Ethernet", "Profinet", "Profibus", "RS485"]
    },
    {
        label: "scada.monitor.networkTopology.onlineStatus",
        type: "switch",
        name: "online",
        trueValue: true,
        falseValue: false
    },
    {
        label: "scada.monitor.networkTopology.lastHeartbeat",
        type: "datetime",
        name: "lastHeartbeat",
        format: "YYYY-MM-DD HH:mm:ss",
        inputFormat: "YYYY-MM-DD HH:mm:ss"
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
        name: "deviceNo",
        label: "scada.monitor.networkTopology.deviceNo",
        searchable: true
    },
    {
        name: "deviceName",
        label: "scada.monitor.networkTopology.deviceName",
        searchable: true
    },
    {
        name: "deviceType",
        label: "scada.monitor.networkTopology.deviceType",
        searchable: {
            type: "select",
            options: [
                { label: "PLC", value: "PLC" },
                { label: "scada.monitor.networkTopology.scanner", value: "扫码器" },
                { label: "scada.monitor.networkTopology.gateway", value: "网关" },
                { label: "scada.monitor.networkTopology.server", value: "服务器" },
                { label: "scada.monitor.networkTopology.switch", value: "交换机" },
                { label: "scada.monitor.networkTopology.vfd", value: "变频器" }
            ]
        }
    },
    {
        name: "ipAddress",
        label: "scada.monitor.networkTopology.ipAddress",
        searchable: true
    },
    {
        name: "pnStation",
        label: "scada.monitor.networkTopology.pnStation"
    },
    {
        name: "connectionType",
        label: "scada.monitor.networkTopology.connectionType"
    },
    {
        name: "online",
        label: "scada.monitor.networkTopology.onlineStatus",
        type: "tpl",
        tpl: "<span class='label label-${online ? \"success\" : \"danger\"}'>${online ? \"${scada.monitor.networkTopology.online | t}\" : \"${scada.monitor.networkTopology.offline | t}\"}</span>"
    },
    {
        name: "lastHeartbeat",
        label: "scada.monitor.networkTopology.lastHeartbeatShort",
        type: "datetime",
        format: "YYYY-MM-DD HH:mm:ss"
    },
    {
        name: "remark",
        label: "common.remark"
    }
];

const schema = {
    type: "page",
    title: "scada.monitor.networkTopology.title",
    body: [
        {
            type: "tabs",
            tabs: [
                {
                    title: "scada.monitor.networkTopology.deviceList",
                    body: [
                        // TODO: mock — remove service wrapper + restore crud api/defaultParams when backend ready
                        {
                            type: "service",
                            data: {
                                items: MOCK_DEVICES,
                                total: MOCK_DEVICES.length,
                                count: MOCK_DEVICES.length
                            },
                            body: [
                                {
                                    type: "crud",
                                    syncLocation: false,
                                    name: "NetworkDeviceTable",
                                    source: "${items}",
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
                                                        title: "scada.monitor.networkTopology.editDevice",
                                                        closeOnEsc: true,
                                                        closeOnOutside: true,
                                                        body: {
                                                            type: "form",
                                                            api: network_device_create,
                                                            body: formBody
                                                        }
                                                    }
                                                },
                                                {
                                                    label: "button.delete",
                                                    type: "button",
                                                    actionType: "ajax",
                                                    level: "danger",
                                                    confirmText: "scada.monitor.networkTopology.confirmDelete",
                                                    confirmTitle: "common.deleteConfirmTitle",
                                                    api: network_device_delete,
                                                    reload: "NetworkDeviceTable"
                                                }
                                            ],
                                            toggled: true
                                        }
                                    ],
                                    headerToolbar: [
                                        {
                                            type: "button",
                                            label: "scada.monitor.networkTopology.addDevice",
                                            actionType: "drawer",
                                            drawer: {
                                                title: "scada.monitor.networkTopology.addDeviceDrawer",
                                                body: {
                                                    type: "form",
                                                    api: network_device_create,
                                                    body: formBody
                                                }
                                            }
                                        },
                                        "export-excel",
                                        "reload"
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    title: "scada.monitor.networkTopology.topologyTab",
                    body: [
                        // TODO: mock — replace data with api: network_device_topology when backend ready
                        {
                            type: "service",
                            data: { items: MOCK_DEVICES },
                            body: [
                                {
                                    type: "custom",
                                    html: "<div id='topology-container' style='width:100%;height:600px;border:1px solid #e8e8e8;border-radius:4px;background:#fafafa;'></div>",
                                    onMount: (dom: HTMLElement, data: any) => {
                                        const container = dom.querySelector("#topology-container");
                                        if (!container) return;

                                        const t = i18n.t.bind(i18n);
                                        const devices = data?.items || [];
                                        const width = container.clientWidth;
                                        const height = container.clientHeight;

                                        // Device type keys for backend values
                                        const deviceTypes = ["服务器", "交换机", "PLC", "网关", "扫码器", "变频器"];

                                        // Group devices by type into layers
                                        const layers: Record<string, any[]> = {};
                                        deviceTypes.forEach(type => { layers[type] = []; });
                                        devices.forEach((d: any) => {
                                            const type = d.deviceType || "其他";
                                            if (!layers[type]) layers[type] = [];
                                            layers[type].push(d);
                                        });

                                        const layerLabels: Record<string, string> = {
                                            "服务器": t("scada.monitor.networkTopology.serverLayer"),
                                            "交换机": t("scada.monitor.networkTopology.switchLayer"),
                                            "PLC": t("scada.monitor.networkTopology.plcLayer"),
                                            "网关": t("scada.monitor.networkTopology.gatewayLayer"),
                                            "扫码器": t("scada.monitor.networkTopology.scannerLayer"),
                                            "变频器": t("scada.monitor.networkTopology.vfdLayer")
                                        };

                                        let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
                                        svg += `<rect width="${width}" height="${height}" fill="#fafafa"/>`;
                                        svg += `<text x="${width / 2}" y="30" text-anchor="middle" font-size="18" font-weight="bold" fill="#333">${t("scada.monitor.networkTopology.profinetDiag")}</text>`;

                                        const nodePositions: Record<string, { x: number; y: number }> = {};
                                        let layerY = 60;
                                        const layerHeight = (height - 80) / deviceTypes.length;

                                        deviceTypes.forEach((type) => {
                                            const items = layers[type] || [];
                                            if (items.length === 0) {
                                                layerY += layerHeight;
                                                return;
                                            }

                                            // Layer label
                                            svg += `<text x="10" y="${layerY + 15}" font-size="12" fill="#999">${layerLabels[type]}</text>`;

                                            const nodeWidth = 120;
                                            const nodeHeight = 50;
                                            const gap = Math.min(30, (width - 100 - items.length * nodeWidth) / (items.length + 1));
                                            const startX = 80;

                                            items.forEach((item: any, i: number) => {
                                                const x = startX + i * (nodeWidth + gap);
                                                const y = layerY + 25;
                                                const fillColor = item.online ? "#52c41a" : item.online === false ? "#ff4d4f" : "#d9d9d9";
                                                const textColor = item.online ? "#fff" : item.online === false ? "#fff" : "#666";

                                                nodePositions[item.deviceNo] = { x: x + nodeWidth / 2, y: y + nodeHeight / 2 };

                                                svg += `<rect x="${x}" y="${y}" width="${nodeWidth}" height="${nodeHeight}" rx="6" fill="${fillColor}" stroke="#e8e8e8"/>`;
                                                svg += `<text x="${x + nodeWidth / 2}" y="${y + 20}" text-anchor="middle" font-size="11" fill="${textColor}" font-weight="bold">${item.deviceNo || ""}</text>`;
                                                svg += `<text x="${x + nodeWidth / 2}" y="${y + 36}" text-anchor="middle" font-size="10" fill="${textColor}">${item.ipAddress || ""}</text>`;
                                            });

                                            layerY += layerHeight;
                                        });

                                        // Draw connections based on parentDevice
                                        devices.forEach((d: any) => {
                                            if (d.parentDevice && nodePositions[d.parentDevice] && nodePositions[d.deviceNo]) {
                                                const from = nodePositions[d.parentDevice];
                                                const to = nodePositions[d.deviceNo];
                                                svg += `<line x1="${from.x}" y1="${from.y + 25}" x2="${to.x}" y2="${to.y - 25}" stroke="#91d5ff" stroke-width="2"/>`;
                                            }
                                        });

                                        // Legend
                                        const legendY = height - 30;
                                        svg += `<rect x="10" y="${legendY}" width="12" height="12" rx="2" fill="#52c41a"/>`;
                                        svg += `<text x="26" y="${legendY + 10}" font-size="11" fill="#666">${t("scada.monitor.networkTopology.online")}</text>`;
                                        svg += `<rect x="80" y="${legendY}" width="12" height="12" rx="2" fill="#ff4d4f"/>`;
                                        svg += `<text x="96" y="${legendY + 10}" font-size="11" fill="#666">${t("scada.monitor.networkTopology.offline")}</text>`;
                                        svg += `<rect x="150" y="${legendY}" width="12" height="12" rx="2" fill="#d9d9d9"/>`;
                                        svg += `<text x="166" y="${legendY + 10}" font-size="11" fill="#666">${t("scada.monitor.networkTopology.unknown")}</text>`;

                                        svg += "</svg>";
                                        container.innerHTML = svg;
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
