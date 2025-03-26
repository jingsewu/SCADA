package org.openwes.scada.core.infrastructure.persistence.mapper;

import org.openwes.scada.core.infrastructure.persistence.po.ConveyorLogPO;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConveyorLogPORepository extends JpaRepository<ConveyorLogPO, Long> {
}
