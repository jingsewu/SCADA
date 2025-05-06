package org.openwes.scada.core.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.openwes.scada.api.IDeviceMonitorApi;
import org.openwes.scada.api.dto.DeviceMonitorDTO;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("device-monitor")
@RequiredArgsConstructor
@Tag(name = "SCADA Module Api")
public class DeviceMonitorController {

    private final IDeviceMonitorApi deviceMonitorApi;

    @PostMapping("createOrUpdate")
    public void createOrUpdate(@RequestBody DeviceMonitorDTO deviceMonitorDTO) {
        if (deviceMonitorDTO.getId() == null) {
            deviceMonitorApi.create(deviceMonitorDTO);
            return;
        }
        deviceMonitorApi.update(deviceMonitorDTO);
    }

    @PostMapping("/delete/{id}")
    public void delete(@PathVariable("id") Long id) {
        deviceMonitorApi.delete(id);
    }
}
