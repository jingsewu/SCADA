package org.openwes.scada.api;

import jakarta.validation.Valid;
import org.openwes.scada.api.dto.ConveyorLogDTO;

public interface IConveyorLogApi {

    void create(@Valid ConveyorLogDTO conveyorLogDTO);
}
