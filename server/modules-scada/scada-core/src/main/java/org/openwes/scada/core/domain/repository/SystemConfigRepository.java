package org.openwes.scada.core.domain.repository;


import org.openwes.scada.core.domain.entity.SystemConfig;

public interface SystemConfigRepository {

    void save(SystemConfig systemConfig);

    SystemConfig findSystemConfig();

}
