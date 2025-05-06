package org.openwes.scada.core.infrastructure.persistence.transfer;

import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;
import org.openwes.scada.core.domain.entity.DeviceMonitor;
import org.openwes.scada.core.infrastructure.persistence.po.DeviceMonitorPO;

import java.util.List;

import static org.mapstruct.NullValueCheckStrategy.ALWAYS;
import static org.mapstruct.NullValueMappingStrategy.RETURN_NULL;

@Mapper(componentModel = "spring",
        nullValueCheckStrategy = ALWAYS,
        nullValueMappingStrategy = RETURN_NULL,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface DeviceMonitorPOTransfer {
    DeviceMonitorPO toPO(DeviceMonitor deviceMonitor);

    List<DeviceMonitor> toDOs(List<DeviceMonitorPO> deviceMonitorPOS);

    Iterable<DeviceMonitorPO> toPOs(List<DeviceMonitor> devices);
}
