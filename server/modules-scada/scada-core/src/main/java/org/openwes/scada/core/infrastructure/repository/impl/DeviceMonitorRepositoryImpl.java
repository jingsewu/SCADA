package org.openwes.scada.core.infrastructure.repository.impl;

import lombok.RequiredArgsConstructor;
import org.openwes.scada.core.domain.entity.DeviceMonitor;
import org.openwes.scada.core.domain.repository.DeviceMonitorRepository;
import org.openwes.scada.core.infrastructure.persistence.mapper.DeviceMonitorPORepository;
import org.openwes.scada.core.infrastructure.persistence.transfer.DeviceMonitorPOTransfer;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class DeviceMonitorRepositoryImpl implements DeviceMonitorRepository {

    private final DeviceMonitorPORepository deviceMonitorPORepository;
    private final DeviceMonitorPOTransfer deviceMonitorPOTransfer;

    @Override
    public void save(DeviceMonitor config) {
        deviceMonitorPORepository.save(deviceMonitorPOTransfer.toPO(config));
    }

    @Override
    public void delete(Long id) {
        deviceMonitorPORepository.deleteById(id);
    }

    @Override
    public List<DeviceMonitor> findAll() {
        return deviceMonitorPOTransfer.toDOs(deviceMonitorPORepository.findAll());
    }

    @Override
    public void saveAll(List<DeviceMonitor> devices) {
        deviceMonitorPORepository.saveAll(deviceMonitorPOTransfer.toPOs(devices));
    }
}
