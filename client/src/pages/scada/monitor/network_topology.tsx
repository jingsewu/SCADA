import schema2component from "@/utils/schema2component";
import { api_crud_search } from "@/pages/constantApi";
import { network_device_create, network_device_delete, network_device_topology } from "@/pages/scada/constants/api_constant";
import i18n from "i18next";

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

const searchIdentity = "MNetworkDevice";

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
                        {
                            type: "crud",
                            syncLocation: false,
                            name: "NetworkDeviceTable",
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
                },
                {
                    title: "scada.monitor.networkTopology.topologyTab",
                    body: [
                        {
                            type: "service",
                            api: network_device_topology,
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
