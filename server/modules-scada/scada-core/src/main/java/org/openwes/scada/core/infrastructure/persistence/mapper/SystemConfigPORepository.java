package org.openwes.scada.core.infrastructure.persistence.mapper;

import org.openwes.scada.core.infrastructure.persistence.po.SystemConfigPO;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SystemConfigPORepository extends JpaRepository<SystemConfigPO, Long> {
}
