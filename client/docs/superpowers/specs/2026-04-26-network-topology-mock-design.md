# Network Topology Frontend Mock Design

**Date:** 2026-04-26
**File:** `src/pages/scada/monitor/network_topology.tsx`
**Status:** Design approved, pending implementation

## Problem

`network_topology.tsx` depends on three backend APIs that are not yet implemented:

| API constant | Endpoint | Used by |
|---|---|---|
| `api_crud_search` | `POST /search/search` (searchIdentity: MNetworkDevice) | Device list CRUD |
| `network_device_create` | `POST /scada/network-device/createOrUpdate` | Add/Edit form |
| `network_device_delete` | `POST /scada/network-device/delete/${id}` | Delete button |
| `network_device_topology` | `GET /scada/network-device/topology` | Topology SVG |

Until the backend is ready, both tabs fail silently or show empty states.

## Goal

Make the page fully renderable for UI design verification using frontend-only static mock data. All mock logic must be trivially removable when the real backend ships.

## Approach: amis `service` + static `data`

Replace API calls with amis `service` blocks that provide a static `data` object. No HTTP requests are made. The `onMount` SVG rendering logic is untouched.

### CRUD Tab

**Before:**
```js
{
    type: "crud",
    api: api_crud_search,
    defaultParams: { searchIdentity, showColumns, searchObject },
    // ...
}
```

**After:**
```js
{
    type: "service",
    // TODO: mock — remove when backend ready, restore crud api + defaultParams
    data: { items: MOCK_DEVICES, total: MOCK_DEVICES.length, count: MOCK_DEVICES.length },
    body: [
        {
            type: "crud",
            source: "${items}",  // reads from service data scope
            // api and defaultParams removed
            // all columns, forms, buttons unchanged
        }
    ]
}
```

Side effects of static source:
- Search/filter inputs render but have no effect on the displayed data
- Pagination shows but data is not chunked
- Add/Edit drawers open normally but form submit calls real API (will fail with 404 — acceptable for UI demo)
- Delete button calls real API (same — 404, acceptable)

### Topology Tab

**Before:**
```js
{
    type: "service",
    api: network_device_topology,
    body: [ { type: "custom", onMount: (dom, data) => { ... } } ]
}
```

**After:**
```js
{
    type: "service",
    // TODO: mock — remove when backend ready, restore api: network_device_topology
    data: { items: MOCK_DEVICES },
    body: [ { type: "custom", onMount: (dom, data) => { ... } } ]  // unchanged
}
```

The `onMount` callback reads `data?.items` — works identically with static or API-provided data.

## Mock Data

14 devices across 6 types, modelling a two-zone warehouse network. Defined as `MOCK_DEVICES: readonly NetworkDevice[]` constant at the top of the file.

```
SERVER-01 (服务器)   192.168.1.1    online   — root
  └─ SW-01 (交换机)  192.168.1.2    online   Ethernet → SERVER-01
       ├─ PLC-01     192.168.1.10   online   Profinet → SW-01
       │    ├─ GW-01  192.168.1.20  online   Profinet → PLC-01
       │    ├─ SCAN-01 192.168.1.30 online   Profinet → PLC-01
       │    ├─ SCAN-02 192.168.1.31 online   Profinet → PLC-01
       │    └─ VFD-01  192.168.1.40 online   Profibus → PLC-01
       ├─ PLC-02     192.168.1.11   online   Profinet → SW-01
       │    ├─ GW-02  192.168.1.21  online   Profinet → PLC-02
       │    ├─ SCAN-03 192.168.1.32 online   Profinet → PLC-02
       │    ├─ SCAN-04 192.168.1.33 offline  Profinet → PLC-02
       │    ├─ VFD-02  192.168.1.41 online   Profibus → PLC-02
       │    └─ VFD-03  192.168.1.42 online   Profibus → PLC-02
       └─ PLC-03     192.168.1.12   offline  Profinet → SW-01
            └─ SCAN-05 192.168.1.34 null     Profinet → PLC-03
```

Status distribution: 11 online, 2 offline, 1 unknown — exercises all three SVG fill colours.

## Migration Path (when backend is ready)

1. Delete the `MOCK_DEVICES` constant
2. In the CRUD tab: remove the `service` wrapper, restore `api: api_crud_search` and `defaultParams` on the `crud`
3. In the topology tab: restore `api: network_device_topology` on the `service`
4. Remove the `// TODO: mock` comments

No other changes needed — all column definitions, form fields, and SVG rendering logic are unchanged by this mock.

## Files Changed

- `src/pages/scada/monitor/network_topology.tsx` — only file modified
