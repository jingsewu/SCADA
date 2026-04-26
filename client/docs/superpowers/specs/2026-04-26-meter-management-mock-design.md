# Meter Management — Frontend Mock Design

**Date:** 2026-04-26
**File:** `client/src/pages/scada/monitor/meter_management.tsx`
**Scope:** Replace all backend API calls with pure frontend mock data. No backend changes required.

---

## Background

`meter_management.tsx` is a fully-featured amis schema page with two tabs:
- **Tab 1:** Meter CRUD (list, create, update, delete)
- **Tab 2:** Power data statistics (metric cards + ECharts line charts)

Three API constants are defined (`meter_create`, `meter_delete`, `meter_power_data`) but no backend Controller, Entity, Repository, or database table exists. The goal is to make the page functional with mock data while keeping the architecture easy to replace with a real backend later.

---

## Approach

**Pure frontend mock using amis schema `source` binding and mock adaptors.** No backend code is written. All changes are confined to `meter_management.tsx`.

---

## Section 1: Mock Data Structure

A constant `MOCK_METERS` is defined at the top of the file containing 6 meter records. The records cover all form fields and all three status values (正常, 异常, 离线) to exercise the color-coded status column.

| Field | Example Values |
|-------|---------------|
| `id` | 1–6 |
| `meterNo` | MT001–MT006 |
| `meterName` | 1号配电室主表, 车间A动力表, 厂区照明总表, etc. |
| `meterType` | 三相电表 (4), 单相电表 (2) |
| `cabinetNo` | CAB-01, CAB-02, CAB-03 |
| `location` | 配电室1层, 车间A, 楼道北侧, etc. |
| `ratedVoltage` | 220 / 380 |
| `ratedCurrent` | 100 / 200 / 630 |
| `status` | 正常×4, 异常×1, 离线×1 |
| `installDate` | 2023-01-15 ~ 2024-06-20 |
| `remark` | Short descriptions |

The mock data is injected into the amis page schema via the top-level `data` field:

```js
data: {
  mockMeters: MOCK_METERS
}
```

---

## Section 2: Tab 1 — CRUD Architecture

### List

Replace `api: api_crud_search` with `source: "$mockMeters"`. The CRUD reads from the page's data context without any network request. Pagination is hidden (data volume is 6 records, no paging needed).

The `searchIdentity` field and any search-related API options are removed.

### Create / Update

The drawer form is preserved as-is. The submit `api` is replaced with an amis inline mock adaptor:

```js
api: {
  url: "post:/scada/meter/createOrUpdate",
  adaptor: () => ({ status: 0, msg: "操作成功", data: {} })
}
```

amis interprets `status: 0` as success, closes the drawer, and shows a success toast. The list data does not update (mock limitation — data resets on page refresh).

### Delete

The delete confirmation dialog's API is similarly mocked:

```js
api: {
  url: "post:/scada/meter/delete/${id}",
  adaptor: () => ({ status: 0, msg: "删除成功", data: {} })
}
```

Confirms → success toast → list unchanged.

### Accepted Mock Limitation

CRUD operations (create/update/delete) show success feedback but do not persist changes. The list always shows the initial 6 mock records. This is expected and acceptable for the mock phase.

---

## Section 3: Tab 2 — Power Data Statistics

### Metric Cards (Static)

| Metric | Mock Value |
|--------|-----------|
| 当前总功率 | 128.6 kW |
| 最高电流 | 342 A |
| 平均电压 | 379.2 V |
| 电表总数 | 6 |

Values are hardcoded in the schema's static data. No API call is made.

### Current Trend Chart (A/B/C Phase)

12 data points covering the past 12 hours (one per hour). Each phase has realistic, slightly varying values:

- A相电流: 280–340 A range
- B相电流: 260–320 A range
- C相电流: 270–330 A range

Values are defined as static arrays in the ECharts config object.

### Power Trend Chart (Active / Reactive)

12 data points, same time axis:

- 有功功率: 100–140 kW range
- 无功功率: 30–50 kvar range

Wave shape is offset from the current trend chart so the two charts look visually distinct.

### Filter Form (Cabinet + Datetime)

The existing filter form (cabinet selector + datetime range picker) is preserved. Submitting the filter does not trigger any API call or chart update. Chart data is fixed regardless of filter selection.

---

## File Changes Summary

Only one file is modified: `client/src/pages/scada/monitor/meter_management.tsx`

1. Add `MOCK_METERS` constant (6 records) at the top of the file
2. Add `data: { mockMeters: MOCK_METERS }` to the page schema
3. Replace `api: api_crud_search` with `source: "$mockMeters"` in the CRUD component; remove `searchIdentity`
4. Replace `api: meter_create` with inline mock adaptor
5. Replace `api: meter_delete` with inline mock adaptor
6. Update metric card values to static mock values
7. Replace chart series data with realistic static arrays

---

## Future Migration Path

When the real backend is implemented:

1. Remove `MOCK_METERS` constant and `data.mockMeters` from page schema
2. Restore `api: api_crud_search` + `searchIdentity: "MMeter"` on the CRUD
3. Restore `api: meter_create` and `api: meter_delete` (remove mock adaptors)
4. Connect `meter_power_data` API to the stats tab filter form and charts
