# SCADA New Modules Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three new frontend modules to the SCADA system: Meter Management (电表管理), Network Topology (网络拓扑图), and Equipment Inspection (设备巡检).

**Architecture:** All pages use Amis schema-driven development via `schema2component`. API constants follow `"method:/path"` string convention. Routes register in `path2Compoment.tsx` with lazy imports and i18n Translation wrappers.

**Tech Stack:** React 18, TypeScript, Amis 6.12, ECharts (via Amis chart component), react-i18next

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `src/pages/scada/constants/api_constant.tsx` | Add all new API endpoint constants |
| Create | `src/pages/scada/monitor/meter_management.tsx` | Meter Management page (CRUD + charts) |
| Create | `src/pages/scada/monitor/network_topology.tsx` | Network Topology page (CRUD + SVG topo) |
| Create | `src/pages/scada/maintenance/equipment_inspection.tsx` | Equipment Inspection page (plans + records + calendar) |
| Modify | `src/routes/path2Compoment.tsx` | Register 3 new routes |
| Modify | `src/locales/zh-cn.json` | Add Chinese translation keys |
| Modify | `src/locales/en-us.json` | Add English translation keys |

---

### Task 1: Add API Constants

**Files:**
- Modify: `src/pages/scada/constants/api_constant.tsx`

- [ ] **Step 1: Append API constants to the file**

Add the following after the existing `device_monitor_delete` export at the end of the file:

```typescript
// 电表管理
export const meter_create = "post:/scada/meter/createOrUpdate"
export const meter_delete = "post:/scada/meter/delete/${id}"
export const meter_power_data = "post:/scada/meter/powerData"

// 网络设备
export const network_device_create = "post:/scada/network-device/createOrUpdate"
export const network_device_delete = "post:/scada/network-device/delete/${id}"
export const network_device_topology = "get:/scada/network-device/topology"

// 巡检计划
export const inspection_plan_create = "post:/scada/inspection-plan/createOrUpdate"
export const inspection_plan_delete = "post:/scada/inspection-plan/delete/${id}"
export const inspection_plan_calendar = "get:/scada/inspection-plan/calendar"
export const inspection_plan_import = "post:/scada/inspection-plan/import"

// 巡检记录
export const inspection_record_create = "post:/scada/inspection-record/createOrUpdate"
export const inspection_record_delete = "post:/scada/inspection-record/delete/${id}"
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit src/pages/scada/constants/api_constant.tsx` (or check IDE for red squiggles)
Expected: No errors — these are plain string exports.

- [ ] **Step 3: Commit**

```bash
git add src/pages/scada/constants/api_constant.tsx
git commit -m "feat: add API constants for meter, network-device, inspection modules"
```

---

### Task 2: Create Meter Management Page (电表管理)

**Files:**
- Create: `src/pages/scada/monitor/meter_management.tsx`

- [ ] **Step 1: Create the meter management page file**

Create `src/pages/scada/monitor/meter_management.tsx` with the following content:

```typescript
import schema2component from "@/utils/schema2component";
import { api_crud_search } from "@/pages/constantApi";
import { meter_create, meter_delete, meter_power_data } from "@/pages/scada/constants/api_constant";

const formBody = [
    {
        type: "hidden",
        name: "id"
    },
    {
        label: "电表编号",
        type: "input-text",
        name: "meterNo",
        required: true
    },
    {
        label: "电表名称",
        type: "input-text",
        name: "meterName",
        required: true
    },
    {
        label: "电表类型",
        type: "select",
        name: "meterType",
        required: true,
        options: ["单相电表", "三相电表"]
    },
    {
        label: "所属电柜",
        type: "input-text",
        name: "cabinetNo",
        required: true
    },
    {
        label: "安装位置",
        type: "input-text",
        name: "location",
        required: true
    },
    {
        label: "额定电压(V)",
        type: "input-number",
        name: "ratedVoltage"
    },
    {
        label: "额定电流(A)",
        type: "input-number",
        name: "ratedCurrent"
    },
    {
        label: "状态",
        type: "select",
        name: "status",
        required: true,
        options: ["正常", "异常", "离线"]
    },
    {
        label: "安装日期",
        type: "input-date",
        name: "installDate",
        format: "YYYY-MM-DD"
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
        name: "meterNo",
        label: "电表编号",
        searchable: true
    },
    {
        name: "meterName",
        label: "电表名称",
        searchable: true
    },
    {
        name: "meterType",
        label: "电表类型",
        searchable: {
            type: "select",
            options: ["单相电表", "三相电表"]
        }
    },
    {
        name: "cabinetNo",
        label: "所属电柜",
        searchable: true
    },
    {
        name: "location",
        label: "安装位置"
    },
    {
        name: "ratedVoltage",
        label: "额定电压(V)"
    },
    {
        name: "ratedCurrent",
        label: "额定电流(A)"
    },
    {
        name: "status",
        label: "状态",
        type: "tpl",
        tpl: "<span class='label label-${status === \"正常\" ? \"success\" : status === \"异常\" ? \"danger\" : \"default\"}'>${status}</span>"
    },
    {
        name: "installDate",
        label: "安装日期"
    },
    {
        name: "remark",
        label: "备注"
    }
];

const searchIdentity = "MMeter";

const schema = {
    type: "page",
    title: "电表管理",
    body: [
        {
            type: "tabs",
            tabs: [
                {
                    title: "电表列表",
                    body: [
                        {
                            type: "crud",
                            syncLocation: false,
                            name: "MeterTable",
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
                                                title: "修改电表信息",
                                                closeOnEsc: true,
                                                closeOnOutside: true,
                                                body: {
                                                    type: "form",
                                                    api: meter_create,
                                                    body: formBody
                                                }
                                            }
                                        },
                                        {
                                            label: "删除",
                                            type: "button",
                                            actionType: "ajax",
                                            level: "danger",
                                            confirmText: "确定要删除该电表吗？",
                                            confirmTitle: "删除确认",
                                            api: meter_delete,
                                            reload: "MeterTable"
                                        }
                                    ],
                                    toggled: true
                                }
                            ],
                            headerToolbar: [
                                {
                                    type: "button",
                                    label: "新增电表",
                                    actionType: "drawer",
                                    drawer: {
                                        title: "新增电表",
                                        body: {
                                            type: "form",
                                            api: meter_create,
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
                    title: "电力数据统计",
                    body: [
                        {
                            type: "form",
                            title: "",
                            mode: "horizontal",
                            className: "m-b-md",
                            target: "powerDataChart",
                            body: [
                                {
                                    type: "select",
                                    name: "cabinetNo",
                                    label: "电柜",
                                    clearable: true,
                                    source: {
                                        method: "post",
                                        url: "/search/search?page=1&perPage=100",
                                        data: {
                                            searchIdentity: searchIdentity,
                                            showColumns: [{ name: "cabinetNo", label: "所属电柜" }]
                                        },
                                        adaptor: (payload: any) => ({
                                            options: (payload?.data?.items || []).map((item: any) => ({
                                                label: item.cabinetNo,
                                                value: item.cabinetNo
                                            }))
                                        })
                                    }
                                },
                                {
                                    type: "input-datetime-range",
                                    name: "queryTime",
                                    label: "查询时间",
                                    format: "YYYY-MM-DD HH:mm:ss",
                                    inputFormat: "YYYY-MM-DD HH:mm:ss"
                                }
                            ],
                            actions: [
                                {
                                    type: "button",
                                    label: "搜索",
                                    actionType: "submit",
                                    level: "primary"
                                },
                                {
                                    type: "button",
                                    label: "重置",
                                    actionType: "reset"
                                }
                            ]
                        },
                        {
                            type: "grid",
                            columns: [
                                {
                                    md: 3,
                                    body: {
                                        type: "card",
                                        header: { title: "当前总功率" },
                                        body: {
                                            type: "tpl",
                                            tpl: "<div class='text-center'><h1 class='text-info'>-- KW</h1></div>"
                                        }
                                    }
                                },
                                {
                                    md: 3,
                                    body: {
                                        type: "card",
                                        header: { title: "最高电流" },
                                        body: {
                                            type: "tpl",
                                            tpl: "<div class='text-center'><h1 class='text-danger'>-- A</h1></div>"
                                        }
                                    }
                                },
                                {
                                    md: 3,
                                    body: {
                                        type: "card",
                                        header: { title: "平均电压" },
                                        body: {
                                            type: "tpl",
                                            tpl: "<div class='text-center'><h1 class='text-success'>-- V</h1></div>"
                                        }
                                    }
                                },
                                {
                                    md: 3,
                                    body: {
                                        type: "card",
                                        header: { title: "电表总数" },
                                        body: {
                                            type: "tpl",
                                            tpl: "<div class='text-center'><h1 class='text-warning'>--</h1></div>"
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            type: "grid",
                            columns: [
                                {
                                    md: 6,
                                    body: {
                                        type: "chart",
                                        name: "powerDataChart",
                                        config: {
                                            title: { text: "电流趋势 (A)" },
                                            tooltip: { trigger: "axis" },
                                            legend: { data: ["A相电流", "B相电流", "C相电流"] },
                                            xAxis: {
                                                type: "category",
                                                data: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"]
                                            },
                                            yAxis: { type: "value", name: "电流(A)" },
                                            series: [
                                                {
                                                    name: "A相电流",
                                                    type: "line",
                                                    smooth: true,
                                                    data: [100, 98, 95, 97, 105, 108, 106, 104, 107, 103, 99, 96]
                                                },
                                                {
                                                    name: "B相电流",
                                                    type: "line",
                                                    smooth: true,
                                                    data: [98, 96, 93, 95, 103, 106, 104, 102, 105, 101, 97, 94]
                                                },
                                                {
                                                    name: "C相电流",
                                                    type: "line",
                                                    smooth: true,
                                                    data: [99, 97, 94, 96, 104, 107, 105, 103, 106, 102, 98, 95]
                                                }
                                            ],
                                            grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true }
                                        }
                                    }
                                },
                                {
                                    md: 6,
                                    body: {
                                        type: "chart",
                                        config: {
                                            title: { text: "功率趋势 (KW)" },
                                            tooltip: { trigger: "axis" },
                                            legend: { data: ["有功功率", "无功功率"] },
                                            xAxis: {
                                                type: "category",
                                                data: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"]
                                            },
                                            yAxis: { type: "value", name: "功率(KW)" },
                                            series: [
                                                {
                                                    name: "有功功率",
                                                    type: "line",
                                                    smooth: true,
                                                    areaStyle: {},
                                                    data: [45, 42, 38, 40, 55, 62, 58, 54, 60, 52, 44, 40]
                                                },
                                                {
                                                    name: "无功功率",
                                                    type: "line",
                                                    smooth: true,
                                                    areaStyle: {},
                                                    data: [12, 10, 8, 9, 15, 18, 16, 14, 17, 13, 11, 9]
                                                }
                                            ],
                                            grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true }
                                        }
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
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit src/pages/scada/monitor/meter_management.tsx`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/scada/monitor/meter_management.tsx
git commit -m "feat: add meter management page with CRUD and power data charts"
```

---

### Task 3: Create Network Topology Page (网络拓扑图)

**Files:**
- Create: `src/pages/scada/monitor/network_topology.tsx`

- [ ] **Step 1: Create the network topology page file**

Create `src/pages/scada/monitor/network_topology.tsx` with the following content:

```typescript
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
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit src/pages/scada/monitor/network_topology.tsx`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/scada/monitor/network_topology.tsx
git commit -m "feat: add network topology page with device CRUD and SVG topology view"
```

---

### Task 4: Create Equipment Inspection Page (设备巡检)

**Files:**
- Create: `src/pages/scada/maintenance/equipment_inspection.tsx`

- [ ] **Step 1: Create the maintenance directory and inspection page file**

Create directory `src/pages/scada/maintenance/` then create `equipment_inspection.tsx`:

```typescript
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
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit src/pages/scada/maintenance/equipment_inspection.tsx`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/scada/maintenance/equipment_inspection.tsx
git commit -m "feat: add equipment inspection page with plans, records, and calendar view"
```

---

### Task 5: Register Routes

**Files:**
- Modify: `src/routes/path2Compoment.tsx`

- [ ] **Step 1: Add new route entries**

In `src/routes/path2Compoment.tsx`, add the following three entries to the `menuRouter` array, right after the existing SCADA log route entry (line 169, after the `scada-log` route):

```typescript
    // 电表管理
    {
        path: "/scada/monitor/meter-management",
        name: (
            <Translation>
                {(t) => t("scada.monitor.meterManagement.title")}
            </Translation>
        ),
        component: lazy(
            () => import("@/pages/scada/monitor/meter_management")
        )
    },
    // 网络拓扑图
    {
        path: "/scada/monitor/network-topology",
        name: (
            <Translation>
                {(t) => t("scada.monitor.networkTopology.title")}
            </Translation>
        ),
        component: lazy(
            () => import("@/pages/scada/monitor/network_topology")
        )
    },
    // 设备巡检
    {
        path: "/scada/maintenance/equipment-inspection",
        name: (
            <Translation>
                {(t) => t("scada.maintenance.equipmentInspection.title")}
            </Translation>
        ),
        component: lazy(
            () => import("@/pages/scada/maintenance/equipment_inspection")
        )
    },
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit src/routes/path2Compoment.tsx`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/routes/path2Compoment.tsx
git commit -m "feat: register routes for meter-management, network-topology, equipment-inspection"
```

---

### Task 6: Add i18n Translation Keys

**Files:**
- Modify: `src/locales/zh-cn.json`
- Modify: `src/locales/en-us.json`

- [ ] **Step 1: Add Chinese translations**

In `src/locales/zh-cn.json`, add the following keys after the existing `"scada.log.scadaLog.title": "SCADA日志"` entry (the last SCADA key, currently on line 845):

```json
    "scada.monitor.meterManagement.title": "电表管理",
    "scada.monitor.networkTopology.title": "网络拓扑图",
    "scada.maintenance.title": "设备维护",
    "scada.maintenance.equipmentInspection.title": "设备巡检"
```

Note: The last key `"scada.log.scadaLog.title": "SCADA日志"` is currently the final entry in the JSON file (no trailing comma). You need to add a comma after it before appending the new entries. The last new entry should also have no trailing comma if it remains the final entry.

- [ ] **Step 2: Add English translations**

In `src/locales/en-us.json`, add the following keys after the existing `"scada.log.scadaLog.title": "SCADA Log"` entry (the last SCADA key, currently on line 846):

```json
    "scada.monitor.meterManagement.title": "Meter Management",
    "scada.monitor.networkTopology.title": "Network Topology",
    "scada.maintenance.title": "Equipment Maintenance",
    "scada.maintenance.equipmentInspection.title": "Equipment Inspection"
```

Same comma handling as the Chinese file.

- [ ] **Step 3: Verify JSON is valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('src/locales/zh-cn.json','utf8')); console.log('zh-cn OK')"` and the same for `en-us.json`.
Expected: Both print "OK" with no parse errors.

- [ ] **Step 4: Commit**

```bash
git add src/locales/zh-cn.json src/locales/en-us.json
git commit -m "feat: add i18n keys for meter management, network topology, equipment inspection"
```

---

### Task 7: Smoke Test

**Files:** None (verification only)

- [ ] **Step 1: Start dev server**

Run: `npm run dev`
Expected: Webpack compiles without errors, dev server starts on port 4001.

- [ ] **Step 2: Verify pages load**

Open browser and navigate to each new route:
- `http://localhost:4001/scada/monitor/meter-management` — should show tabs with "电表列表" and "电力数据统计"
- `http://localhost:4001/scada/monitor/network-topology` — should show tabs with "设备列表" and "拓扑图"
- `http://localhost:4001/scada/maintenance/equipment-inspection` — should show tabs with "巡检计划", "巡检记录", and "巡检日历"

Expected: All three pages render without console errors. CRUD tables will show empty data (backend not connected), but the page structure and forms should be fully functional.

- [ ] **Step 3: Final commit if any fixes were needed**

If any issues were found and fixed during smoke test:

```bash
git add -A
git commit -m "fix: resolve issues found during smoke test"
```
