package org.openwes.scada.core.infrastructure.plc.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.plc4x.java.api.PlcConnection;
import org.apache.plc4x.java.api.messages.PlcReadRequest;
import org.apache.plc4x.java.api.messages.PlcReadResponse;
import org.openwes.scada.core.domain.entity.ConveyorModel;
import org.openwes.scada.core.domain.repository.ConveyorModelRepository;
import org.openwes.scada.core.infrastructure.plc.PLCConnectionFactory;
import org.openwes.scada.core.infrastructure.websocket.service.ScadaWebSocketService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PLCDataReaderService {

    private final PLCConnectionFactory connectionFactory;
    private final ScadaWebSocketService scadaWebSocketService;
    private final ConveyorModelRepository conveyorModelRepository;

    @Scheduled(fixedRate = 500)
    public void readAllConveyors() {

        List<ConveyorModel> conveyorModels = conveyorModelRepository.findAll();

        conveyorModels.forEach(conveyor -> {
            try (PlcConnection conn = connectionFactory.getConnection(conveyor.getPlcConfig())) {
                readConveyorNodes(conveyor, conn);
            } catch (Exception e) {
                log.error("Error reading PLC data", e);
            }
        });
    }

    private void readConveyorNodes(ConveyorModel conveyor, PlcConnection conn) {

        PlcReadRequest.Builder requestBuilder = conn.readRequestBuilder();

        conveyor.getNodes().forEach(node -> {
            requestBuilder.addTagAddress(node.getNodeCode(), node.getAddress());
        });

        try {
            PlcReadRequest request = requestBuilder.build();
            PlcReadResponse response = request.execute().get();
            conveyor.getNodes().forEach(node -> {
                boolean hasBox = response.getBoolean(node.getNodeCode());
                node.updateNodeState(hasBox);
            });
        } catch (Exception e) {
            log.error("Error reading PLC data", e);
        }

        scadaWebSocketService.broadcastMessage(conveyor, "");
    }
}
