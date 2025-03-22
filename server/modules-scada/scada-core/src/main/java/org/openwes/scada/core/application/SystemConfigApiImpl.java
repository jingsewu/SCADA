package org.openwes.scada.core.application;

import lombok.RequiredArgsConstructor;
import org.openwes.scada.api.ISystemConfigApi;
import org.openwes.scada.api.dto.SystemConfigDTO;
import org.openwes.scada.core.domain.entity.SystemConfig;
import org.openwes.scada.core.domain.repository.SystemConfigRepository;
import org.openwes.scada.core.domain.transfer.SystemConfigTransfer;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;


@Validated
@RequiredArgsConstructor
@Service
public class SystemConfigApiImpl implements ISystemConfigApi {

    private final SystemConfigRepository systemConfigRepository;
    private final SystemConfigTransfer systemConfigTransfer;

    @Override
    public void save(SystemConfigDTO systemConfigDTO) {
        systemConfigRepository.save(systemConfigTransfer.toDO(systemConfigDTO));
    }

    @Override
    public void update(SystemConfigDTO systemConfigDTO) {
        SystemConfig systemConfig = systemConfigRepository.findSystemConfig();
        systemConfigTransfer.toDO(systemConfigDTO, systemConfig);
        systemConfigRepository.save(systemConfig);
    }

    @Override
    public SystemConfigDTO getSystemConfig() {
        return systemConfigTransfer.toDTO(systemConfigRepository.findSystemConfig());
    }

}
