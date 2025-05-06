package org.openwes.scada.core.domain.transfer;

import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;
import org.openwes.scada.api.dto.DeviceMonitorDTO;
import org.openwes.scada.core.domain.entity.DeviceMonitor;

import static org.mapstruct.NullValueCheckStrategy.ALWAYS;
import static org.mapstruct.NullValueMappingStrategy.RETURN_NULL;

@Mapper(componentModel = "spring",
        nullValueCheckStrategy = ALWAYS,
        nullValueMappingStrategy = RETURN_NULL,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface DeviceMonitorTransfer {
    DeviceMonitor toDO(DeviceMonitorDTO deviceMonitorDTO);
}
