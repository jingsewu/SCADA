package org.openwes.scada.core.infrastructure.persistence.mapper;

import org.openwes.scada.core.infrastructure.persistence.po.ColorConfigPO;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ColorConfigPORepository extends JpaRepository<ColorConfigPO, Long> {
}
