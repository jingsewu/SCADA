package org.openwes.scada.api;

import jakarta.validation.Valid;
import org.openwes.scada.api.dto.DeviceMonitorDTO;

public interface IDeviceMonitorApi {

    void create(@Valid DeviceMonitorDTO deviceMonitorDTO);

    void update(@Valid DeviceMonitorDTO deviceMonitorDTO);

    void delete(Long id);
}
