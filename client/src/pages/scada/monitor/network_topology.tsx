import schema2component from "@/utils/schema2component";
import { api_crud_search } from "@/pages/constantApi";
import { network_device_create, network_device_delete, network_device_topology } from "@/pages/scada/constants/api_constant";

const formBody = [
    {
        type: "hidden",
        name: "id"
    },
    {
        label: "设备编号",
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
        label: "设备类型",
        type: "select",
        name: "deviceType",
        required: true,
        options: ["PLC", "扫码器", "网关", "服务器", "交换机", "变频器"]
    },
    {
        label: "IP地址",
        type: "input-text",
        name: "ipAddress",
        required: true,
        validations: {
            isIpAddress: true
        }
    },
    {
        label: "PN站号",
        type: "input-text",
        name: "pnStation"
    },
    {
        label: "上级设备",
        type: "input-text",
        name: "parentDevice"
    },
    {
        label: "连接方式",
        type: "select",
        name: "connectionType",
        options: ["Ethernet", "Profinet", "Profibus", "RS485"]
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
        name: "lastHeartbeat",
        format: "YYYY-MM-DD HH:mm:ss",
        inputFormat: "YYYY-MM-DD HH:mm:ss"
    },
    {
        label: "备注",
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
        label: "设备编号",
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
            options: ["PLC", "扫码器", "网关", "服务器", "交换机", "变频器"]
        }
    },
    {
        name: "ipAddress",
        label: "IP地址",
        searchable: true
    },
    {
        name: "pnStation",
        label: "PN站号"
    },
    {
        name: "connectionType",
        label: "连接方式"
    },
    {
        name: "online",
        label: "在线状态",
        type: "tpl",
        tpl: "<span class='label label-${online ? \"success\" : \"danger\"}'>${online ? \"在线\" : \"离线\"}</span>"
    },
    {
        name: "lastHeartbeat",
        label: "最后心跳",
        type: "datetime",
        format: "YYYY-MM-DD HH:mm:ss"
    },
    {
        name: "remark",
        label: "备注"
    }
];

const searchIdentity = "MNetworkDevice";

const schema = {
    type: "page",
    title: "网络拓扑图",
    body: [
        {
            type: "tabs",
            tabs: [
                {
                    title: "设备列表",
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
                                    label: "操作",
                                    width: 230,
                                    buttons: [
                                        {
                                            label: "修改",
                                            type: "button",
                                            actionType: "drawer",
                                            drawer: {
                                                title: "修改网络设备",
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
                                            label: "删除",
                                            type: "button",
                                            actionType: "ajax",
                                            level: "danger",
                                            confirmText: "确定要删除该设备吗？",
                                            confirmTitle: "删除确认",
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
                                    label: "新增设备",
                                    actionType: "drawer",
                                    drawer: {
                                        title: "新增网络设备",
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
                    title: "拓扑图",
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

                                        const devices = data?.items || [];
                                        const width = container.clientWidth;
                                        const height = container.clientHeight;

                                        // Group devices by type into layers
                                        const layers: Record<string, any[]> = {
                                            "服务器": [],
                                            "交换机": [],
                                            "PLC": [],
                                            "网关": [],
                                            "扫码器": [],
                                            "变频器": []
                                        };
                                        devices.forEach((d: any) => {
                                            const type = d.deviceType || "其他";
                                            if (!layers[type]) layers[type] = [];
                                            layers[type].push(d);
                                        });

                                        const layerOrder = ["服务器", "交换机", "PLC", "网关", "扫码器", "变频器"];
                                        const layerLabels: Record<string, string> = {
                                            "服务器": "服务器层",
                                            "交换机": "交换机层",
                                            "PLC": "PLC层",
                                            "网关": "网关层",
                                            "扫码器": "扫码器层",
                                            "变频器": "变频器层"
                                        };

                                        let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
                                        svg += `<rect width="${width}" height="${height}" fill="#fafafa"/>`;
                                        svg += `<text x="${width / 2}" y="30" text-anchor="middle" font-size="18" font-weight="bold" fill="#333">Profinet 网络诊断</text>`;

                                        const nodePositions: Record<string, { x: number; y: number }> = {};
                                        let layerY = 60;
                                        const layerHeight = (height - 80) / layerOrder.length;

                                        layerOrder.forEach((type) => {
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
                                        svg += `<text x="26" y="${legendY + 10}" font-size="11" fill="#666">在线</text>`;
                                        svg += `<rect x="60" y="${legendY}" width="12" height="12" rx="2" fill="#ff4d4f"/>`;
                                        svg += `<text x="76" y="${legendY + 10}" font-size="11" fill="#666">离线</text>`;
                                        svg += `<rect x="110" y="${legendY}" width="12" height="12" rx="2" fill="#d9d9d9"/>`;
                                        svg += `<text x="126" y="${legendY + 10}" font-size="11" fill="#666">未知</text>`;

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
