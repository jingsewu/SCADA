package org.openwes.scada.core.domain.repository;

import org.openwes.scada.core.domain.entity.ConveyorLog;

public interface ConveyorLogRepository {
    void save(ConveyorLog conveyorLog);
}
