package org.openwes.scada.core.domain.repository;

import org.openwes.scada.core.domain.entity.DeviceMonitor;

import java.util.List;

public interface DeviceMonitorRepository {

    void save(DeviceMonitor config);

    void delete(Long id);

    List<DeviceMonitor> findAll();

    void saveAll(List<DeviceMonitor> devices);
}
