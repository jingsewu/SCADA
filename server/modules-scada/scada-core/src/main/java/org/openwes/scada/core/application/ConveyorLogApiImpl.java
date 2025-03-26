package org.openwes.scada.core.application;

import lombok.RequiredArgsConstructor;
import org.openwes.scada.api.IConveyorLogApi;
import org.openwes.scada.api.dto.ConveyorLogDTO;
import org.openwes.scada.core.domain.repository.ConveyorLogRepository;
import org.openwes.scada.core.domain.transfer.ConveyorLogTransfer;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

@Validated
@Service
@RequiredArgsConstructor
public class ConveyorLogApiImpl implements IConveyorLogApi {

    private final ConveyorLogRepository conveyorLogRepository;
    private final ConveyorLogTransfer conveyorLogTransfer;

    @Override
    public void create(ConveyorLogDTO conveyorLogDTO) {
        conveyorLogRepository.save(conveyorLogTransfer.toDO(conveyorLogDTO));
    }
}
