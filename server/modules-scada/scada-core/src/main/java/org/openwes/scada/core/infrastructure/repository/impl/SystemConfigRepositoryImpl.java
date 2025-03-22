package org.openwes.scada.core.infrastructure.repository.impl;

import lombok.RequiredArgsConstructor;
import org.openwes.common.utils.constants.RedisConstants;
import org.openwes.scada.core.domain.entity.SystemConfig;
import org.openwes.scada.core.domain.repository.SystemConfigRepository;
import org.openwes.scada.core.infrastructure.persistence.mapper.SystemConfigPORepository;
import org.openwes.scada.core.infrastructure.persistence.po.SystemConfigPO;
import org.openwes.scada.core.infrastructure.persistence.transfer.SystemConfigPOTransfer;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SystemConfigRepositoryImpl implements SystemConfigRepository {

    private final SystemConfigPORepository systemConfigPORepository;
    private final SystemConfigPOTransfer systemConfigPOTransfer;

    @CacheEvict(cacheNames = RedisConstants.SYSTEM_CONFIG_CACHE, allEntries = true)
    @Override
    public void save(SystemConfig systemConfig) {
        systemConfigPORepository.save(systemConfigPOTransfer.toPO(systemConfig));
    }

    @Cacheable(cacheNames = RedisConstants.SYSTEM_CONFIG_CACHE)
    @Override
    public SystemConfig findSystemConfig() {
        Optional<SystemConfigPO> optional = systemConfigPORepository.findAll().stream().findFirst();
        return optional.map(systemConfigPOTransfer::toDO).orElse(null);
    }
}
