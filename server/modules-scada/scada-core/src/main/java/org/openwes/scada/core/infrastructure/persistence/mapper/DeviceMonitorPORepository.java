package org.openwes.scada.core.infrastructure.persistence.mapper;

import org.openwes.scada.core.infrastructure.persistence.po.DeviceMonitorPO;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceMonitorPORepository extends JpaRepository<DeviceMonitorPO, Long> {
}
