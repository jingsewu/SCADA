package org.openwes.scada.core.infrastructure.persistence.mapper;

import org.openwes.scada.core.infrastructure.persistence.po.ConveyorModelPO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConveyorModelPORepository extends JpaRepository<ConveyorModelPO, Long> {
    List<ConveyorModelPO> findAllByAreaCode(String area);
}
