export const scada_color_config_create = "post:/scada/color-config/createOrUpdate"
export const scada_color_config_delete = "post:/scada/color-config/delete/${id}"

export const device_monitor_create = "post:/scada/device-monitor/createOrUpdate"
export const device_monitor_delete = "post:/scada/device-monitor/delete/${id}"

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

