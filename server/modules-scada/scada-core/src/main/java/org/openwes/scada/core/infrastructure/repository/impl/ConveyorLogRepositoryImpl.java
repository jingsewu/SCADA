package org.openwes.scada.core.infrastructure.repository.impl;

import lombok.RequiredArgsConstructor;
import org.openwes.scada.core.domain.entity.ConveyorLog;
import org.openwes.scada.core.domain.repository.ConveyorLogRepository;
import org.openwes.scada.core.infrastructure.persistence.mapper.ConveyorLogPORepository;
import org.openwes.scada.core.infrastructure.persistence.transfer.ConveyorLogPOTransfer;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ConveyorLogRepositoryImpl implements ConveyorLogRepository {

    private final ConveyorLogPORepository conveyorLogPORepository;
    private final ConveyorLogPOTransfer conveyorLogPOTransfer;

    @Override
    public void save(ConveyorLog conveyorLog) {
        conveyorLogPORepository.save(conveyorLogPOTransfer.toPO(conveyorLog));
    }
}
