package org.openwes.scada.core.application;

import lombok.RequiredArgsConstructor;
import org.openwes.scada.api.IDeviceMonitorApi;
import org.openwes.scada.api.dto.DeviceMonitorDTO;
import org.openwes.scada.core.domain.repository.DeviceMonitorRepository;
import org.openwes.scada.core.domain.transfer.DeviceMonitorTransfer;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeviceMonitorApiImpl implements IDeviceMonitorApi {

    private final DeviceMonitorRepository deviceMonitorRepository;
    private final DeviceMonitorTransfer deviceMonitorPOTransfer;

    @Override
    public void create(DeviceMonitorDTO deviceMonitorDTO) {
        deviceMonitorRepository.save(deviceMonitorPOTransfer.toDO(deviceMonitorDTO));
    }

    @Override
    public void update(DeviceMonitorDTO deviceMonitorDTO) {
        deviceMonitorRepository.save(deviceMonitorPOTransfer.toDO(deviceMonitorDTO));
    }

    @Override
    public void delete(Long id) {
        deviceMonitorRepository.delete(id);
    }
}
